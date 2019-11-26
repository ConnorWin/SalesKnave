import { KEYS } from "rot-js";
import { CharacterDrawling } from "./characterDrawling";

export class Player {
  private keyMap: { [key: number]: number };

  public drawling: CharacterDrawling;
  public xPosition: number;
  public yPosition: number;

  constructor() {
    this.drawling = new CharacterDrawling("@", "#ff0");
    this.initializeKeyMap();
    this.addInputListener();
  }

  private initializeKeyMap() {
    this.keyMap = {};
    this.keyMap[KEYS.VK_W] = 87;
    this.keyMap[KEYS.VK_D] = 68;
    this.keyMap[KEYS.VK_S] = 83;
    this.keyMap[KEYS.VK_A] = 65;
    this.keyMap[KEYS.VK_UP] = 38;
    this.keyMap[KEYS.VK_RIGHT] = 39;
    this.keyMap[KEYS.VK_DOWN] = 40;
    this.keyMap[KEYS.VK_LEFT] = 41;
  }

  private addInputListener() {
    window.addEventListener("keyup", e => {
      var code = e.keyCode;

      if (code in this.keyMap) {
        console.log("Key code is " + code);
      }
    });
  }
}
