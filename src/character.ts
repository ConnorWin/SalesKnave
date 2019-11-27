import { CharacterDrawling } from "./characterDrawling";
import { Position } from "./postition";
export class Character {
  constructor(
    public characterDrawling: CharacterDrawling,
    public currentPosition: Position
  ) {}
}
