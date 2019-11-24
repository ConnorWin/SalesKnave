import { Display, Map } from "rot-js/lib/index";

export class Game {
  private display: Display;
  private gameSize: { width: number; height: number };
  private map: { [key: string]: string | string[] } = {};

  constructor() {
    this.gameSize = { width: 75, height: 25 };

    this.display = new Display({
      width: this.gameSize.width,
      height: this.gameSize.height,
      fontSize: 20
    });
    document.body.appendChild(this.display.getContainer());
    this._generateMap();
  }

  private _generateMap() {
    const digger = new Map.Uniform(
      this.gameSize.width,
      this.gameSize.height,
      {}
    );
    const freeCells = [];

    digger.create((x, y, value) => {
      if (value) {
        return;
      }

      const key = this.key(x, y);
      this.map[key] = ".";
      freeCells.push(key);
    });

    this._drawWholeMap();
  }

  private _drawWholeMap() {
    for (var key in this.map) {
      const [x, y] = this.fromKey(key);
      this.display.draw(x, y, this.map[key], undefined, undefined);
      this.drawWalls(x, y);
    }
  }

  private drawWalls(x: number, y: number) {
    for (let dx = x - 1; dx <= x + 1; dx++) {
      for (let dy = y - 1; dy <= y + 1; dy++) {
        if (!this.map[this.key(dx, dy)]) {
          this.display.draw(dx, dy, "#", undefined, undefined);
        }
      }
    }
  }

  private key(x: number, y: number) {
    return `${x},${y}`;
  }

  private fromKey(key: string): [number, number] {
    const parts = key.split(",");
    const x = parseInt(parts[0]);
    const y = parseInt(parts[1]);

    return [x, y];
  }
}
