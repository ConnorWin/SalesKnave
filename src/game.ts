import { Display, Map } from "rot-js/lib/index";
import { Player } from "./player";
import { Position } from "./position";
import { CharacterDrawling } from "./characterDrawling";
import { TextGenerator } from "./text-generator";
import { Room } from "rot-js/lib/map/features";

export class Game {
  private display: Display;
  private map: { [key: string]: string | string[] } = {};
  private player: Player;
  private generator = new TextGenerator();
  private gameSize = { width: 75, height: 25 };
  private currentRoomName = this.generator.getNextRoomName();
  private doors: Position[] = [];
  private rooms: Room[] = [];

  constructor() {
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
    this.player.keyPressed.on("position changed", () => {
      this.updateMap();
    });
    this.updateMap();
  }

  private updateMap() {
    this.display.clear();
    this._drawWholeMap();
    this.drawCharacter(this.player.currentPosition, this.player.drawling);
    this.drawRoomName();
  }

  private _generateMap() {
    const digger = new Map.Uniform(
      this.gameSize.width,
      this.gameSize.height - 3,
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

    digger.getRooms().forEach(r => {
      this.rooms.push(r);
      r.getDoors((x, y) => this.doors.push({ x, y }));
    });
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

  private roomTracker = {};
  private drawRoomName() {
    if (this.isDoor(this.player.currentPosition)) {
      this.roomTracker[
        this.keyFrom(this.player.previousPosition)
      ] = this.currentRoomName;
      this.currentRoomName = this.generator.getNextRoomName();
      return;
    }
    if (!this.inRoom(this.player.currentPosition)) {
      return;
    }

    const previousAssignedRoomName = this.roomTracker[
      this.keyFrom(this.player.currentPosition)
    ];
    if (previousAssignedRoomName) {
      this.currentRoomName = previousAssignedRoomName;
    }

    let name = this.currentRoomName;

    if (this.isDoor(this.player.previousPosition)) {
      name = "You've entered The " + name;
    }

    this.display.drawText(
      (this.gameSize.width - name.length) / 2,
      this.gameSize.height - 2,
      name
    );
  }

  private inRoom({ x, y }: Position) {
    return this.rooms.some(r => {
      return (
        r.getLeft() <= x &&
        x <= r.getRight() &&
        r.getTop() <= y &&
        y <= r.getBottom()
      );
    });
  }

  private isDoor({ x, y }: Position) {
    return this.doors.some(({ x: vx, y: vy }) => vx === x && vy === y);
  }

  private keyFrom(pos: Position) {
    return this.key(pos.x, pos.y);
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

  positionIsPassable(position: Position): boolean {
    return this.key(position.x, position.y) in this.map;
  }
}
