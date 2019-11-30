import { KEYS, DIRS } from "rot-js";
import { CharacterDrawling } from "./characterDrawling";
import { Position } from "./position";
import { Game } from "./game";
import { EventEmitter } from "events";

export class Player extends CharacterDrawling {
  private keyMap: { [key: number]: number };

  public currentPosition: Position;
  public previousPosition: Position;
  public keyPressed: EventEmitter = new EventEmitter();

  constructor(public game: Game, position: Position) {
    super("@", "#ff0", "#0000");
    this.currentPosition = position;
    this.previousPosition = position;
    this.initializeKeyMap();
    this.addInputListener();
  }

  private initializeKeyMap() {
    this.keyMap = {};
    this.keyMap[KEYS.VK_W] = 0;
    this.keyMap[KEYS.VK_D] = 1;
    this.keyMap[KEYS.VK_S] = 2;
    this.keyMap[KEYS.VK_A] = 3;
    this.keyMap[KEYS.VK_UP] = 0;
    this.keyMap[KEYS.VK_RIGHT] = 1;
    this.keyMap[KEYS.VK_DOWN] = 2;
    this.keyMap[KEYS.VK_LEFT] = 3;
  }

  private addInputListener() {
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      var code = e.keyCode;

      if (code in this.keyMap) {
        let direction = DIRS[4][this.keyMap[code]];
        let newPosition = new Position(
          this.currentPosition.x + direction[0],
          this.currentPosition.y + direction[1]
        );
        if (this.game.positionIsPassable(newPosition)) {
          this.previousPosition = this.currentPosition.clone();
          this.currentPosition = newPosition;
        }
        this.keyPressed.emit("position changed");
      }
    });
  }
}
