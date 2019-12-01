import { Display } from "rot-js/lib";

enum AttackTypes {
  logic,
  feeling,
  agression
}
export class BossFight {
  private boss: Boss;
  private currentPlayerHealth = 10;

  constructor(fightNumber) {
    switch (fightNumber) {
      case 1: {
        this.boss = new Boss(10, AttackTypes.logic, AttackTypes.feeling);
        break;
      }
      case 2: {
        this.boss = new Boss(15, AttackTypes.feeling, AttackTypes.agression);
        break;
      }
      case 3: {
        this.boss = new Boss(20, AttackTypes.agression, AttackTypes.logic);
        break;
      }
    }
  }

  public drawDisplay(display: Display, width: number, height: number) {
    let actionBar = "";
    for (let i = 0; i < width; i++) {
      actionBar += "=";
    }

    let bossHealthBar = "";
    for (let i = 0; i < this.boss.currentHealth; i++) {
      bossHealthBar += "#";
    }

    let playerHealthBar = "";
    for (let i = 0; i < this.currentPlayerHealth; i++) {
      playerHealthBar += "#";
    }

    display.drawText((width * 5) / 32, (height * 15) / 128, bossHealthBar);
    display.drawText((width * 1) / 8, height / 8, "|__________");
    display.drawText((width * 7) / 8, height / 8, "B");
    display.drawText((width * 1) / 8, (height * 4) / 8, "@");
    display.drawText((width * 21) / 32, (height * 63) / 128, playerHealthBar);
    display.drawText((width * 5) / 8, (height * 4) / 8, "|__________");
    display.drawText(0, (height * 5) / 8, actionBar);
  }
}

class Boss {
  public currentHealth: number = 0;
  constructor(
    public maxHealth: number,
    public vulnerability: AttackTypes,
    public resistance: AttackTypes
  ) {
    this.currentHealth = maxHealth;
  }
}
