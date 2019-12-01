import { KEYS, DIRS } from "rot-js";
import { CharacterDrawling } from "./characterDrawling";
import { Position } from "./position";
import { Game } from "./game";
import { EventEmitter } from "events";
import Status from "./status";

export class Player extends CharacterDrawling {
  private moveKeyMap: { [key: number]: number };
  private interactKeyMap: { [key: number]: number };

  public currentPosition: Position;
  public previousPosition: Position;
  public keyPressed: EventEmitter = new EventEmitter();
  private resolve: (value?: unknown) => void;
  public hp: number;

  constructor(
    public game: Game,
    position: Position,
    private status: Status,
    public maxHp = 25
  ) {
    super("@", "#ff0", "#0000");
    this.hp = this.maxHp;
    this.currentPosition = position;
    this.previousPosition = position;
    this.initializeKeyMaps();
  }

  private initializeKeyMaps() {
    this.moveKeyMap = {};
    this.moveKeyMap[KEYS.VK_W] = 0;
    this.moveKeyMap[KEYS.VK_D] = 1;
    this.moveKeyMap[KEYS.VK_S] = 2;
    this.moveKeyMap[KEYS.VK_A] = 3;
    this.moveKeyMap[KEYS.VK_UP] = 0;
    this.moveKeyMap[KEYS.VK_RIGHT] = 1;
    this.moveKeyMap[KEYS.VK_DOWN] = 2;
    this.moveKeyMap[KEYS.VK_LEFT] = 3;

    this.interactKeyMap = {};
    this.moveKeyMap[KEYS.VK_1] = 0;
    this.moveKeyMap[KEYS.VK_2] = 1;
    this.moveKeyMap[KEYS.VK_3] = 2;
    this.moveKeyMap[KEYS.VK_4] = 3;
  }

  public act() {
    const resolverFunc = resolve => {
      this.resolve = resolve;
    };
    let promise = new Promise(resolverFunc);
    const listener = this.keyListener;
    window.addEventListener("keyup", listener);
    promise = promise.then(() => window.removeEventListener("keyup", listener));

    return promise;
  }

  public dealDamage(damage: number) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
    }

    this.status.setHealth(this.hp);
  }

  private keyListener = (e: KeyboardEvent) => {
    var code = e.keyCode;

    var code = e.keyCode;

    if (code in this.moveKeyMap) {
      let direction = DIRS[4][this.moveKeyMap[code]];
      let newPosition = new Position(
        this.currentPosition.x + direction[0],
        this.currentPosition.y + direction[1]
      );
      if (this.game.positionIsPassable(newPosition)) {
        const hasHealthPotion = this.game.containsHealthPotion(newPosition);
        if (this.game.bossIsInPosition(newPosition)) {
          this.keyPressed.emit("boss fight");
        } else {
          this.previousPosition = this.currentPosition.clone();
          this.currentPosition = newPosition;
          this.keyPressed.emit("position changed");
        }

        if (hasHealthPotion) {
          const potion = this.game.getPotionAt(this.currentPosition);
          this.dealDamage(-potion.restores);
        }
      }
      this.resolve();
    } else if (code in this.interactKeyMap) {
      this.keyPressed.emit("fight action");
      this.resolve();
    }
  };
}
