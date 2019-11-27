import { Display, Map } from "rot-js/lib/index";
import { Player } from "./player";
import { Position } from "./postition";
import { CharacterDrawling } from "./characterDrawling";

export class Game {
  private display: Display;
  private gameSize: { width: number; height: number };
  private map: { [key: string]: string | string[] } = {};
  private player: Player;

  constructor() {
    this.gameSize = { width: 75, height: 25 };

    this.display = new Display({
      width: this.gameSize.width,
      height: this.gameSize.height,
      fontSize: 20
    });
    document.body.appendChild(this.display.getContainer());
    this._generateMap();
    this.player = new Player(
      this,
      this.keyToPosition(Object.keys(this.map)[0])
    );
    this.drawCharacter(this.player.currentPosition, this.player.drawling);
  }

  public updateMap() {
    this.display.clear();
    this._drawWholeMap();
    this.drawCharacter(this.player.currentPosition, this.player.drawling);
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

  private drawCharacter(
    position: Position,
    characterDrawling: CharacterDrawling
  ) {
    this.display.draw(
      position.x,
      position.y,
      characterDrawling.symbol,
      characterDrawling.foregroundColor,
      characterDrawling.backgroundColor
    );
  }

  private key(x: number, y: number) {
    return `${x},${y}`;
  }
  private keyToPosition(key: string) {
    const splitKey = key.split(",");
    return new Position(
      Number.parseInt(splitKey[0]),
      Number.parseInt(splitKey[1])
    );
  }

  private fromKey(key: string): [number, number] {
    const parts = key.split(",");
    const x = parseInt(parts[0]);
    const y = parseInt(parts[1]);

    return [x, y];
  }

  possitionIsPassable(position: Position): boolean {
    return this.key(position.x, position.y) in this.map;
  }
}
