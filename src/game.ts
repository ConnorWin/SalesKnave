import { Display } from "rot-js/lib/index";
import { Player } from "./player";
import { Position } from "./position";
import { TextGenerator } from "./text-generator";
import Log from "./log";
import { Wall, Boss, Potion, Floor, Enemy } from "./elements";
import { Level } from "./level";
import { BossFight } from "./boss-fight";

const FONT_BASE = 25;

export class Game {
  private display: Display;
  private generator = new TextGenerator();
  private currentRoomName = this.generator.getNextRoomName();
  private currentBossFight: BossFight = null;
  private options = {
    width: 300,
    height: 300,
    spacing: 1.1,
    fontSize: FONT_BASE
  };
  private player: Player;

  constructor(private parent: Element, private level: Level, public log: Log) {
    this.display = new Display(this.options);
    parent.appendChild(this.display.getContainer());

    this.level.map[this.keyFrom(level.end)] = new Boss();
  }

  public start(player: Player) {
    this.player = player;
    this.initializePlayerListeners();
    this.updateMap();
    this.fit();

    this.parent.classList.remove("hidden");
  }

  private updateMap(drawRoom = true) {
    this.display.clear();
    if (drawRoom) this.drawRoomName();
    this.level.actors.actors.forEach(a => {
      this.level.moveTo(a.currentPosition, a);
    });
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
    return (
      key in this.level.map &&
      !(this.level.map[key] instanceof Wall) &&
      !(this.level.getEntity(position) instanceof Enemy)
    );
  }

  public bossIsInPosition(position: Position): boolean {
    return position.x === this.level.end.x && position.y === this.level.end.y;
  }

  public enemyIsInPosition(position: Position): boolean {
    const e = this.level.getEntity(position);
    return e instanceof Enemy;
  }

  public attackEnemyAt(position: Position, damage: number) {
    const e = this.level.getEntity(position);
    if (e instanceof Enemy) {
      e.engageWith(this.log);
      e.hp -= damage;

      if (e.hp <= 0) {
        this.level.actors.remove(e);
        this.update(position);
        return true;
      }
    }

    return false;
  }

  public containsHealthPotion(position: Position): boolean {
    const e = this.level.map[this.keyFrom(position)];
    return e instanceof Potion;
  }

  public getPotionAt(position: Position): Potion {
    const e = this.level.map[this.keyFrom(position)];
    if (e instanceof Potion) {
      this.level.map[this.keyFrom(position)] = new Floor();
      return e;
    }
  }

  private initializePlayerListeners() {
    if (this.player != null) {
      this.player.keyPressed.on("position changed", () => {
        if (this.currentBossFight == null) {
          this.updateMap();
        }
      });
      this.player.keyPressed.on("refresh board", () => {
        this.updateMap(false);
      });
      this.player.keyPressed.on("boss fight", () => {
        this.currentBossFight = new BossFight(1);
        this.display.clear();
        this.currentBossFight.drawDisplay(
          this.display,
          this.options.width,
          this.options.height
        );
      });
      this.player.keyPressed.on("fight action", () => {
        if (this.currentBossFight != null) {
        }
      });
    }
  }
}
