import { Display, Map } from "rot-js/lib/index";
import { Player } from "./player";
import { Position } from "./position";
import { CharacterDrawling } from "./characterDrawling";
import { TextGenerator } from "./text-generator";
import { Room } from "rot-js/lib/map/features";
import Log from "./log";

const FONT_BASE = 20;

export class Game {
  private display: Display;
  private map: { [key: string]: string | string[] } = {};
  private player: Player;
  private generator = new TextGenerator();
  private currentRoomName = this.generator.getNextRoomName();
  private doors: Position[] = [];
  private rooms: Room[] = [];
  private options = {
    width: 225,
    height: 75,
    spacing: 1.1,
    fontSize: FONT_BASE,
    fontFamily: "metrickal, monospace"
  };

  constructor(parent: Element, private log: Log) {
    this.display = new Display(this.options);
    parent.appendChild(this.display.getContainer());
    this._generateMap();
    this.player = new Player(
      this,
      this.keyToPosition(Object.keys(this.map)[0])
    );
    this.player.keyPressed.on("position changed", () => {
      this.updateMap();
    });
    this.updateMap();
    this.fit();

    parent.classList.remove("hidden");
  }

  private updateMap() {
    this.display.clear();
    this.drawRoomName();
    this.centerOn(this.player.currentPosition);
    this.drawCharacter(this.player.currentPosition, this.player.drawling);
  }

  private centerOn(newCenter: Position) {
    let center = newCenter.clone();

    let displayXY = new Position(undefined, undefined);
    for (displayXY.x = 0; displayXY.x < this.options.width; displayXY.x++) {
      for (displayXY.y = 0; displayXY.y < this.options.height; displayXY.y++) {
        this.update(center, this.displayToLevel(center, displayXY));
      }
    }
  }

  displayToLevel(center: Position, xy: Position) {
    // display XY to level XY; middle point = center
    let half = new Position(this.options.width, this.options.height)
      .scale(0.5)
      .floor();
    return xy.minus(half).plus(center);
  }

  update(center: Position, levelXY: Position) {
    let displayXY = this.levelToDisplay(center, levelXY);
    this.display.draw(
      displayXY.x,
      displayXY.y,
      this.map[this.keyFrom(displayXY)],
      undefined,
      undefined
    );
  }

  levelToDisplay(center: Position, xy: Position) {
    // level XY to display XY; center = middle point
    let half = new Position(this.options.width, this.options.height)
      .scale(0.5)
      .floor();
    return xy.minus(center).plus(half);
  }

  private fit() {
    let node = this.display.getContainer();
    let parent = node.parentNode as HTMLElement;
    let avail = new Position(parent.offsetWidth, parent.offsetHeight);

    let size = this.display.computeSize(avail.x, avail.y);
    size[0] += size[0] % 2 ? 2 : 1;
    size[1] += size[1] % 2 ? 2 : 1;
    this.options = {
      ...this.options,
      width: size[0],
      height: size[1]
    };
    this.display.setOptions(this.options);

    let current = new Position(node.offsetWidth, node.offsetHeight);
    let offset = avail.minus(current).scale(0.5);
    node.style.left = `${offset.x}px`;
    node.style.top = `${offset.y}px`;
  }

  private _generateMap() {
    const digger = new Map.Uniform(this.options.width, this.options.height, {});
    const freeCells = [];

    digger.create((x, y, value) => {
      if (value) {
        return;
      }

      const key = this.key(x, y);
      this.map[key] = ".";
      freeCells.push(key);
      this.drawWalls(x, y);
    });

    digger.getRooms().forEach(r => {
      this.rooms.push(r);
      r.getDoors((x, y) => this.doors.push(new Position(x, y)));
    });
  }

  private drawWalls(x: number, y: number) {
    for (let dx = x - 1; dx <= x + 1; dx++) {
      for (let dy = y - 1; dy <= y + 1; dy++) {
        if (!this.map[this.key(dx, dy)]) {
          this.display.draw(dx, dy, "#", undefined, undefined);
          this.map[this.key(dx, dy)] = "#";
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
      this.log.add(name);
    }

    // this.display.drawText(
    //   (this.gameSize.width - name.length) / 2,
    //   this.gameSize.height - 2,
    //   name
    // );
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
    const key = this.key(position.x, position.y);
    return key in this.map && this.map[key] != "#";
  }
}
