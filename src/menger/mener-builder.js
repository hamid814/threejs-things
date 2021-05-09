const x = 'x';
const y = 'y';
const z = 'z';

const edgesIndexes = {
  corner: [0, 2, 4, 6, 8, 9, 10, 11, 12, 14, 16, 18],
  cornerDirections: [
    { i: 0, d: x },
    { i: 2, d: z },
    { i: 4, d: x },
    { i: 6, d: z },
    { i: 8, d: y },
    { i: 9, d: y },
    { i: 10, d: y },
    { i: 11, d: y },
    { i: 12, d: x },
    { i: 14, d: z },
    { i: 16, d: x },
    { i: 18, d: z },
  ],
  edgesDirections: {
    x: [
      { i: 0, d: z },
      { i: 2, d: x },
      { i: 3, d: x },
      { i: 5, d: x },
      { i: 6, d: x },
      { i: 7, d: y },
      { i: 8, d: y },
      { i: 9, d: z },
      { i: 11, d: x },
      { i: 12, d: x },
      { i: 14, d: x },
      { i: 15, d: x },
    ],
    y: [
      { i: 0, d: y },
      { i: 1, d: y },
      { i: 2, d: y },
      { i: 3, d: y },
      { i: 4, d: x },
      { i: 6, d: z },
      { i: 8, d: x },
      { i: 10, d: z },
      { i: 12, d: y },
      { i: 13, d: y },
      { i: 14, d: y },
      { i: 15, d: y },
    ],
    z: [
      { i: 0, d: x },
      { i: 1, d: z },
      { i: 3, d: z },
      { i: 4, d: z },
      { i: 6, d: z },
      { i: 7, d: y },
      { i: 8, d: y },
      { i: 9, d: x },
      { i: 10, d: z },
      { i: 12, d: z },
      { i: 13, d: z },
      { i: 15, d: z },
    ],
  },
};

const getEdgeDirection = (type, index, edgeDirection) => {
  if (type === 'corner') {
    const item = edgesIndexes.cornerDirections.filter((d) => {
      return d.i === index;
    })[0];

    return item.d;
  } else if (type === 'edge') {
    const item = edgesIndexes.edgesDirections[edgeDirection].filter((d) => {
      return d.i === index;
    })[0];

    if (item) {
      return item.d;
    } else {
      return item;
    }
  }
};

export const isCube = (v, width) => {
  /**
   * inputs:
   * v: class V, coord of the Cube
   * width: number
   *
   * outputs:
   * 0: not a cube
   * 1: a cube
   * 2: outside of the menger
   */

  function isCenterLinear(x, w) {
    // const aw = w / 3;
    // const ax = Math.ceil(x / aw);
    // return (ax - 1) % 2 === 1;

    // above is same as below

    return (Math.ceil(x / (w / 3)) - 1) % 2 === 1;
  }

  function isCenterSquare(x, y, width) {
    return isCenterLinear(x, width) && isCenterLinear(y, width);
  }

  function isCenter(w) {
    if (isCenterSquare(v.x, v.y, w)) return 0;
    if (isCenterSquare(v.y, v.z, w)) return 0;
    if (isCenterSquare(v.z, v.x, w)) return 0;

    if (w !== 3) {
      return isCenter(w / 3);
    } else {
      return 1;
    }
  }

  if (
    v.x > width ||
    v.x < 1 ||
    v.y > width ||
    v.y < 1 ||
    v.z > width ||
    v.z < 1
  ) {
    return 2;
  }

  return isCenter(width);
};

export class Menger {
  constructor(
    level = 1,
    cubeSize = 1,
    position = new V(0, 0, 0),
    mother = undefined,
    isEdge = undefined,
    direction = undefined
  ) {
    this.cubeMagnetude = cubeSize;
    this.level = level;
    this.cubeSize = 1;
    this.position = position || new V(0, 0, 0);
    this.width = Math.pow(3, level);
    this.children = [];
    this.childSize = this.width / 3;
    this.childrenType = null;
    this.mother = mother;
    this.isEdge = isEdge === undefined ? false : isEdge;
    this.direction = direction;
    this.center = new V(
      this.width / 2 + 0.5,
      this.width / 2 + 0.5,
      this.width / 2 + 0.5
    );
    this.centerToPosition = this.position.retsub(this.center);
    this.centerNegate = new V(-this.center.x, -this.center.y, -this.center.z);

    this.facesCount = 0;

    if (level === 1) {
      this.childrenType = 'cube';
    } else {
      this.childrenType = 'menger';
    }

    this.initChildren();
  }

  isNeighbour(v) {
    /**
     * inputs:
     * v: class V, coord of the Cube
     * width: number
     *
     * outputs:
     * 0: a cube
     * 1: not a cube
     * 2: outside of the menger
     */

    const width = Math.pow(3, this.level);

    function isCenterLinear(x, w) {
      // const aw = w / 3;
      // const ax = Math.ceil(x / aw);
      // return (ax - 1) % 2 === 1;

      // above is same as below

      return (Math.ceil(x / (w / 3)) - 1) % 2 === 1;
    }

    function isCenterSquare(x, y, width) {
      return isCenterLinear(x, width) && isCenterLinear(y, width);
    }

    function isCenter(w) {
      if (isCenterSquare(v.x, v.y, w)) return 1;
      if (isCenterSquare(v.y, v.z, w)) return 1;
      if (isCenterSquare(v.z, v.x, w)) return 1;

      if (w !== 3) {
        return isCenter(w / 3);
      } else {
        return 0;
      }
    }

    if (
      v.x > width ||
      v.x < 1 ||
      v.y > width ||
      v.y < 1 ||
      v.z > width ||
      v.z < 1
    ) {
      return 2;
    }

    const res = isCenter(width);

    return res;
  }

  static isCube(v, width) {
    /**
     * inputs:
     * v: class V, coord of the Cube
     * width: number
     *
     * outputs:
     * 0: not a cube
     * 1: a cube
     * 2: outside of the menger
     */

    function isCenterLinear(x, w) {
      // const aw = w / 3;
      // const ax = Math.ceil(x / aw);
      // return (ax - 1) % 2 === 1;

      // above is same as below

      return (Math.ceil(x / (w / 3)) - 1) % 2 === 1;
    }

    function isCenterSquare(x, y, width) {
      return isCenterLinear(x, width) && isCenterLinear(y, width);
    }

    function isCenter(w) {
      if (isCenterSquare(v.x, v.y, w)) return 0;
      if (isCenterSquare(v.y, v.z, w)) return 0;
      if (isCenterSquare(v.z, v.x, w)) return 0;

      if (w !== 3) {
        return isCenter(w / 3);
      } else {
        return 1;
      }
    }

    if (
      v.x > width ||
      v.x < 1 ||
      v.y > width ||
      v.y < 1 ||
      v.z > width ||
      v.z < 1
    ) {
      return 2;
    }

    return isCenter(width);
  }

  initChildren() {
    if (!this.mother) {
      // this is the mother menger
      let positions = [];

      const xP = this.center.x + this.childSize;
      const xM = this.center.x - this.childSize;
      const yP = this.center.y + this.childSize;
      const yM = this.center.y - this.childSize;
      const zP = this.center.z + this.childSize;
      const zM = this.center.z - this.childSize;

      // default positoins
      const dX = this.center.x;
      const dY = this.center.y;
      const dZ = this.center.z;

      positions[0] = new V(dX, yP, zM);
      positions[1] = new V(xP, yP, zM);
      positions[2] = new V(xP, yP, dZ);
      positions[3] = new V(xP, yP, zP);
      positions[4] = new V(dX, yP, zP);
      positions[5] = new V(xM, yP, zP);
      positions[6] = new V(xM, yP, dZ);
      positions[7] = new V(xM, yP, zM);

      positions[8] = new V(xP, dY, zP);
      positions[9] = new V(xP, dY, zM);
      positions[10] = new V(xM, dY, zM);
      positions[11] = new V(xM, dY, zP);

      positions[12] = new V(dX, yM, zM);
      positions[13] = new V(xP, yM, zM);
      positions[14] = new V(xP, yM, dZ);
      positions[15] = new V(xP, yM, zP);
      positions[16] = new V(dX, yM, zP);
      positions[17] = new V(xM, yM, zP);
      positions[18] = new V(xM, yM, dZ);
      positions[19] = new V(xM, yM, zM);

      if (this.childrenType === 'cube') {
        positions.forEach((pos, posIndex) => {
          const faces = [];

          for (let i = 0; i < facesIds.length; i++) {
            const face = facesIds[i];
            const facePos = face.position;

            const neighbourPos = new V(pos.x, pos.y, pos.z);
            neighbourPos.x += facePos.x;
            neighbourPos.y += facePos.y;
            neighbourPos.z += facePos.z;

            if (this.isNeighbour(neighbourPos)) {
              faces.push(face.id);
            }
          }

          this.addToFacesCount(faces.length);

          const child = new Cube(pos, this.childSize, faces);

          this.children.push(child);
        });
      } else if (this.childrenType === 'menger') {
        positions.forEach((pos, i) => {
          let isEdge = false;
          let direction = undefined;

          if (edgesIndexes['corner'].indexOf(i) !== -1) {
            direction = getEdgeDirection('corner', i);

            isEdge = true;
          }

          const child = new Menger(
            this.level - 1,
            this.cubeSize,
            pos,
            this,
            isEdge,
            direction
          );

          this.children.push(child);
        });
      }
    } else {
      // this is not the top level menger ( mother menger )
      let positions = [];

      // posiotns minus and plus one cubeSize
      const xP = this.position.x + this.childSize;
      const xM = this.position.x - this.childSize;
      const yP = this.position.y + this.childSize;
      const yM = this.position.y - this.childSize;
      const zP = this.position.z + this.childSize;
      const zM = this.position.z - this.childSize;

      // default positoins ( menger center )
      const dX = this.position.x;
      const dY = this.position.y;
      const dZ = this.position.z;

      if (!this.isEdge) {
        positions[0] = new V(dX, yP, zM);
        positions[1] = new V(xP, yP, zM);
        positions[2] = new V(xP, yP, dZ);
        positions[3] = new V(xP, yP, zP);
        positions[4] = new V(dX, yP, zP);
        positions[5] = new V(xM, yP, zP);
        positions[6] = new V(xM, yP, dZ);
        positions[7] = new V(xM, yP, zM);

        positions[8] = new V(xP, dY, zP);
        positions[9] = new V(xP, dY, zM);
        positions[10] = new V(xM, dY, zM);
        positions[11] = new V(xM, dY, zP);

        positions[12] = new V(dX, yM, zM);
        positions[13] = new V(xP, yM, zM);
        positions[14] = new V(xP, yM, dZ);
        positions[15] = new V(xP, yM, zP);
        positions[16] = new V(dX, yM, zP);
        positions[17] = new V(xM, yM, zP);
        positions[18] = new V(xM, yM, dZ);
        positions[19] = new V(xM, yM, zM);
      } else {
        // this child is an edge menger
        if (this.direction === x) {
          positions = [
            new V(dX, yP, dZ),
            new V(dX, yP, zM),
            new V(xP, yP, zM),
            new V(xP, yP, zP),
            new V(dX, yP, zP),
            new V(xM, yP, zP),
            new V(xM, yP, zM),

            new V(dX, dY, zM),
            new V(dX, dY, zP),

            new V(dX, yM, dZ),
            new V(dX, yM, zM),
            new V(xP, yM, zM),
            new V(xP, yM, zP),
            new V(dX, yM, zP),
            new V(xM, yM, zP),
            new V(xM, yM, zM),
          ];
        } else if (this.direction === y) {
          positions = [
            new V(xP, yP, zM),
            new V(xP, yP, zP),
            new V(xM, yP, zP),
            new V(xM, yP, zM),

            new V(dX, dY, zM),
            new V(xP, dY, zM),
            new V(xP, dY, dZ),
            new V(xP, dY, zP),
            new V(dX, dY, zP),
            new V(xM, dY, zP),
            new V(xM, dY, dZ),
            new V(xM, dY, zM),

            new V(xP, yM, zM),
            new V(xP, yM, zP),
            new V(xM, yM, zP),
            new V(xM, yM, zM),
          ];
        } else if (this.direction === z) {
          positions = [
            new V(dX, yP, dZ),
            new V(xP, yP, zM),
            new V(xP, yP, dZ),
            new V(xP, yP, zP),
            new V(xM, yP, zP),
            new V(xM, yP, dZ),
            new V(xM, yP, zM),

            new V(xP, dY, dZ),
            new V(xM, dY, dZ),

            new V(dX, yM, dZ),
            new V(xP, yM, zM),
            new V(xP, yM, dZ),
            new V(xP, yM, zP),
            new V(xM, yM, zP),
            new V(xM, yM, dZ),
            new V(xM, yM, zM),
          ];
        }
      }
      if (!this.isEdge) {
        if (this.childrenType === 'cube') {
          positions.forEach((pos) => {
            const faces = [];

            for (let i = 0; i < facesIds.length; i++) {
              const face = facesIds[i];
              const facePos = face.position;

              const neighbourPos = new V(pos.x, pos.y, pos.z);
              neighbourPos.x += facePos.x;
              neighbourPos.y += facePos.y;
              neighbourPos.z += facePos.z;

              if (this.mother.isNeighbour(neighbourPos)) {
                faces.push(face.id);
              }
            }

            this.mother.addToFacesCount(faces.length);

            const child = new Cube(pos, this.childSize, faces);

            this.children.push(child);
          });
        } else if (this.childrenType === 'menger') {
          positions.forEach((pos, i) => {
            let isEdge = false;
            let direction = undefined;

            if (edgesIndexes['corner'].indexOf(i) !== -1) {
              direction = getEdgeDirection('corner', i);

              isEdge = true;
            }

            const child = new Menger(
              this.level - 1,
              this.cubeSize,
              pos,
              this.mother,
              isEdge,
              direction
            );

            this.children.push(child);
          });
        }
      } else {
        // this child is an edge menger
        if (this.childrenType === 'cube') {
          positions.forEach((pos) => {
            const faces = [];

            for (let i = 0; i < facesIds.length; i++) {
              const face = facesIds[i];
              const facePos = face.position;

              const neighbourPos = new V(pos.x, pos.y, pos.z);
              neighbourPos.x += facePos.x;
              neighbourPos.y += facePos.y;
              neighbourPos.z += facePos.z;

              if (this.mother.isNeighbour(neighbourPos)) {
                faces.push(face.id);
              }
            }

            this.mother.addToFacesCount(faces.length);

            const child = new Cube(pos, this.childSize, faces);

            this.children.push(child);
          });
        } else if (this.childrenType === 'menger') {
          positions.forEach((pos, i) => {
            let isEdge = false;
            let direction = getEdgeDirection('edge', i, this.direction);

            if (direction) {
              isEdge = true;
            }

            const child = new Menger(
              this.level - 1,
              this.cubeSize,
              pos,
              this.mother,
              isEdge,
              direction
            );

            this.children.push(child);
          });
        }
      }
    }
  }

  addToFacesCount(number) {
    this.facesCount += number;
  }

  getPositions() {
    const list = [];

    if (this.childrenType === 'cube') {
      this.children.forEach((cube) => {
        const centerToPosition = this.mother
          ? this.mother.centerToPosition
          : this.centerToPosition;

        // const position = cube.position.retadd(centerToPosition);
        const position = cube.position;

        const cubeMagnetude = this.mother
          ? this.mother.cubeMagnetude
          : this.cubeMagnetude;
        const motherPos = this.mother ? this.mother.position : this.position;
        const centerNegate = this.mother
          ? this.mother.centerNegate
          : this.centerNegate;

        position.x += centerNegate.x;
        position.y += centerNegate.y;
        position.z += centerNegate.z;

        position.x *= cubeMagnetude;
        position.y *= cubeMagnetude;
        position.z *= cubeMagnetude;

        position.x += motherPos.x;
        position.y += motherPos.y;
        position.z += motherPos.z;

        list.push({
          position,
          faces: cube.faces,
        });
      });

      return list;
    } else if (this.childrenType === 'menger') {
      this.children.forEach((child) => {
        const poses = child.getPositions();

        poses.forEach((pos) => {
          list.push(pos);
        });
      });
      return list;
    }
  }

  drawP5() {
    this.children.forEach((child) => {
      child.drawP5();
    });
  }
}

class Cube {
  constructor(position, size, faces) {
    /**
     * faces is array of numbers wehre:
     * 11 is for x direction positive face
     * 10 is for x direction negative face
     * 21 is for y direction positive face
     * 20 is for y direction negative face
     * 31 is for z direction positive face
     * 30 is for z direction negative face
     */

    this.position = position;
    this.index = position;
    this.size = size;
    this.faces = faces;
  }

  drawP5() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    box(this.size, this.size, this.size);
    pop();
  }
}

export class V {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
  }

  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
  }

  mul(vec) {
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;
  }

  dev(vec) {
    this.x /= vec.x;
    this.y /= vec.y;
    this.z /= vec.z;
  }

  retsub(xOrV, y, z) {
    const newV = new V(this.x, this.y, this.z);

    if (y === undefined && z === undefined) {
      // a vector is passed in args
      newV.sub(xOrV);
    } else {
      // x, y ,z are passed in args
      const subV = new V(xOrV, y, z);

      newV.sub(subV);
    }

    return newV;
  }

  retadd(xOrV, y, z) {
    const newV = new V(this.x, this.y, this.z);

    if (y === undefined && z === undefined) {
      // a vector is passed is args

      newV.add(xOrV);
    } else {
      // x, y ,z are passed in args

      const addV = new V(xOrV, y, z);

      newV.add(addV);
    }

    return newV;
  }

  retmul(vec) {
    const newV = new V(this.x, this.y, this.z);

    newV.mul(vec);

    return newV;
  }

  retdev(vec) {
    const newV = new V(this.x, this.y, this.z);

    newV.dev(vec);

    return newV;
  }
}

// right, left, top, bottom, front, back
const facesIds = [
  {
    position: new V(+1, 0, 0),
    id: 11,
  },
  {
    position: new V(-1, 0, 0),
    id: 10,
  },
  {
    position: new V(0, +1, 0),
    id: 21,
  },
  {
    position: new V(0, -1, 0),
    id: 20,
  },
  {
    position: new V(0, 0, +1),
    id: 31,
  },
  {
    position: new V(0, 0, -1),
    id: 30,
  },
];
