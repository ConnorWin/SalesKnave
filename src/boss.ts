import { CharacterDrawling } from "./characterDrawling";
import { Position } from "./position";
import { Character } from "./character";

export class Boss extends Character {
  public battleMap: { [key: string]: string | string[] } = {};

  constructor(position: Position) {
    super(new CharacterDrawling("&", "#f00", "#0000"), position);
  }
}
