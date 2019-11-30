import { roomNames, roomTypes } from "./data";
import { StringGenerator, RNG } from "rot-js";

export class TextGenerator {
  private roomGenerator = new StringGenerator({ words: true });

  constructor() {
    roomNames.forEach(name => this.roomGenerator.observe(name));
  }

  public getNextRoomName() {
    return (
      this.roomGenerator
        .generate()
        .split(" ")
        .slice(0, 5)
        .join(" ") + ` ${RNG.shuffle(roomTypes)[0]}`
    ).trim();
  }
}
