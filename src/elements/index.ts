import { CharacterDrawling } from "../characterDrawling";

export class Wall extends CharacterDrawling {
  constructor() {
    super("#", "darkred");
  }
}

export class Floor extends CharacterDrawling {
  constructor() {
    super(".", "#aaa");
  }
}

export class Door extends CharacterDrawling {
  constructor() {
    super("+", "chocolate");
  }
}

export class Boss extends CharacterDrawling {
  constructor() {
    super("B", "orange");
  }
}
