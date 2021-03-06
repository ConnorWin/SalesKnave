import { KEYS, DIRS, RNG } from "rot-js";
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
  public isInBossFight = false;

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
    this.interactKeyMap[KEYS.VK_1] = 0;
    this.interactKeyMap[KEYS.VK_2] = 1;
    this.interactKeyMap[KEYS.VK_3] = 2;
  }

  public act() {
    this.keyPressed.emit("refresh board");

    let promise: Promise<any> = new Promise(resolve => {
      this.resolve = resolve;
    });

    const listener = this.keyListener;
    window.addEventListener("keyup", listener);
    promise = promise.then(() => {
      if (!this.isInBossFight) {
        window.removeEventListener("keyup", listener);
      }
    });

    return promise;
  }

  public dealDamage(damage: number) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
    } else if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
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
          const restores = Math.min(this.maxHp - this.hp, potion.restores);
          this.dealDamage(-restores);
          this.game.log.pause();
          this.game.log.add(
            `You drank a {teal}potion{} that restored your boredom by {gold}${restores}{} points.`
          );
          this.game.log.pause();
        }
      } else if (this.game.enemyIsInPosition(newPosition)) {
        const phrase = RNG.getItem(attackPhrases);
        const damage = +RNG.getWeightedValue({
          5: 1,
          4: 2,
          3: 3,
          2: 5,
          1: 5
        });
        const died = this.game.attackEnemyAt(newPosition, damage);
        this.game.log.add(`{gold}You{}: "${phrase}"`);

        if (died) {
          const inc = RNG.getUniformInt(1, 3);
          this.maxHp += inc;
          this.hp += inc;
          this.status.setMaxHealth(this.maxHp);
          this.status.setHealth(this.hp);
          this.game.log.add(
            `Good job you made them go away. You are now {gold}${Math.floor(
              (inc / (this.maxHp - inc * 1.0)) * 100
            )}%{} more resilient to B.S.`
          );
          this.game.log.add("Now back to work!");
          this.game.log.pause();
        }
      }
      this.resolve();
    } else if (code in this.interactKeyMap) {
      this.keyPressed.emit("fight action", this.interactKeyMap[code]);
      this.resolve();
    }
  };
}

const attackPhrases = [
  "Go away I am busy!",
  "I'm expecting a call from a client",
  "I'm on my lunch break",
  "I am late for a meeting",
  "I heard there are cookies in the break room",
  "Quick look there's a bear",
  "Oh I think I am getting a phone call, please excuse me",
  "I have to go to the bathroom",
  "Do you hear a car alarm?",
  "{red}Fire{}! {red}Fire{}! there's a {red}Fire{} in the office"
];
