# -*- coding: utf-8 -*-
"""Convert a Spine 4.0 JSON skeleton + 4.x atlas into the Spine 3.8 formats.

Format differences handled
--------------------------
JSON
  * skeleton.spine version string
  * transform constraints : mixRotate/mixX/mixY/mixScaleX/mixScaleY/mixShearY
                            -> rotateMix/translateMix/scaleMix/shearMix
  * path constraints      : mixRotate/mixX/mixY -> rotateMix/translateMix
  * bone rotate timeline  : "value" -> "angle"
  * slot rgba timeline    : "rgba"  -> "color"
  * path position/spacing : "value" -> "position"/"spacing"
  * transform timelines   : per-axis mixes -> single translateMix/scaleMix
  * bezier curves         : 4.0 stores control points in absolute (time,value)
                            space, one group of 4 numbers per animated property.
                            3.8 stores a single curve per frame, normalised to
                            the frame's time/value box, written as
                            "curve": c1, "c2": c2, "c3": c3, "c4": c4.
                            Where 4.0 used a *different* ease per axis (which
                            3.8 cannot express) the interval is resampled into
                            linear sub-keys until the error is below tolerance.
  * everything else (bones, slots, skins, attachments, deform, drawOrder,
    events) already uses an identical layout in 3.8.

Atlas
  * "bounds: x,y,w,h"  -> "xy: x, y" + "size: w, h"
  * "offsets: ox,oy,ow,oh" -> "orig: ow, oh" + "offset: ox, oy"
  * "rotate: 90" -> "rotate: true"   (0 -> false)
  * page header rewritten to the strict 3.8 order:
    name / size / format / filter / repeat, and every region gets "index".
"""
import json, sys, collections

WARN = []
def warn(m):
    WARN.append(m)

MAX_SUBDIVISIONS = 16


# ---------------------------------------------------------------- helpers
def num(v):
    if isinstance(v, bool):
        return v
    f = float(v)
    r = round(f, 6)
    if r == int(r) and abs(r) < 1e15:
        return int(r)
    return r


def g(m, k, d=0.0):
    return float(m[k]) if k in m else float(d)


def bez(p0, p1, p2, p3, u):
    v = 1.0 - u
    return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3


def solve_u(x0, x1, x2, x3, x):
    """Parameter u of the cubic bezier whose x equals the given x (x monotonic)."""
    lo, hi = 0.0, 1.0
    for _ in range(40):
        mid = (lo + hi) * 0.5
        if bez(x0, x1, x2, x3, mid) < x:
            lo = mid
        else:
            hi = mid
    return (lo + hi) * 0.5


# ---------------------------------------------------------------- curves
def normalise(curve, prop, t1, t2, v1, v2):
    """4.0 absolute control points -> 3.8 normalised (c1, c2, c3, c4)."""
    cx1, cy1, cx2, cy2 = curve[prop * 4: prop * 4 + 4]
    dt = t2 - t1
    dv = v2 - v1
    c1 = (cx1 - t1) / dt
    c3 = (cx2 - t1) / dt
    if abs(dv) < 1e-9:
        return (c1, 0.0, c3, 1.0)          # value constant: curve is irrelevant
    return (c1, (cy1 - v1) / dv, c3, (cy2 - v1) / dv)


def eval40(curve, prop, t1, t2, v1, v2, t):
    """Value of one 4.0 property at time t inside [t1, t2]."""
    if curve is None:
        return v1 + (v2 - v1) * (t - t1) / (t2 - t1)
    cx1, cy1, cx2, cy2 = curve[prop * 4: prop * 4 + 4]
    return bez(v1, cy1, cy2, v2, solve_u(t1, cx1, cx2, t2, t))


def eval38(c, t1, t2, v1, v2, t):
    """Value of one 3.8 property (shared normalised curve c) at time t."""
    if c is None:
        return v1 + (v2 - v1) * (t - t1) / (t2 - t1)
    c1, c2, c3, c4 = c
    x = (t - t1) / (t2 - t1)
    pct = bez(0.0, c2, c4, 1.0, solve_u(0.0, c1, c3, 1.0, x))
    return v1 + (v2 - v1) * pct


# ---------------------------------------------------------------- generic timeline
def build_timeline(frames, get_vals, put_vals, label, tol, scales=None):
    """Convert one 4.0 multi-property timeline to 3.8 frames.

    get_vals(frame) -> list of float property values (4.0 property order)
    put_vals(out_frame_dict, values) writes them under the 3.8 key names
    tol      = largest acceptable deviation, in the timeline's own units
    scales   = optional per-property multiplier used only when measuring error
    """
    out = []
    n = len(frames)
    for i in range(n):
        f = frames[i]
        t1 = g(f, "time", 0)
        v1 = get_vals(f)
        if scales is None:
            sc = [1.0] * len(v1)
        else:
            sc = scales

        if i == n - 1:
            fr = collections.OrderedDict([("time", num(t1))])
            put_vals(fr, v1)
            out.append(fr)
            break

        nxt = frames[i + 1]
        t2 = g(nxt, "time", 0)
        v2 = get_vals(nxt)
        curve = f.get("curve")

        if isinstance(curve, str):                       # stepped
            fr = collections.OrderedDict([("time", num(t1))])
            put_vals(fr, v1)
            fr["curve"] = "stepped"
            out.append(fr)
            continue

        if curve is None or t2 <= t1:                    # linear
            fr = collections.OrderedDict([("time", num(t1))])
            put_vals(fr, v1)
            out.append(fr)
            continue

        # pick the property with the biggest delta as the shared 3.8 curve
        deltas = [abs(v2[j] - v1[j]) * sc[j] for j in range(len(v1))]
        ref = max(range(len(v1)), key=lambda j: deltas[j])
        shared = normalise(curve, ref, t1, t2, v1[ref], v2[ref])

        # how far off would the other properties be with that shared curve?
        err = 0.0
        for j in range(len(v1)):
            if abs(v2[j] - v1[j]) < 1e-12:
                continue
            for s in range(1, 16):
                t = t1 + (t2 - t1) * s / 16.0
                a = eval40(curve, j, t1, t2, v1[j], v2[j], t)
                b = eval38(shared, t1, t2, v1[j], v2[j], t)
                err = max(err, abs(a - b) * sc[j])

        if err <= tol:
            fr = collections.OrderedDict([("time", num(t1))])
            put_vals(fr, v1)
            c1, c2, c3, c4 = shared
            fr["curve"] = num(c1); fr["c2"] = num(c2)
            fr["c3"] = num(c3); fr["c4"] = num(c4)
            out.append(fr)
            continue

        # 3.8 cannot ease each axis differently -> resample into linear sub-keys
        def linear_error(k):
            worst = 0.0
            for j in range(len(v1)):
                for s in range(k * 4 + 1):
                    t = t1 + (t2 - t1) * s / (k * 4.0)
                    a = eval40(curve, j, t1, t2, v1[j], v2[j], t)
                    u = (t - t1) / (t2 - t1) * k
                    lo = min(int(u), k - 1)
                    ta = t1 + (t2 - t1) * lo / k
                    tb = t1 + (t2 - t1) * (lo + 1) / k
                    va = eval40(curve, j, t1, t2, v1[j], v2[j], ta)
                    vb = eval40(curve, j, t1, t2, v1[j], v2[j], tb)
                    worst = max(worst, abs(a - (va + (vb - va) * (t - ta) / (tb - ta))) * sc[j])
            return worst

        k, resid = MAX_SUBDIVISIONS, None
        for cand in (2, 3, 4, 6, 8, 12, MAX_SUBDIVISIONS):
            resid = linear_error(cand)
            if resid <= tol or cand == MAX_SUBDIVISIONS:
                k = cand
                break
        warn("%s: 4.0 eased each axis differently; interval %.4f-%.4f resampled into "
             "%d linear keys (residual %.4f)" % (label, t1, t2, k, resid))
        for s in range(k):
            t = t1 + (t2 - t1) * s / k
            vals = [eval40(curve, j, t1, t2, v1[j], v2[j], t) for j in range(len(v1))]
            fr = collections.OrderedDict([("time", num(t))])
            put_vals(fr, vals)
            out.append(fr)
    return out


# ---------------------------------------------------------------- constraints
def pick_translate_axis(xs, ys):
    """3.8 has one translateMix, 4.0 has mixX/mixY -> keep the meaningful axis."""
    if all(abs(v) < 1e-9 for v in xs) and any(abs(v) > 1e-9 for v in ys):
        return "y"
    return "x"


def read_transform_mixes(f):
    mixX = g(f, "mixX", 1)
    mixSX = g(f, "mixScaleX", 1)
    return [g(f, "mixRotate", 1), mixX, g(f, "mixY", mixX),
            mixSX, g(f, "mixScaleY", mixSX), g(f, "mixShearY", 1)]


def conv_transform_constraints(data, axis_of):
    out = []
    for c in data.get("transform", []):
        m = read_transform_mixes(c)
        axis = axis_of[c["name"]]
        t = collections.OrderedDict()
        t["name"] = c["name"]
        if "order" in c: t["order"] = c["order"]
        t["bones"] = list(c["bones"])
        t["target"] = c["target"]
        for k in ("rotation", "x", "y", "scaleX", "scaleY", "shearY"):
            if k in c: t[k] = num(c[k])
        if c.get("local"): t["local"] = True
        if c.get("relative"): t["relative"] = True
        t["rotateMix"] = num(m[0])
        t["translateMix"] = num(m[2] if axis == "y" else m[1])
        t["scaleMix"] = num(m[3])
        t["shearMix"] = num(m[5])
        if abs(m[1] - m[2]) > 1e-6:
            warn("transform constraint '%s': mixX=%s mixY=%s -> translateMix=%s "
                 "(3.8 has a single translateMix)" % (c["name"], m[1], m[2], t["translateMix"]))
        if abs(m[3] - m[4]) > 1e-6:
            warn("transform constraint '%s': mixScaleX=%s mixScaleY=%s -> scaleMix=%s"
                 % (c["name"], m[3], m[4], t["scaleMix"]))
        out.append(t)
    return out


def conv_path_constraints(data):
    out = []
    for c in data.get("path", []):
        mixX = g(c, "mixX", 1)
        mixY = g(c, "mixY", mixX)
        p = collections.OrderedDict()
        p["name"] = c["name"]
        if "order" in c: p["order"] = c["order"]
        p["bones"] = list(c["bones"])
        p["target"] = c["target"]
        for k in ("positionMode", "spacingMode", "rotateMode"):
            if k in c: p[k] = c[k]
        for k in ("rotation", "position", "spacing"):
            if k in c: p[k] = num(c[k])
        p["rotateMix"] = num(g(c, "mixRotate", 1))
        p["translateMix"] = num(mixX)
        if abs(mixX - mixY) > 1e-6:
            warn("path constraint '%s': mixX=%s mixY=%s -> translateMix=%s"
                 % (c["name"], mixX, mixY, mixX))
        out.append(p)
    return out


# ---------------------------------------------------------------- animations
def hex2rgba(h):
    return [int(h[j:j + 2], 16) / 255.0 for j in (0, 2, 4, 6)]


def rgba2hex(v):
    return "".join("%02x" % max(0, min(255, int(round(c * 255)))) for c in v)


BONE_DEFAULT = {"translate": 0.0, "scale": 1.0, "shear": 0.0}
BONE_TOL = {"translate": 0.25, "scale": 0.002, "shear": 0.05, "rotate": 0.05}


def conv_bone_timeline(kind, frames, label):
    if kind == "rotate":
        return build_timeline(
            frames,
            lambda f: [g(f, "value", 0)],
            lambda fr, v: fr.__setitem__("angle", num(v[0])),
            "%s.rotate" % label, BONE_TOL["rotate"])
    d = BONE_DEFAULT[kind]

    def put(fr, v):
        fr["x"] = num(v[0]); fr["y"] = num(v[1])
    return build_timeline(frames, lambda f: [g(f, "x", d), g(f, "y", d)], put,
                          "%s.%s" % (label, kind), BONE_TOL[kind])


def conv_slot_color(frames, label):
    def put(fr, v):
        fr["color"] = rgba2hex(v)
    # tolerance 0.6/255 -> under one 8-bit step
    return build_timeline(frames, lambda f: hex2rgba(f.get("color", "ffffffff")), put,
                          "%s.color" % label, 0.6 / 255.0)


def conv_slot_attachment(frames):
    out = []
    for f in frames:
        fr = collections.OrderedDict()
        fr["time"] = num(g(f, "time", 0))
        fr["name"] = f.get("name")
        out.append(fr)
    return out


def conv_transform_timeline(frames, axis, label):
    idx = 2 if axis == "y" else 1

    def put(fr, v):
        fr["rotateMix"] = num(v[0])
        fr["translateMix"] = num(v[idx])
        fr["scaleMix"] = num(v[3])
        fr["shearMix"] = num(v[5])
    # only the four properties 3.8 keeps may influence the shared curve choice
    keep = (0, idx, 3, 5)
    scales = [1.0 if j in keep else 0.0 for j in range(6)]
    return build_timeline(frames, read_transform_mixes, put, label, 0.002, scales=scales)


def conv_path_timeline(kind, frames, label):
    if kind in ("position", "spacing"):
        def put(fr, v):
            fr[kind] = num(v[0])
        return build_timeline(frames, lambda f: [g(f, "value", 0)], put,
                              "%s.%s" % (label, kind), 0.0005)

    def put(fr, v):
        fr["rotateMix"] = num(v[0]); fr["translateMix"] = num(v[1])
    return build_timeline(
        frames,
        lambda f: [g(f, "mixRotate", 1), g(f, "mixX", 1), g(f, "mixY", g(f, "mixX", 1))],
        put, "%s.mix" % label, 0.002, scales=[1.0, 1.0, 0.0])


def conv_deform(frames):
    out = []
    n = len(frames)
    for i, f in enumerate(frames):
        t1 = g(f, "time", 0)
        fr = collections.OrderedDict()
        fr["time"] = num(t1)
        if "offset" in f: fr["offset"] = f["offset"]
        if "vertices" in f: fr["vertices"] = [num(v) for v in f["vertices"]]
        if i + 1 < n:
            c = f.get("curve")
            if isinstance(c, str):
                fr["curve"] = "stepped"
            elif c is not None:
                dt = g(frames[i + 1], "time", 0) - t1
                if dt > 0:
                    # deform curves already use a 0..1 value axis
                    fr["curve"] = num((c[0] - t1) / dt)
                    fr["c2"] = num(c[1])
                    fr["c3"] = num((c[2] - t1) / dt)
                    fr["c4"] = num(c[3])
        out.append(fr)
    return out


def conv_animations(anims, axis_of):
    out = collections.OrderedDict()
    for name, a in anims.items():
        o = collections.OrderedDict()
        if "slots" in a:
            so = collections.OrderedDict()
            for slot, tls in a["slots"].items():
                t = collections.OrderedDict()
                for kind, frames in tls.items():
                    if kind == "rgba":
                        t["color"] = conv_slot_color(frames, "%s/%s" % (name, slot))
                    elif kind == "attachment":
                        t["attachment"] = conv_slot_attachment(frames)
                    elif kind in ("rgb", "alpha", "rgba2", "rgb2", "alpha2"):
                        warn("%s/%s: '%s' timeline has no 3.8 equivalent, dropped"
                             % (name, slot, kind))
                    else:
                        warn("%s/%s: unknown slot timeline '%s'" % (name, slot, kind))
                so[slot] = t
            o["slots"] = so
        if "bones" in a:
            bo = collections.OrderedDict()
            for bone, tls in a["bones"].items():
                t = collections.OrderedDict()
                for kind, frames in tls.items():
                    if kind in ("rotate", "translate", "scale", "shear"):
                        t[kind] = conv_bone_timeline(kind, frames, "%s/%s" % (name, bone))
                    else:
                        warn("%s/%s: single-axis timeline '%s' has no 3.8 equivalent, dropped"
                             % (name, bone, kind))
                bo[bone] = t
            o["bones"] = bo
        if "ik" in a:
            o["ik"] = a["ik"]
            warn("%s: ik timelines copied verbatim, please verify" % name)
        if "transform" in a:
            to = collections.OrderedDict()
            for cname, frames in a["transform"].items():
                to[cname] = conv_transform_timeline(frames, axis_of[cname],
                                                    "%s/transform/%s" % (name, cname))
            o["transform"] = to
        if "path" in a:
            po = collections.OrderedDict()
            for cname, tls in a["path"].items():
                t = collections.OrderedDict()
                for kind, frames in tls.items():
                    t[kind] = conv_path_timeline(kind, frames, "%s/path/%s" % (name, cname))
                po[cname] = t
            o["path"] = po
        if "deform" in a:
            d = collections.OrderedDict()
            for skin, slots in a["deform"].items():
                ds = collections.OrderedDict()
                for slot, atts in slots.items():
                    da = collections.OrderedDict()
                    for att, frames in atts.items():
                        da[att] = conv_deform(frames)
                    ds[slot] = da
                d[skin] = ds
            o["deform"] = d
        if "drawOrder" in a:
            dr = []
            for f in a["drawOrder"]:
                fr = collections.OrderedDict()
                fr["time"] = num(g(f, "time", 0))
                if "offsets" in f: fr["offsets"] = f["offsets"]
                dr.append(fr)
            o["drawOrder"] = dr
        if "events" in a:
            ev = []
            for f in a["events"]:
                fr = collections.OrderedDict()
                fr["time"] = num(g(f, "time", 0))
                fr["name"] = f["name"]
                for k in ("int", "float", "string", "volume", "balance"):
                    if k in f: fr[k] = f[k]
                ev.append(fr)
            o["events"] = ev
        for k in a:
            if k not in ("slots", "bones", "ik", "transform", "path",
                         "deform", "drawOrder", "events"):
                warn("%s: unhandled animation section '%s'" % (name, k))
        out[name] = o
    return out


# ---------------------------------------------------------------- skeleton
# NB: the 3.8 runtimes explicitly reject the string "3.8.75"
# (SkeletonJson: throw "Unsupported skeleton data..."), so tag the
# output as the final 3.8 release instead.
def convert_json(src, dst, version="3.8.99"):
    d = json.load(open(src, encoding="utf-8"))

    axis_of = {}
    for c in d.get("transform", []):
        m = read_transform_mixes(c)
        xs, ys = [m[1]], [m[2]]
        for a in d.get("animations", {}).values():
            for f in a.get("transform", {}).get(c["name"], []):
                v = read_transform_mixes(f)
                xs.append(v[1]); ys.append(v[2])
        axis_of[c["name"]] = pick_translate_axis(xs, ys)

    o = collections.OrderedDict()
    sk = collections.OrderedDict(d["skeleton"])
    sk["spine"] = version
    o["skeleton"] = sk
    o["bones"] = [dict(b) for b in d["bones"]]      # identical layout in 3.8
    o["slots"] = [dict(s) for s in d["slots"]]      # identical layout in 3.8
    if "ik" in d:
        o["ik"] = d["ik"]
    if "transform" in d:
        o["transform"] = conv_transform_constraints(d, axis_of)
    if "path" in d:
        o["path"] = conv_path_constraints(d)
    if "skins" in d:
        o["skins"] = d["skins"]        # 3.8 already uses the array-with-name form
    if "events" in d:
        o["events"] = d["events"]
    o["animations"] = conv_animations(d.get("animations", {}), axis_of)

    with open(dst, "w", encoding="utf-8") as f:
        json.dump(o, f, ensure_ascii=False, separators=(",", ":"))
    return axis_of


# ---------------------------------------------------------------- atlas
def convert_atlas(src, dst):
    lines = open(src, encoding="utf-8").read().replace("\r\n", "\n").split("\n")
    out, i, n = [], 0, len(lines)

    def kv(line):
        k, _, v = line.partition(":")
        return k.strip(), [x.strip() for x in v.split(",")]

    while i < n and lines[i].strip() == "":
        i += 1
    while i < n:
        page = lines[i].strip()
        if page == "":
            i += 1
            continue
        i += 1
        props = {}
        while i < n and ":" in lines[i] and lines[i][:1] in (" ", "\t"):
            k, v = kv(lines[i]); props[k] = v; i += 1
        size = props.get("size", ["0", "0"])
        filt = props.get("filter", ["Nearest", "Nearest"])
        if props.get("pma", ["false"])[0] == "true":
            warn("atlas page '%s' is premultiplied (pma: true); the 3.8 atlas format has "
                 "no pma flag - enable straight-alpha/PMA on the material instead" % page)
        out.append(page)
        out.append("size: %s,%s" % (size[0], size[1]))
        out.append("format: %s" % props.get("format", ["RGBA8888"])[0])
        out.append("filter: %s,%s" % (filt[0], filt[1]))
        out.append("repeat: %s" % props.get("repeat", ["none"])[0])
        while i < n:
            name = lines[i]
            if name.strip() == "":
                i += 1
                break
            i += 1
            r = {}
            while i < n and ":" in lines[i] and lines[i][:1] in (" ", "\t"):
                k, v = kv(lines[i]); r[k] = v; i += 1
            x, y, w, h = (int(v) for v in r["bounds"])
            if "offsets" in r:
                ox, oy, ow, oh = (int(v) for v in r["offsets"])
            else:
                ox, oy, ow, oh = 0, 0, w, h
            deg = r.get("rotate", ["0"])[0]
            if deg in ("false", "0"):
                rot = "false"
            elif deg in ("true", "90"):
                rot = "true"
            else:
                raise ValueError("region '%s': rotate %s has no 3.8 equivalent"
                                 % (name.strip(), deg))
            out.append(name.strip())
            out.append("  rotate: %s" % rot)
            out.append("  xy: %d, %d" % (x, y))
            out.append("  size: %d, %d" % (w, h))
            if "split" in r:
                out.append("  split: %s" % ", ".join(r["split"]))
                if "pad" in r:
                    out.append("  pad: %s" % ", ".join(r["pad"]))
            out.append("  orig: %d, %d" % (ow, oh))
            out.append("  offset: %d, %d" % (ox, oy))
            out.append("  index: %s" % r.get("index", ["-1"])[0])
        out.append("")
    open(dst, "w", encoding="utf-8", newline="\n").write("\n".join(out).rstrip("\n") + "\n")


if __name__ == "__main__":
    src_json, dst_json, src_atlas, dst_atlas = sys.argv[1:5]
    axis = convert_json(src_json, dst_json)
    convert_atlas(src_atlas, dst_atlas)
    print("translateMix axis kept per transform constraint:", axis)
    uniq = sorted(set(WARN))
    print("--- %d notes ---" % len(uniq))
    for w in uniq:
        print(" *", w)
