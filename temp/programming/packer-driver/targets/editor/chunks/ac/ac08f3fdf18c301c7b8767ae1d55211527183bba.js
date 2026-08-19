System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, CCInteger, MeshRenderer, Vec3, Node, utils, v3, Quat, Mat4, toRadian, MeshCollider, v4, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _crd, ccclass, property, executeInEditMode, disallowMultiple, menu, SplineLineRenderer;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function rotateVector(A, B, angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const Bn = B.clone().normalize();
    const term1 = A.clone().multiplyScalar(cosA);
    const cross = new Vec3();
    Vec3.cross(cross, Bn, A);
    cross.multiplyScalar(sinA);
    const dot = Vec3.dot(Bn, A);
    const term3 = Bn.clone().multiplyScalar(dot * (1 - cosA));
    return term1.add(cross).add(term3);
  }

  function worldNormalToLocal(node, worldNormal) {
    // lấy worldMatrix của node
    const wm = node.worldMatrix; // lấy inverse-transpose

    const invTrans = new Mat4();
    Mat4.invert(invTrans, wm);
    Mat4.transpose(invTrans, invTrans); // transform normal

    const local = new Vec3();
    Vec3.transformMat4(local, worldNormal, invTrans);
    local.normalize();
    return local;
  }

  function orientNodeB(A, B, C, nodeB) {
    const a = A.worldPosition.clone();
    const b = B.worldPosition.clone();
    const c = C.worldPosition.clone();
    const BA = a.clone().subtract(b).normalize();
    const BC = c.clone().subtract(b).normalize(); // phân giác

    const bisector = BA.clone().add(BC).normalize(); // pháp tuyến mặt phẳng ABC

    const n = new Vec3();
    Vec3.cross(n, BA, BC);
    n.normalize(); // tạo quaternion từ hướng

    const rot = new Quat();
    Quat.fromViewUp(rot, bisector.negative(), n); // lưu ý: Quat.fromViewUp coi "forward" = -Z

    nodeB.setWorldRotation(rot);
    let angle = toRadian(90);
    let q = Quat.fromAxisAngle(new Quat(), n, angle);
    nodeB.rotate(q);
  } // Catmull-Rom spline interpolation


  function catmullRomWithoutTension(p0, p1, p2, p3, t, out = new Vec3()) {
    const t2 = t * t;
    const t3 = t2 * t;
    out.x = 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3); // 

    out.y = 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
    out.z = 0.5 * (2 * p1.z + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3);
    return out;
  }

  function catmullRom(p0, p1, p2, p3, t, tension) {
    const t2 = t * t;
    const t3 = t2 * t; // tính hệ số (m1, m2) có tension

    const m1 = Vec3.subtract(v3(), p2, p0).multiplyScalar((1 - tension) * 0.5);
    const m2 = Vec3.subtract(v3(), p3, p1).multiplyScalar((1 - tension) * 0.5);
    const a = 2 * t3 - 3 * t2 + 1;
    const b = t3 - 2 * t2 + t;
    const c = -2 * t3 + 3 * t2;
    const d = t3 - t2;
    const result = new Vec3();
    result.x = a * p1.x + b * m1.x + c * p2.x + d * m2.x;
    result.y = a * p1.y + b * m1.y + c * p2.y + d * m2.y;
    result.z = a * p1.z + b * m1.z + c * p2.z + d * m2.z;
    return result;
  } // Generate smooth polyline from node list


  function generateSmoothPoints(points, nSamples = 10, tension = 0) {
    if (points.length < 2) return points;
    const result = [];
    const n = points.length;

    for (let i = 0; i < n - 1; i++) {
      const p0 = i === 0 ? points[i] : points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i + 2 < n ? points[i + 2] : points[i + 1];

      for (let j = 0; j < nSamples; j++) {
        const t = j / nSamples;
        result.push(catmullRom(p0, p1, p2, p3, t, tension));
      }
    } // luôn thêm điểm cuối


    result.push(points[n - 1].clone());
    return result;
  }

  function generateHemisphereNodes(start, forward, radius, radialSegments, height = 1) {
    const nodes = [];
    let mid = Math.ceil(radialSegments / 4) + 1;
    let step = Math.PI / 2 / (mid - 1);

    for (let i = 1; i < mid; i++) {
      let node = start.clone().add(forward.clone().multiplyScalar(Math.sin(step * i) * radius * height));
      nodes.push(node);
    }

    return nodes;
  }

  _export({
    rotateVector: rotateVector,
    generateSmoothPoints: generateSmoothPoints,
    generateHemisphereNodes: generateHemisphereNodes
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      CCInteger = _cc.CCInteger;
      MeshRenderer = _cc.MeshRenderer;
      Vec3 = _cc.Vec3;
      Node = _cc.Node;
      utils = _cc.utils;
      v3 = _cc.v3;
      Quat = _cc.Quat;
      Mat4 = _cc.Mat4;
      toRadian = _cc.toRadian;
      MeshCollider = _cc.MeshCollider;
      v4 = _cc.v4;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9c778TrTKpBYoz92xBmzTgS", "SplineLineRenderer", undefined);

      __checkObsolete__(['_decorator', 'Component', 'CCInteger', 'MeshRenderer', 'Mesh', 'primitives', 'Vec3', 'Node', 'utils', 'v3', 'Quat', 'Mat4', 'toRadian', 'MeshCollider', 'v4']);

      ({
        ccclass,
        property,
        executeInEditMode,
        disallowMultiple,
        menu
      } = _decorator);

      _export("SplineLineRenderer", SplineLineRenderer = (_dec = ccclass('SplineLineRenderer'), _dec2 = executeInEditMode(true), _dec3 = disallowMultiple(true), _dec4 = menu('Custom/SplineLineRenderer'), _dec5 = property(Node), _dec6 = property({
        group: {
          name: 'CapsuleParameter',
          id: "0",
          displayOrder: 0
        },
        displayOrder: 0
      }), _dec7 = property({
        group: {
          name: 'CapsuleParameter',
          id: "0",
          displayOrder: 0
        },
        displayOrder: 1,
        type: CCInteger
      }), _dec8 = property({
        group: {
          name: 'CapsuleParameter',
          id: "0",
          displayOrder: 0
        },
        displayOrder: 2,
        type: CCInteger
      }), _dec9 = property({
        group: {
          name: 'CapsuleParameter',
          id: "0",
          displayOrder: 0
        },
        displayOrder: 3
      }), _dec10 = property({
        group: {
          name: 'CapsuleParameter',
          id: "0",
          displayOrder: 0
        },
        displayOrder: 4
      }), _dec11 = property(MeshRenderer), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = class SplineLineRenderer extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "pointNodes", _descriptor, this);

          this.points = [];

          _initializerDefineProperty(this, "radius", _descriptor2, this);

          _initializerDefineProperty(this, "radialSegments", _descriptor3, this);

          _initializerDefineProperty(this, "smoothStep", _descriptor4, this);

          _initializerDefineProperty(this, "tension", _descriptor5, this);

          _initializerDefineProperty(this, "height", _descriptor6, this);

          this.paraMap = new Map();

          _initializerDefineProperty(this, "meshRenderer", _descriptor7, this);

          _initializerDefineProperty(this, "generateColider", _descriptor8, this);

          this.generateColiderCheck = false;
          // @property({type: MeshCollider, visible: function(this: CapsuleLineRenderer) { return this.generateColider; }})
          this.meshCollider = null;
          this._mesh = null;
          this._geometry = null;
          this._options = null;
          this.pointLength = 0;
          this.posMap = new Map();
          this.scaleMap = new Map();
          this.positions = null;
          this.normals = null;
          this.uvs = null;
          this.uvArray = [];
          this.indices = null;
          this.indexArray = null;
          this.ringCount = 0;
          this.vertexCount = 0;
          this.smoothPoints = [];
          this.headPoints = [];
          this.tailPoints = [];
          this.tailPoint = null;
          this.headPoint = null;

          _initializerDefineProperty(this, "tilingMaterial", _descriptor9, this);

          this.changableMesh = false;
        }

        child(index) {
          if (index < 0) index = this.pointNodes.children.length + index;
          return this.pointNodes.children[index];
        }

        start() {
          this._initMesh();
        }

        checkEnableCollider() {
          if (this.generateColider !== this.generateColiderCheck) {
            this.generateColiderCheck = this.generateColider;

            if (this.generateColider) {
              this._initCollider();
            } else {
              this._despawnCollider();
            }
          }
        }

        _initCollider() {
          this.meshCollider = this.meshRenderer.node.getComponent(MeshCollider);

          if (!this.meshCollider) {
            this.meshCollider = this.meshRenderer.node.addComponent(MeshCollider);
          }

          this.meshCollider.mesh = this.meshRenderer.mesh;
        }

        _despawnCollider() {
          if (this.meshCollider) {
            this.meshCollider.destroy();
            this.meshCollider = null;
          }
        }

        calculateGeometry() {
          this.points = this.pointNodes.children;
          this.smoothPoints = generateSmoothPoints(this.points.map(point => point.worldPosition), this.smoothStep, this.tension);
          this.tailPoint = this.smoothPoints[0];
          this.headPoint = this.smoothPoints[this.smoothPoints.length - 1];
          let firstForward = this.smoothPoints[1].clone().subtract(this.tailPoint.clone()).normalize();
          this.headPoints = generateHemisphereNodes(this.tailPoint, firstForward.negative(), this.radius, this.radialSegments, this.height);
          this.headPoints.reverse();
          let lastForward = this.smoothPoints[this.smoothPoints.length - 1].clone().subtract(this.smoothPoints[this.smoothPoints.length - 2].clone()).normalize();
          this.tailPoints = generateHemisphereNodes(this.headPoint, lastForward, this.radius, this.radialSegments, this.height);
          this.smoothPoints = [...this.headPoints, ...this.smoothPoints, ...this.tailPoints];
          this.ringCount = this.smoothPoints.length;
          this.vertexCount = this.radialSegments * this.ringCount; // Typed arrays

          this.positions = new Float32Array(this.vertexCount * 3);
          this.normals = new Float32Array(this.vertexCount * 3);
          this.uvs = new Float32Array(this.vertexCount * 2); // Index buffer

          this.indices = [];
          let maxPos = new Vec3(0, 0, 0);
          let minPos = new Vec3(0, 0, 0);
          let forward = v3();
          let up = Vec3.UP;
          this.uvArray = [];
          let v = 0;
          let u = 0;
          let fLen = 0;

          for (let i = 0; i < this.ringCount; i++) {
            let point = this.smoothPoints[i];
            Vec3.max(maxPos, maxPos, point);
            Vec3.min(minPos, minPos, point);
            let next = this.smoothPoints[i + 1];
            let prev = this.smoothPoints[i - 1];

            if (next) {
              forward = next.clone().subtract(point.clone());
            } else if (prev) {
              forward = point.clone().subtract(prev.clone());
            }

            fLen = forward.length();
            forward.normalize();

            if (i === 0) {
              up = Vec3.UP.clone(); // chọn up ban đầu
            } else {
              v += fLen;
              let prevForward = point.clone().subtract(prev.clone()).normalize();
              let axis = prevForward.clone().cross(forward);

              if (axis.lengthSqr() > 1e-6) {
                axis.normalize();
                let angle = Math.acos(Math.min(1, Math.max(-1, prevForward.dot(forward))));
                let q = new Quat();
                Quat.fromAxisAngle(q, axis, angle);
                Vec3.transformQuat(up, up, q);
              }
            }

            for (let j = 0; j < this.radialSegments; j++) {
              let angle = j / this.radialSegments * Math.PI * 2;
              let u = (j - 1 + Math.floor(this.radialSegments / 2)) % this.radialSegments / this.radialSegments;
              this.uvArray.push(u, v);
              let normal = rotateVector(up, forward, angle);
              let radius = this.radius;

              if (i <= this.headPoints.length) {
                // rMul = i / this.headPoints.length               
                let dis = this.tailPoint.clone().subtract(point.clone()).length();
                radius = Math.sqrt(radius * radius - dis * dis);
              }

              if (i >= this.ringCount - this.tailPoints.length) {
                // rMul = (this.ringCount - 1 - i) / this.tailPoints.length;     
                let dis = this.headPoint.clone().subtract(point.clone()).length();
                radius = Math.sqrt(radius * radius - dis * dis);
              }

              let pos = point.clone().add(normal.clone().multiplyScalar(radius));
              let localPos = v3();
              this.meshRenderer.node.inverseTransformPoint(localPos, pos);
              let finalPos = localPos;
              finalPos.multiply(this.meshRenderer.node.worldScale); // apply world scale          

              this.positions.set([finalPos.x, finalPos.y, finalPos.z], (i * this.radialSegments + j) * 3);
              let localNormal = worldNormalToLocal(this.meshRenderer.node, normal); // localNormal = normal;              

              this.normals.set([localNormal.x, localNormal.y, localNormal.z], (i * this.radialSegments + j) * 3);
            }

            if (i == 0) continue;

            for (let j = 0; j < this.radialSegments; j++) {
              let nextJ = (j + 1) % this.radialSegments;
              this.indices.push(i * this.radialSegments + j);
              this.indices.push(i * this.radialSegments + nextJ);
              this.indices.push((i - 1) * this.radialSegments + j);
              this.indices.push((i - 1) * this.radialSegments + j);
              this.indices.push(i * this.radialSegments + nextJ);
              this.indices.push((i - 1) * this.radialSegments + nextJ);
            }
          }

          this.indexArray = new Uint16Array(this.indices);
          this.uvArray = this.uvArray.map((uv, i) => {
            if (i % 2 === 0) {
              return uv;
            } else {
              return uv / v; // normalize v to [0, 1]
            }
          }); // console.log(this.uvArray);

          this.uvs = new Float32Array(this.uvArray);
          this._geometry = {
            positions: this.positions,
            normals: this.normals,
            uvs: this.uvs,
            indices16: this.indexArray,
            maxPos: maxPos,
            minPos: minPos // primitiveMode: gfx.PrimitiveMode.TRIANGLE_LIST,

          };
          this.setPointMap();
        }

        updateMeshGeometry() {
          if (this.changableMesh) {
            this.changableMesh = false;
            this.changeOption();
          } else {
            this.meshRenderer.mesh.updateSubMesh(0, this._geometry);
            this.meshRenderer.onGeometryChanged();
          }

          if (this.generateColider) {
            this._despawnCollider();

            this._initCollider();
          }

          this.updateTiling();
        }

        updateTiling() {
          if (!this.tilingMaterial) return;
          let length = 0;
          this.smoothPoints.reduce((prev, curr) => {
            length += Vec3.distance(prev, curr);
            return curr;
          }, this.smoothPoints[0]);
          this.meshRenderer.material.setProperty('tilingOffset', v4(1.5, length, -0.2, 0));
        }

        changeOption() {
          this._options = {
            maxSubMeshes: 1,
            maxSubMeshIndices: this.indexArray.length,
            maxSubMeshVertices: this.vertexCount
          };
          this._mesh = utils.MeshUtils.createDynamicMesh(0, this._geometry, undefined, this._options);
          this.meshRenderer.mesh = this._mesh;
          this.updateMeshGeometry();
        }

        _initMesh() {
          this.calculateGeometry();
          this.changeOption();
        }

        setPointMap() {
          this.pointLength = this.points.length;
          this.points.forEach((point, index) => {
            this.posMap.set(index, point.position.clone());
            this.scaleMap.set(index, point.worldScale.clone());
          });
          this.paraMap.set("radius", this.radius);
          this.paraMap.set("smoothStep", this.smoothStep);
          this.paraMap.set("radialSegments", this.radialSegments);
          this.paraMap.set("tension", this.tension);
          this.paraMap.set("height", this.height);
        }

        checkPointChange() {
          if (this.pointLength !== this.pointNodes.children.length) {
            this.changableMesh = true;
            return true;
          }

          for (let [index, pos] of this.posMap) {
            let point = this.pointNodes.children[index];
            if (!point) return true;
            if (!point.position.equals(pos)) return true;
          }

          for (let [index, scale] of this.scaleMap) {
            let point = this.pointNodes.children[index];
            if (!point) return true;
            if (!point.worldScale.equals(scale)) return true;
          }

          let radius = this.paraMap.get("radius");
          let smoothStep = this.paraMap.get("smoothStep");
          let radialSegments = this.paraMap.get("radialSegments");
          let tension = this.paraMap.get("tension");
          let height = this.paraMap.get("height");

          if (smoothStep !== this.smoothStep || radialSegments !== this.radialSegments || radius !== this.radius || tension !== this.tension || height !== this.height) {
            this.changableMesh = true;
            return true;
          }

          return false;
        }

        onUpdate() {}

        _updateMesh() {
          if (this.checkPointChange()) {
            this.calculateGeometry();
            this.updateMeshGeometry();
            this.onUpdate();
          }
        }

        update() {
          this.checkEnableCollider();

          this._updateMesh();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "pointNodes", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "radius", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "radialSegments", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "smoothStep", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "tension", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "height", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "meshRenderer", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "generateColider", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "tilingMaterial", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      })), _class2)) || _class) || _class) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ac08f3fdf18c301c7b8767ae1d55211527183bba.js.map