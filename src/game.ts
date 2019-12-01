import { Display } from "rot-js/lib/index";
import { Player } from "./player";
import { Position } from "./position";
import { TextGenerator } from "./text-generator";
import Log from "./log";
import { Wall, Boss } from "./elements";
import { Level } from "./level";

const FONT_BASE = 25;

export class Game {
  private display: Display;
  private player: Player;
  private generator = new TextGenerator();
  private currentRoomName = this.generator.getNextRoomName();
  private options = {
    width: 300,
    height: 300,
    spacing: 1.1,
    fontSize: FONT_BASE
  };

  constructor(parent: Element, private log: Log, private level: Level) {
    this.display = new Display(this.options);
    parent.appendChild(this.display.getContainer());

    if (Object.keys(this.level.map).length === 0) {
      this.level = new Level(this.level.levelNum);
    }

    this.player = new Player(this, level.start);
    this.level.map[this.keyFrom(level.end)] = new Boss();
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
    this.level.moveTo(this.player.currentPosition, this.player);
    this.fit();
    this.centerOn(this.player.currentPosition);
    this.level.restore();
  }

  private update(levelXY: Position) {
    let visual = this.level.map[this.keyFrom(levelXY)];
    if (!visual) {
      return;
    }
    let displayXY = this.levelToDisplay(levelXY);
    this.display.draw(
      displayXY.x,
      displayXY.y,
      visual.symbol,
      visual.fg,
      visual.bg
    );
  }

  private center: Position;
  private centerOn(newCenter: Position) {
    this.center = newCenter.clone();

    let displayXY = new Position(0, 0);
    for (displayXY.x = 0; displayXY.x < this.options.width; displayXY.x++) {
      for (displayXY.y = 0; displayXY.y < this.options.height; displayXY.y++) {
        this.update(this.displayToLevel(displayXY));
      }
    }
  }

  private levelToDisplay(xy: Position) {
    // level XY to display XY; center = middle point
    let half = new Position(this.options.width, this.options.height)
      .scale(0.5)
      .floor();
    return xy.minus(this.center).plus(half);
  }

  private displayToLevel(xy: Position) {
    // display XY to level XY; middle point = center
    let half = new Position(this.options.width, this.options.height)
      .scale(0.5)
      .floor();
    return xy.minus(half).plus(this.center);
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

  private roomTracker = {};
  private drawRoomName() {
    if (this.level.isDoor(this.player.currentPosition)) {
      this.roomTracker[
        this.keyFrom(this.player.previousPosition)
      ] = this.currentRoomName;
      this.currentRoomName = this.generator.getNextRoomName();
      return;
    }
    if (!this.level.inRoom(this.player.currentPosition)) {
      return;
    }

    const previousAssignedRoomName = this.roomTracker[
      this.keyFrom(this.player.currentPosition)
    ];
    if (previousAssignedRoomName) {
      this.currentRoomName = previousAssignedRoomName;
    }

    let name = this.currentRoomName;

    if (this.level.isDoor(this.player.previousPosition)) {
      name = "You've entered The " + name;
      this.log.add(name);
    }
  }

  private keyFrom(pos: Position) {
    return this.key(pos.x, pos.y);
  }

  private key(x: number, y: number) {
    return `${x},${y}`;
  }

  public positionIsPassable(position: Position): boolean {
    const key = this.key(position.x, position.y);
    return key in this.level.map && !(this.level.map[key] instanceof Wall);
  }
}
