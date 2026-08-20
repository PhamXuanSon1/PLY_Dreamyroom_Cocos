System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec2, Ulis, BinaryHeap, AStar, _crd;

  function getNeightbors(grid, mapSize, condition) {
    if (condition === void 0) {
      condition = () => false;
    }

    var neighbors = [];
    var directions = [new Vec2(0, 1), // Up
    new Vec2(1, 0), // Right
    new Vec2(0, -1), // Down
    new Vec2(-1, 0) // Left
    // new Vec2(0, 2),   // Up
    // new Vec2(2, 0),   // Right
    // new Vec2(0, -2),  // Down
    // new Vec2(-2, 0),  // Left
    // new Vec2(1, 1),   // Up-Right
    // new Vec2(1, -1),  // Down-Right
    // new Vec2(-1, 1),  // Up-Left
    // new Vec2(-1, -1), // Down-Left
    ];
    directions = (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
      error: Error()
    }), Ulis) : Ulis).shuffleArray(directions);

    for (var dir of directions) {
      var neighbor = grid.clone().add(dir);

      if (!checkOutOfBounds(neighbor, mapSize)) {
        neighbors.push(neighbor);

        if (condition && condition(neighbor)) {
          var dir2 = dir.clone().multiplyScalar(2);
          var neighbor2 = grid.clone().add(dir2); // if (!checkOutOfBounds(neighbor2, mapSize)) {
          //     neighbors.push(neighbor2);
          // }
        }
      } else {// console.log("out",neighbor);
      }
    } // console.log(`Neighbors of ${grid.x}, ${grid.y}:`, neighbors);


    return neighbors;
  }

  function checkOutOfBounds(grid, mapSize) {
    // console.log(grid, mapSize);
    if (grid.x < 0 || grid.y < 0) return true;
    if (grid.x >= mapSize.x || grid.y >= mapSize.y) return true;
    return false;
  } // interface AStarNode {
  //     pos: Vec2;
  //     g: number;
  //     h: number;
  //     f: number;
  //     parent?: AStarNode;
  // }
  // export class AStar {
  //     /** Các ô được phép đi */
  //     private nodeSet = new Set<string>();
  //     constructor(private paths: Vec2[]) {
  //         for (const p of paths) {
  //             this.nodeSet.add(this.key(p));
  //         }
  //     }
  //     /**
  //      * Tìm đường từ start đến end
  //      */
  //     public find(start: Vec2, end: Vec2): Vec2[] {
  //         if (!this.nodeSet.has(this.key(start)))
  //             return [];
  //         if (!this.nodeSet.has(this.key(end)))
  //             return [];
  //         const open: AStarNode[] = [];
  //         const closed = new Set<string>();
  //         open.push({
  //             pos: start.clone(),
  //             g: 0,
  //             h: this.heuristic(start, end),
  //             f: this.heuristic(start, end)
  //         });
  //         while (open.length > 0) {
  //             // Lấy node có f nhỏ nhất
  //             open.sort((a, b) => a.f - b.f);
  //             const current = open.shift()!;
  //             // Đến đích
  //             if (current.pos.equals(end)) {
  //                 return this.buildPath(current);
  //             }
  //             closed.add(this.key(current.pos));
  //             const neighbors = this.getNeighbors(current.pos);
  //             for (const next of neighbors) {
  //                 const key = this.key(next);
  //                 if (closed.has(key))
  //                     continue;
  //                 const g = current.g + 1;
  //                 let node = open.find(n => n.pos.equals(next));
  //                 if (!node) {
  //                     node = {
  //                         pos: next.clone(),
  //                         g,
  //                         h: this.heuristic(next, end),
  //                         f: 0,
  //                         parent: current
  //                     };
  //                     node.f = node.g + node.h;
  //                     open.push(node);
  //                 }
  //                 else if (g < node.g) {
  //                     node.g = g;
  //                     node.f = node.g + node.h;
  //                     node.parent = current;
  //                 }
  //             }
  //         }
  //         return [];
  //     }
  //     /**
  //      * 4 hướng
  //      */
  //     private getNeighbors(pos: Vec2): Vec2[] {
  //         const dirs = [
  //             new Vec2(1, 0),
  //             new Vec2(-1, 0),
  //             new Vec2(0, 1),
  //             new Vec2(0, -1)
  //         ];
  //         const result: Vec2[] = [];
  //         for (const dir of dirs) {
  //             const next = new Vec2(
  //                 pos.x + dir.x,
  //                 pos.y + dir.y
  //             );
  //             if (this.nodeSet.has(this.key(next))) {
  //                 result.push(next);
  //             }
  //         }
  //         return result;
  //     }
  //     /**
  //      * Manhattan Distance
  //      */
  //     private heuristic(a: Vec2, b: Vec2): number {
  //         return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  //     }
  //     private buildPath(node: AStarNode): Vec2[] {
  //         const path: Vec2[] = [];
  //         let current: AStarNode | undefined = node;
  //         while (current) {
  //             path.unshift(current.pos.clone());
  //             current = current.parent;
  //         }
  //         return path;
  //     }
  //     private key(v: Vec2): string {
  //         return `${v.x},${v.y}`;
  //     }
  // }


  function _reportPossibleCrUseOfUlis(extras) {
    _reporterNs.report("Ulis", "./Ulis", _context.meta, extras);
  }

  _export({
    getNeightbors: getNeightbors,
    checkOutOfBounds: checkOutOfBounds,
    AStar: void 0
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec2 = _cc.Vec2;
    }, function (_unresolved_2) {
      Ulis = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "36595idYbdO8JK7ZCFQo7SW", "AStar", undefined);

      __checkObsolete__(['Director', 'director', 'game', 'Vec2']);

      BinaryHeap = class BinaryHeap {
        constructor() {
          this.items = [];
        }

        get length() {
          return this.items.length;
        }

        push(item) {
          item.heapIndex = this.items.length;
          this.items.push(item);
          this.bubbleUp(this.items.length - 1);
        }

        pop() {
          if (this.items.length === 0) return undefined;
          var first = this.items[0];
          var last = this.items.pop();

          if (this.items.length > 0) {
            this.items[0] = last;
            last.heapIndex = 0;
            this.bubbleDown(0);
          }

          first.heapIndex = -1;
          return first;
        }

        update(item) {
          var _item$heapIndex;

          var index = (_item$heapIndex = item.heapIndex) != null ? _item$heapIndex : -1;
          if (index < 0) return;
          this.bubbleUp(index);
          this.bubbleDown(index);
        }

        bubbleUp(index) {
          while (index > 0) {
            var parentIndex = Math.floor((index - 1) / 2);
            if (this.items[parentIndex].f <= this.items[index].f) break;
            this.swap(parentIndex, index);
            index = parentIndex;
          }
        }

        bubbleDown(index) {
          var length = this.items.length;

          while (true) {
            var smallest = index;
            var left = index * 2 + 1;
            var right = left + 1;

            if (left < length && this.items[left].f < this.items[smallest].f) {
              smallest = left;
            }

            if (right < length && this.items[right].f < this.items[smallest].f) {
              smallest = right;
            }

            if (smallest === index) break;
            this.swap(index, smallest);
            index = smallest;
          }
        }

        swap(a, b) {
          var temp = this.items[a];
          this.items[a] = this.items[b];
          this.items[b] = temp;
          this.items[a].heapIndex = a;
          this.items[b].heapIndex = b;
        }

      };

      _export("AStar", AStar = class AStar {
        constructor(paths) {
          this.grid = void 0;
          this.width = 0;
          this.height = 0;
          this.neighborCache = new Map();
          this.dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
          this.still = true;
          this.path = [];
          this.check = null;
          this.paths = paths;

          // tìm kích thước map
          for (var p of paths) {
            this.width = Math.max(this.width, p.x);
            this.height = Math.max(this.height, p.y);
          }

          this.width++;
          this.height++;
          this.grid = new Uint8Array(this.width * this.height); // đánh dấu ô đi được

          for (var _p of paths) {
            var id = this.toId(_p.x, _p.y);
            this.grid[id] = 1;
          }

          this.still = true;
        } // init(paths: Vec2[]) {
        //     // tìm kích thước map
        //     for (const p of paths) {
        //         this.width = Math.max(this.width, p.x);
        //         this.height = Math.max(this.height, p.y);
        //     }
        //     this.width++;
        //     this.height++;
        //     this.grid = new Uint8Array(
        //         this.width * this.height
        //     );
        //     // đánh dấu ô đi được
        //     for (const p of paths) {
        //         const id = this.toId(
        //             p.x,
        //             p.y
        //         );
        //         this.grid[id] = 1;
        //     }
        // }


        findStep(start, end) {
          // console.log("Start finding");        
          this.still = true;
          var startId = this.toId(start.x, start.y);
          var endId = this.toId(end.x, end.y);

          if (!this.grid[startId] || !this.grid[endId]) {
            this.still = false; // console.log("no path");

            this.path = [];
            return;
          }

          var open = new BinaryHeap();
          var openMap = new Map();
          var closed = new Uint8Array(this.grid.length);
          var h = this.heuristic(start.x, start.y, end.x, end.y);
          var first = {
            id: startId,
            g: 0,
            h,
            f: h
          };
          open.push(first);
          openMap.set(startId, first);
          var count = 0;
          var begin = performance.now();

          var check = () => {
            this.still = open.length > 0; // console.log(open.length);

            count++;

            if (this.still) {
              var current = open.pop();
              openMap.delete(current.id);

              if (current.id === endId) {
                this.still = false;
                this.path = this.buildPath(current);

                var _end = performance.now(); // console.log("Time",end-begin, count, this.path.length);
                // console.log("Build",this.path.length);


                return;
              }

              closed[current.id] = 1;

              for (var nextId of this.getNeighbors(current.id)) {
                if (closed[nextId]) continue;
                var g = current.g + 1;
                var node = openMap.get(nextId);

                if (!node) {
                  var pos = this.fromId(nextId);
                  node = {
                    id: nextId,
                    g,
                    h: this.heuristic(pos.x, pos.y, end.x, end.y),
                    f: 0,
                    parent: current
                  };
                  node.f = node.g + node.h;
                  open.push(node);
                  openMap.set(nextId, node);
                } else if (g < node.g) {
                  node.g = g;
                  node.f = node.g + node.h;
                  node.parent = current;
                  open.update(node);
                }
              }

              this.check = check;
            } else {
              this.still = false; // console.log("Not found",this.path);

              this.path = [];
              return;
            }
          };

          check();
        }

        find(start, end) {
          var startId = this.toId(start.x, start.y);
          var endId = this.toId(end.x, end.y);
          if (!this.grid[startId] || !this.grid[endId]) return [];
          var open = new BinaryHeap();
          var openMap = new Map();
          var closed = new Uint8Array(this.grid.length);
          var h = this.heuristic(start.x, start.y, end.x, end.y);
          var first = {
            id: startId,
            g: 0,
            h,
            f: h
          };
          open.push(first);
          openMap.set(startId, first);

          while (open.length > 0) {
            var current = open.pop();
            if (!current) break;
            openMap.delete(current.id);

            if (current.id === endId) {
              return this.buildPath(current);
            }

            closed[current.id] = 1;

            for (var nextId of this.getNeighbors(current.id)) {
              if (closed[nextId]) continue;
              var g = current.g + 1;
              var node = openMap.get(nextId);

              if (!node) {
                var pos = this.fromId(nextId);
                node = {
                  id: nextId,
                  g,
                  h: this.heuristic(pos.x, pos.y, end.x, end.y),
                  f: 0,
                  parent: current
                };
                node.f = node.g + node.h;
                open.push(node);
                openMap.set(nextId, node);
              } else if (g < node.g) {
                node.g = g;
                node.f = node.g + node.h;
                node.parent = current;
                open.update(node);
              }
            }
          }

          return [];
        }

        update(deltaTime) {
          if (this.still) {
            this.check && this.check();
          }
        }

        getNeighbors(id) {
          var cache = this.neighborCache.get(id);
          if (cache) return cache;
          var x = id % this.width;
          var y = Math.floor(id / this.width);
          var result = [];

          for (var d of this.dirs) {
            var nx = x + d[0];
            var ny = y + d[1];

            if (nx >= 0 && ny >= 0 && nx < this.width && ny < this.height) {
              var nid = this.toId(nx, ny);
              if (this.grid[nid]) result.push(nid);
            }
          }

          this.neighborCache.set(id, result);
          return result;
        }

        heuristic(x1, y1, x2, y2) {
          return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        }

        buildPath(node) {
          var result = [];

          while (node) {
            result.push(this.fromId(node.id));
            node = node.parent;
          }

          result.reverse();
          return result;
        }

        toId(x, y) {
          return y * this.width + x;
        }

        fromId(id) {
          return new Vec2(id % this.width, Math.floor(id / this.width));
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7eb8afb858184fb0895d052a246bbe383562ac7e.js.map