import { Display, Color } from "rot-js";

const FONT_BASE = 17;
export default class Status {
  private healthBar: Display;
  private maxHealth: number = 25;
  private readonly options = {
    width: 50,
    height: 20,
    spacing: 0.85,
    fontSize: FONT_BASE
  };

  constructor(parent: Element) {
    parent.classList.remove("hidden");
    this.healthBar = new Display(this.options);
    parent.appendChild(this.healthBar.getContainer());
  }

  setMaxHealth(health: number) {
    this.maxHealth = health;
  }

  setHealth(health: number) {
    this.healthBar.clear();
    const color = this.getHealthColorFromPercent(health / this.maxHealth);
    this.healthBar.drawText(1, 0, `Boredom:`);
    const maxSize = 25;
    const filled = Math.floor((health / this.maxHealth) * maxSize);
    const remaining = new Array(filled).fill("█");
    const unfilled = new Array(maxSize - filled).fill("_");
    if (health < this.maxHealth) {
      this.healthBar.draw(maxSize, 2, "⎸", undefined, undefined);
    }
    unfilled.forEach((c, i) =>
      this.healthBar.draw(i + remaining.length, 2, c, undefined, undefined)
    );
    remaining.forEach((c, i) =>
      this.healthBar.draw(i + 1, 2, c, color, undefined)
    );

    this.healthBar.drawText(
      maxSize + 2,
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
