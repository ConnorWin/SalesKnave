import { CharacterDrawling } from "./characterDrawling";
import { Position } from "./position";
export class Character {
  constructor(
    public characterDrawling: CharacterDrawling,
    public currentPosition: Position
  ) {}
}
