import { CharacterDrawling } from "../characterDrawling";

export class Wall extends CharacterDrawling {
  constructor() {
    super("#", "darkred");
  }
}

export class Floor extends CharacterDrawling {
  constructor() {
    super(".", "#999");
  }
}
