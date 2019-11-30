import { CharacterDrawling } from "../characterDrawling";
import { Room } from "rot-js/lib/map/features";
import { Map } from "rot-js";
import { Position } from "../position";
import { Floor, Wall, Door } from "../elements";

type LevelMap = { [key: string]: CharacterDrawling };
export class Level {
  public map: LevelMap = {};
  public doors: Position[] = [];
  public rooms: Room[] = [];
  public start: Position;
  public end: Position;
  constructor(public levelNum: number) {
    // Todo: Change dimensions based on level
    const map = this.generateMap(50, 50);
    this.map = map.map;
    this.doors = map.doors;
    this.rooms = map.rooms;
    this.start = this.toPosition(this.rooms[0]);
    this.end = this.toPosition(this.rooms.slice().reverse()[0]);
  }

  private generateMap(width, height) {
    const digger = new Map.Uniform(width, height, {});
    let map: LevelMap = {};
    const doors: Position[] = [];
    const rooms: Room[] = [];

    digger.create((x, y, value) => {
      if (value) {
        return;
      }

      const key = this.key(x, y);
      map[key] = new Floor();
      map = this.drawWalls(map, x, y);
    });

    digger.getRooms().forEach(room => {
      rooms.push(room);
      room.getDoors((x, y) => {
        map[this.key(x, y)] = new Door();
        doors.push(new Position(x, y));
      });
    });

    return { doors, rooms, map };
  }

  private drawWalls(map: LevelMap, x: number, y: number) {
    for (let dx = x - 1; dx <= x + 1; dx++) {
      for (let dy = y - 1; dy <= y + 1; dy++) {
        if (!map[this.key(dx, dy)]) {
          map[this.key(dx, dy)] = new Wall();
        }
      }
    }

    return map;
  }

  private key(x: number, y: number) {
    return `${x},${y}`;
  }

  private toPosition(r: Room) {
    const [x, y] = r.getCenter();
    return new Position(x, y);
  }

  public inRoom({ x, y }: Position) {
    return this.rooms.some(r => {
      return (
        r.getLeft() <= x &&
        x <= r.getRight() &&
        r.getTop() <= y &&
        y <= r.getBottom()
      );
    });
  }

  public isDoor({ x, y }: Position) {
    const c = this.map[this.key(x, y)];
    return c instanceof Door;
  }

  private tempPositions = [];
  public moveTo({ x, y }: Position, who: CharacterDrawling) {
    const cell = this.key(x, y);

    this.tempPositions.push({
      pos: cell,
      element: this.map[cell]
    });

    this.map[cell] = who;
  }

  public restore() {
    this.tempPositions.forEach(({ pos, element }) => {
      this.map[pos] = element;
    });
    this.tempPositions = [];
  }
}
