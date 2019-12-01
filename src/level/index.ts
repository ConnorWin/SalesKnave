import { CharacterDrawling } from "../characterDrawling";
import { Room } from "rot-js/lib/map/features";
import { Map, RNG, Path } from "rot-js";
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
    const averageSize = levelNum * 50 + 100;
    const width = RNG.getUniformInt(averageSize - 25, levelNum + 25);
    const height = RNG.getUniformInt(averageSize - 25, levelNum + 25);
    const map = this.generateMap(width, height);
    this.map = map.map;
    this.doors = map.doors;
    this.rooms = map.rooms;
    let firstRoom = this.rooms[0];
    this.start = this.toPosition(firstRoom);
    this.end = this.toPosition(
      this.rooms.reduce(
        (furthest, room) => {
          const dist = this.distance(firstRoom, room);

          if (dist > furthest.dist) return { room, dist };
          return furthest;
        },
        { room: undefined as Room, dist: 0 }
      ).room
    );
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

  private distance(r1: Room, r2: Room) {
    const [x1, y1] = r1.getCenter();
    const [x2, y2] = r2.getCenter();
    const a = new Path.AStar(x2, y2, (x, y) => {
      const cell = this.map[this.key(x, y)];
      return !!cell && !(cell instanceof Wall);
    });

    let dist = 0;
    a.compute(x1, y1, () => dist++);

    return dist;
  }
}
