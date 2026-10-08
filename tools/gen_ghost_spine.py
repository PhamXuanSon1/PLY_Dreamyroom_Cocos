"""Generate Spine 4.2 skeletons (weighted mesh + bones + animations) for ghost sprites.

Usage: python gen_ghost_spine.py <sprites_dir> <out_dir> [preview_dir]
"""
import json, math, os, shutil, sys
import numpy as np
from PIL import Image

TAU = 2 * math.pi
FPS = 30


def S(t, period, phase=0.0):
    return math.sin(TAU * t / period + phase)


# ---------------------------------------------------------------------------
# Rig definitions. Coordinates are IMAGE pixels (x right, y down).
# bone: name, parent, origin (x,y), end (x,y), sigma (falloff px)
# ---------------------------------------------------------------------------
GHOSTS = {
    "char1": dict(  # seated, back view, hugging knees
        bones=[
            ("root", None, (180, 300), None, 0),
            ("body", "root", (180, 300), (190, 190), 55),
            ("head", "body", (195, 190), (205, 75), 45),
            ("tail1", "body", (125, 300), (85, 312), 22),
            ("tail2", "tail1", (85, 312), (65, 290), 16),
        ],
        anims={
            "idle": (3.0, {
                "root": lambda t: dict(ty=2 * S(t, 3.0)),
                "body": lambda t: dict(rot=1.5 * S(t, 3.0), sx=1 - 0.012 * S(t, 3.0), sy=1 + 0.025 * S(t, 3.0)),
                "head": lambda t: dict(rot=3.0 * S(t, 3.0, -0.7)),
                "tail1": lambda t: dict(rot=8 * S(t, 3.0, -1.0)),
                "tail2": lambda t: dict(rot=14 * S(t, 3.0, -1.8)),
            }),
        },
    ),
    "char2": dict(  # piano player
        bones=[
            ("root", None, (150, 300), None, 0),
            ("body", "root", (150, 300), (160, 170), 70),
            ("head", "body", (165, 165), (175, 70), 45),
            ("arm", "body", (195, 200), (245, 225), 22),
            ("hand", "arm", (245, 225), (300, 212), 20),
            ("tail1", "body", (225, 285), (265, 300), 18),
            ("tail2", "tail1", (265, 300), (298, 335), 14),
        ],
        anims={
            "play_piano": (2.0, {
                "root": lambda t: dict(ty=1.5 * abs(S(t, 1.0))),
                "body": lambda t: dict(rot=2.0 * S(t, 1.0), sy=1 + 0.02 * abs(S(t, 1.0))),
                "head": lambda t: dict(rot=5.0 * S(t, 1.0, 0.6)),
                # slide along the keyboard + quick key presses
                "arm": lambda t: dict(rot=-5 * max(0.0, S(t, 0.25)) ** 2 + 2.5 * S(t, 2.0),
                                      tx=4 * S(t, 2.0)),
                "hand": lambda t: dict(rot=-9 * max(0.0, S(t, 0.25, 0.9)) ** 2 + 3 * S(t, 0.5)),
                "tail1": lambda t: dict(rot=6 * S(t, 2.0, -1.0)),
                "tail2": lambda t: dict(rot=12 * S(t, 2.0, -1.8)),
            }),
        },
    ),
    "char3": dict(  # floating, reading a book
        bones=[
            ("root", None, (145, 240), None, 0),
            ("body", "root", (145, 245), (145, 170), 60),
            ("head", "body", (145, 170), (150, 60), 50),
            ("book", "body", (170, 215), (260, 185), 32),
            ("tail1", "body", (150, 255), (152, 305), 24),
            ("tail2", "tail1", (152, 305), (130, 360), 20),
        ],
        anims={
            "idle": (3.0, {
                "root": lambda t: dict(ty=6 * S(t, 3.0)),
                "body": lambda t: dict(rot=1.5 * S(t, 3.0, -0.3)),
                "head": lambda t: dict(rot=3.0 * S(t, 3.0, -0.8)),
                "book": lambda t: dict(rot=2.5 * S(t, 3.0, 0.8)),
                "tail1": lambda t: dict(rot=10 * S(t, 3.0, -1.0)),
                "tail2": lambda t: dict(rot=16 * S(t, 3.0, -1.9)),
            }),
        },
    ),
    "char4": dict(  # floating, arm stretched out
        bones=[
            ("root", None, (140, 170), None, 0),
            ("body", "root", (140, 200), (140, 140), 45),
            ("head", "body", (140, 145), (140, 60), 40),
            ("arm", "body", (172, 135), (232, 105), 20),
            ("tail1", "body", (130, 212), (95, 216), 18),
            ("tail2", "tail1", (95, 216), (68, 228), 14),
        ],
        anims={
            "idle": (2.4, {
                "root": lambda t: dict(ty=6 * S(t, 2.4)),
                "body": lambda t: dict(rot=2.0 * S(t, 2.4, -0.3)),
                "head": lambda t: dict(rot=4.0 * S(t, 2.4, -0.8)),
                "arm": lambda t: dict(rot=7 * S(t, 1.2)),
                "tail1": lambda t: dict(rot=12 * S(t, 2.4, -1.0)),
                "tail2": lambda t: dict(rot=18 * S(t, 2.4, -1.9)),
            }),
        },
    ),
}

GRID = 18  # mesh resolution (cells per long side)


def to_spine(p, w, h):
    """image px -> spine/world coords (origin at image center, y up)."""
    return (p[0] - w / 2.0, h / 2.0 - p[1])


def seg_dist(p, a, b):
    ax, ay = a; bx, by = b; px, py = p
    dx, dy = bx - ax, by - ay
    L = dx * dx + dy * dy
    u = 0 if L == 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / L))
    return math.hypot(px - (ax + u * dx), py - (ay + u * dy))


def build(name, cfg, img):
    w, h = img.size
    alpha = np.array(img)[:, :, 3]
    bones = cfg["bones"]
    idx = {b[0]: i for i, b in enumerate(bones)}
    world = {b[0]: to_spine(b[2], w, h) for b in bones}

    # --- grid mesh over the alpha bbox (with padding) ---
    x0, y0, x1, y1 = Image.fromarray(alpha).getbbox()
    x0, y0 = max(0, x0 - 4), max(0, y0 - 4)
    x1, y1 = min(w, x1 + 4), min(h, y1 + 4)
    nx = max(2, round(GRID * (x1 - x0) / max(x1 - x0, y1 - y0)))
    ny = max(2, round(GRID * (y1 - y0) / max(x1 - x0, y1 - y0)))
    xs = np.linspace(x0, x1, nx + 1)
    ys = np.linspace(y0, y1, ny + 1)
    verts = [(float(x), float(y)) for y in ys for x in xs]

    def vid(i, j):
        return j * (nx + 1) + i

    tris = []
    for j in range(ny):
        for i in range(nx):
            cx0, cx1 = int(xs[i]), int(math.ceil(xs[i + 1]))
            cy0, cy1 = int(ys[j]), int(math.ceil(ys[j + 1]))
            if alpha[cy0:cy1, cx0:cx1].max() == 0:
                continue
            a, b, c, d = vid(i, j), vid(i + 1, j), vid(i + 1, j + 1), vid(i, j + 1)
            tris += [a, b, c, a, c, d]
    used = sorted(set(tris))
    remap = {o: n for n, o in enumerate(used)}
    verts = [verts[o] for o in used]
    tris = [remap[t] for t in tris]

    # --- skin weights ---
    vtx_out, uvs, weights_dbg = [], [], []
    for (px, py) in verts:
        uvs += [round(px / w, 5), round(py / h, 5)]
        ws = []
        for b in bones:
            bname, parent, o, e, sigma = b
            if e is None:
                continue
            d = seg_dist((px, py), o, e)
            ws.append((math.exp(-(d / sigma) ** 2) + 1e-6, bname))
        ws.sort(reverse=True)
        ws = ws[:4]
        ws = [x for x in ws if x[0] > 0.02 * ws[0][0]]
        tot = sum(x[0] for x in ws)
        sx, sy = to_spine((px, py), w, h)
        vtx_out.append(len(ws))
        dbg = []
        for wv, bname in ws:
            bx, by = world[bname]
            vtx_out += [idx[bname], round(sx - bx, 2), round(sy - by, 2), round(wv / tot, 4)]
            dbg.append((bname, wv / tot))
        weights_dbg.append(dbg)

    # --- skeleton json ---
    jb = []
    for bname, parent, o, e, sigma in bones:
        wx, wy = world[bname]
        entry = {"name": bname}
        if parent:
            pwx, pwy = world[parent]
            entry["parent"] = parent
            entry["x"], entry["y"] = round(wx - pwx, 2), round(wy - pwy, 2)
        else:
            entry["x"], entry["y"] = round(wx, 2), round(wy, 2)
        if e is not None:
            ex, ey = to_spine(e, w, h)
            entry["length"] = round(math.hypot(ex - wx, ey - wy), 2)
        jb.append(entry)

    anims = {}
    for aname, (T, chans) in cfg["anims"].items():
        n = int(round(T * FPS))
        abones = {}
        for bname, fn in chans.items():
            rot, tr, sc = [], [], []
            for k in range(n + 1):
                t = k / FPS
                v = fn(t % T if k < n else 0.0)  # last key == first key: seamless loop
                tt = round(t, 4)
                if "rot" in v:
                    rot.append({"time": tt, "value": round(v["rot"], 3)})
                if "tx" in v or "ty" in v:
                    tr.append({"time": tt, "x": round(v.get("tx", 0), 3), "y": round(v.get("ty", 0), 3)})
                if "sx" in v or "sy" in v:
                    sc.append({"time": tt, "x": round(v.get("sx", 1), 4), "y": round(v.get("sy", 1), 4)})
            ch = {}
            if rot: ch["rotate"] = rot
            if tr: ch["translate"] = tr
            if sc: ch["scale"] = sc
            abones[bname] = ch
        anims[aname] = {"bones": abones}

    skel = {
        "skeleton": {"hash": name, "spine": "4.2.43", "x": -w / 2, "y": -h / 2, "width": w, "height": h},
        "bones": jb,
        "slots": [{"name": name, "bone": "root", "attachment": name}],
        "skins": [{"name": "default", "attachments": {name: {name: {
            "type": "mesh", "uvs": uvs, "triangles": tris, "vertices": vtx_out,
            "hull": 0, "width": w, "height": h}}}}],
        "animations": anims,
    }
    atlas = f"{name}.png\nsize:{w},{h}\nfilter:Linear,Linear\npma:false\n{name}\nbounds:0,0,{w},{h}\n"
    return skel, atlas, dict(verts=verts, tris=tris, weights=weights_dbg, world=world)


# ---------------------------------------------------------------------------
# Tiny CPU skinning preview (to validate weights / motion without the editor)
# ---------------------------------------------------------------------------
def pose_world(skel, anim_fns, t):
    """Return per-bone 2x3 world matrices for time t."""
    mats = {}
    for b in skel["bones"]:
        v = anim_fns[b["name"]](t) if b["name"] in anim_fns else {}
        r = math.radians(v.get("rot", 0))
        sx, sy = v.get("sx", 1), v.get("sy", 1)
        lx, ly = b.get("x", 0) + v.get("tx", 0), b.get("y", 0) + v.get("ty", 0)
        local = np.array([[math.cos(r) * sx, -math.sin(r) * sy, lx],
                          [math.sin(r) * sx, math.cos(r) * sy, ly], [0, 0, 1]])
        mats[b["name"]] = (mats[b["parent"]] @ local) if "parent" in b else local
    return mats


def render_frame(img, skel, anim_fns, t, canvas):
    w, h = img.size
    names = [b["name"] for b in skel["bones"]]
    mats = pose_world(skel, anim_fns, t)
    att = list(skel["skins"][0]["attachments"].values())[0]
    att = list(att.values())[0]
    v = att["vertices"]; uvs = att["uvs"]; tris = att["triangles"]
    pos, i = [], 0
    while i < len(v):
        n = v[i]; i += 1; x = y = 0.0
        for _ in range(n):
            bi, lx, ly, wt = v[i:i + 4]; i += 4
            m = mats[names[bi]]
            x += (m[0, 0] * lx + m[0, 1] * ly + m[0, 2]) * wt
            y += (m[1, 0] * lx + m[1, 1] * ly + m[1, 2]) * wt
        pos.append((x + canvas[0] / 2, canvas[1] / 2 - y))
    out = Image.new("RGBA", canvas, (40, 40, 40, 255))
    src = np.array(img)
    for k in range(0, len(tris), 3):
        ids = tris[k:k + 3]
        dst = np.array([pos[q] for q in ids])
        st = np.array([(uvs[2 * q] * w, uvs[2 * q + 1] * h) for q in ids])
        # affine dst->src
        A = np.hstack([dst, np.ones((3, 1))])
        try:
            coef = np.linalg.solve(A, st)
        except np.linalg.LinAlgError:
            continue
        mnx, mny = np.floor(dst.min(0)).astype(int); mxx, mxy = np.ceil(dst.max(0)).astype(int)
        gx, gy = np.meshgrid(np.arange(mnx, mxx + 1), np.arange(mny, mxy + 1))
        P = np.stack([gx.ravel() + 0.5, gy.ravel() + 0.5], 1)
        # barycentric inside test
        d0, d1, d2 = dst
        def cross(a, b, p): return (b[0] - a[0]) * (p[:, 1] - a[1]) - (b[1] - a[1]) * (p[:, 0] - a[0])
        c0, c1, c2 = cross(d0, d1, P), cross(d1, d2, P), cross(d2, d0, P)
        inside = ((c0 >= 0) & (c1 >= 0) & (c2 >= 0)) | ((c0 <= 0) & (c1 <= 0) & (c2 <= 0))
        P = P[inside]; gxi = gx.ravel()[inside]; gyi = gy.ravel()[inside]
        if len(P) == 0:
            continue
        S_ = np.hstack([P, np.ones((len(P), 1))]) @ coef
        sxi = np.clip(S_[:, 0].astype(int), 0, w - 1); syi = np.clip(S_[:, 1].astype(int), 0, h - 1)
        ok = (gxi >= 0) & (gxi < canvas[0]) & (gyi >= 0) & (gyi < canvas[1])
        px = src[syi[ok], sxi[ok]]
        o = np.array(out)
        a = px[:, 3:4] / 255.0
        o[gyi[ok], gxi[ok], :3] = (px[:, :3] * a + o[gyi[ok], gxi[ok], :3] * (1 - a)).astype(np.uint8)
        out = Image.fromarray(o)
    return out


def main():
    sprites, out_dir = sys.argv[1], sys.argv[2]
    prev = sys.argv[3] if len(sys.argv) > 3 else None
    for name, cfg in GHOSTS.items():
        img = Image.open(os.path.join(sprites, f"{name}.png")).convert("RGBA")
        skel, atlas, dbg = build(name, cfg, img)
        d = os.path.join(out_dir, name)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, f"{name}.json"), "w") as f:
            json.dump(skel, f, separators=(",", ":"))
        with open(os.path.join(d, f"{name}.atlas.txt"), "w") as f:
            f.write(atlas)
        shutil.copyfile(os.path.join(sprites, f"{name}.png"), os.path.join(d, f"{name}.png"))
        nv = len(dbg["verts"]); nt = len(dbg["tris"]) // 3
        print(f"{name}: {nv} verts, {nt} tris, anims={list(cfg['anims'])}")
        if prev:
            os.makedirs(prev, exist_ok=True)
            for aname, (T, fns) in cfg["anims"].items():
                frames = [render_frame(img, skel, fns, k / 15.0, img.size) for k in range(int(T * 15))]
                frames[0].save(os.path.join(prev, f"{name}_{aname}.gif"), save_all=True,
                               append_images=frames[1:], duration=66, loop=0)
                # contact sheet of extremes
                sheet = Image.new("RGBA", (img.size[0] * 4, img.size[1]))
                for q, k in enumerate(np.linspace(0, len(frames) - 1, 4).astype(int)):
                    sheet.paste(frames[k], (q * img.size[0], 0))
                sheet.save(os.path.join(prev, f"{name}_{aname}_sheet.png"))


if __name__ == "__main__":
    main()
