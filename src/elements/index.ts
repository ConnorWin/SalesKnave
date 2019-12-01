import { CharacterDrawling } from "../characterDrawling";
import { RNG } from "rot-js";
import { Position } from "../position";

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

export abstract class Enemy extends CharacterDrawling {
  public abstract readonly attacks: { phrase: string; damage: number }[];
  public abstract hp: number;
  constructor(
    public currentPosition: Position,
    symbol: string,
    fg?: string,
    bg?: string
  ) {
    super(symbol, fg, bg);
  }
  protected createAttack(phrase: string) {
    return {
      phrase,
      damage: +RNG.getWeightedValue({
        1: 1,
        2: 2,
        3: 3,
        4: 3,
        5: 4,
        6: 6,
        7: 8,
        9: 12
      })
    };
  }
}

export class Manager extends Enemy {
  constructor(pos: Position) {
    super(pos, "M", "purple");
  }
  public hp = RNG.getUniformInt(8, 15);
  public attacks = [
    this.createAttack(
      "Sales are down this quarter. You need to work this weekend"
    ),
    this.createAttack(
      `Don't forget about the meeting at ${RNG.getUniformInt(1, 4)}PM`
    ),
    this.createAttack(`Smile more... No one likes a {red}Frowny Frank{}`),
    this.createAttack(
      "How are the kids? Oh don't forget to complete your training"
    ),
    this.createAttack(
      "Shouldn't you be working instead of wandering around the office?"
    ),
    this.createAttack(
      "Get out there and sell those trampolines {orange}tiger{}!"
    ),
    this.createAttack(
      "You need to improve by {blue}Leaps and Bounds{} if you want to succeed"
    )
  ];
}

export class CoWorker extends Enemy {
  constructor(pos: Position) {
    super(pos, "C", "blue");
  }
  public hp = RNG.getUniformInt(5, 10);
  public attacks = [
    this.createAttack("What time is the sales meeting again?"),
    this.createAttack("Someone has a case of the Monday's"),
    this.createAttack("This company is the best! {goldenrod}#TrampolineLife{}"),
    this.createAttack(
      "I'm on a health kick right now! You could probably stand to go on a walk yourself..."
    ),
    this.createAttack(
      "This day old {blue}Tuna{} isn't going to microwave itself"
    ),
    this.createAttack(
      "We're all chipping in to buy a birthday cake. Want to make a donation?"
    ),
    this.createAttack("Too bad we have to leave at 5. This place is the best")
  ];
}

export class Engineer extends Enemy {
  constructor(pos: Position) {
    super(pos, "E", "gray");
  }
  public hp = RNG.getUniformInt(3, 8);
  public attacks = [
    this.createAttack(
      "We fixed the faulty springs. Now only 20% of people get hurt on our {blue}Trampolines{}!"
    ),
    this.createAttack("Want to hear my band's demo tape?"),
    this.createAttack("The new T12 Mesh is 10x stronger than the old stuff"),
    this.createAttack(
      "Your job is too easy! You just talk to people and then they buy the trampolines I made"
    ),
    this.createAttack(
      "Make sure the customers knows the frames are made of Adamantium ({goldenrod}tee-hee{})"
    ),
    this.createAttack(
      "I've been going to the beach too much. Now I am a {orange}tan{}gent"
    ),
    this.createAttack(
      "If your sales are down, don't worry, I'm sure you'll {bounce} back."
    )
  ];
}

export class Potion extends CharacterDrawling {
  public readonly restores = +RNG.getWeightedValue({
    1: 1,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 3,
    7: 3,
    8: 3
  });
  constructor() {
    super("🧪", "teal");
  }
}
