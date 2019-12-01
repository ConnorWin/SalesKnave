import { Display, Color } from "rot-js";

const FONT_BASE = 17;
export default class Status {
  private healthBar: Display;
  private readonly options = {
    width: 50,
    height: 20,
    spacing: 0.85,
    fontSize: FONT_BASE
  };

  constructor(parent: Element, private maxHealth: number = 25) {
    parent.classList.remove("hidden");
    this.healthBar = new Display(this.options);
    parent.appendChild(this.healthBar.getContainer());
  }

  setHealth(health: number) {
    this.healthBar.clear();
    const color = this.getHealthColorFromPercent(health / this.maxHealth);
    this.healthBar.drawText(1, 0, `Boredom:`);
    const missingGap = health < this.maxHealth ? 1 : 0;
    for (let char = this.maxHealth + missingGap; char > 0; char--) {
      this.healthBar.draw(
        char,
        2,
        char <= health ? "█" : char > this.maxHealth ? "⎸" : "_",
        char <= health ? color : undefined,
        undefined
      );
    }

    this.healthBar.drawText(
      this.maxHealth + 2,
      2,
      ` %c{${color}}${health}%c{} / ${this.maxHealth}`
    );
  }

  private getHealthColorFromPercent(per: number) {
    if (per < 0.25) {
      return "darkred";
    } else if (per < 0.45) {
      return "goldenrod";
    }

    return "green";
  }
}
