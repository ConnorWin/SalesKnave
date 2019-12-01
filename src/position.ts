export class Position {
  constructor(public x: number, public y: number) {}

  scale(sx, sy = sx) {
    return new Position(this.x * sx, this.y * sy);
  }

  plus(xy) {
    return new Position(this.x + xy.x, this.y + xy.y);
  }

  minus(xy) {
    return this.plus(xy.scale(-1));
  }

  clone() {
    return new Position(this.x, this.y);
  }

  floor() {
    return new Position(Math.floor(this.x), Math.floor(this.y));
  }

  norm8() {
    return Math.max(Math.abs(this.x), Math.abs(this.y));
  }

  dist8(xy) {
    return this.minus(xy).norm8();
  }
}
