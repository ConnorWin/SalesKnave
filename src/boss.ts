import { CharacterDrawling } from "./characterDrawling";
import { Position } from "./postition";
import { Character } from "./character";

export class Boss extends Character {
  constructor(position: Position) {
    super(new CharacterDrawling("&", "#f00", "#0000"), position);
  }
}
