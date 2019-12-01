import { Display } from "rot-js/lib";
import { LogicalPitches, FeelingPitches, AggressionPitches } from "./data";

enum AttackTypes {
  logic,
  feeling,
  agression
}
export class BossFight {
  public boss: Boss;
  public playerHealth: number;
  private attackOptions: any[];
  private logicalAttackList = LogicalPitches;
  private emotionalAttackList = FeelingPitches;
  private agressiveAttackList = AggressionPitches;

  constructor(fightNumber, currentPlayerHealth: number) {
    this.playerHealth = currentPlayerHealth;
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
    this.setFightActions();
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
    for (let i = 0; i < this.playerHealth; i++) {
      playerHealthBar += "#";
    }

    display.drawText((width * 5) / 32, (height * 15) / 128, bossHealthBar);
    display.drawText((width * 1) / 8, height / 8, "|__________");
    display.drawText((width * 7) / 8, height / 8, "B");
    display.drawText((width * 1) / 8, (height * 4) / 8, "@");
    display.drawText((width * 21) / 32, (height * 63) / 128, playerHealthBar);
    display.drawText((width * 5) / 8, (height * 4) / 8, "|__________");
    display.drawText(0, (height * 5) / 8, actionBar);
    display.drawText(
      (width * 1) / 16,
      (height * 11) / 16,
      this.attackOptions[0].text
    );
    display.drawText(
      (width * 1) / 16,
      (height * 12) / 16,
      this.attackOptions[1].text
    );
    display.drawText(
      (width * 1) / 16,
      (height * 13) / 16,
      this.attackOptions[2].text
    );
  }

  public processFightAction(actionNumber: number) {
    const action = this.attackOptions[actionNumber];
    if (action.type === this.boss.resistance) {
      this.boss.currentHealth -= 1;
    } else if (action.type === this.boss.vulnerability) {
      this.boss.currentHealth -= 4;
    } else {
      this.boss.currentHealth -= 2;
    }
    this.playerHealth -= 2;
  }

  public setFightActions() {
    this.attackOptions = [];
    this.attackOptions[0] = {
      text:
        "1: " +
        this.logicalAttackList[
          Math.floor(Math.random() * this.logicalAttackList.length)
        ],
      type: AttackTypes.logic
    };
    this.attackOptions[1] = {
      text:
        "2: " +
        this.emotionalAttackList[
          Math.floor(Math.random() * this.emotionalAttackList.length)
        ],
      type: AttackTypes.feeling
    };
    this.attackOptions[2] = {
      text:
        "3: " +
        this.agressiveAttackList[
          Math.floor(Math.random() * this.agressiveAttackList.length)
        ],
      type: AttackTypes.agression
    };
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
