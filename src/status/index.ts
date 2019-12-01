import { Display, Color } from "rot-js";

const FONT_BASE = 18;
export default class Status {
  private display: Display;
  private healthBar: Display;
  private options = {
    width: 50,
    height: 20,
    spacing: 1.1,
    fontSize: FONT_BASE
  };

  constructor(parent: Element, private maxHealth: number = 25) {
    parent.classList.remove("hidden");
    this.display = new Display(this.options);
    this.healthBar = new Display({ ...this.options, spacing: 0.85 });
    parent.appendChild(this.healthBar.getContainer());
    parent.appendChild(this.display.getContainer());
  }

  setHealth(health: number) {
    this.display.clear();
    const color = this.getHealthColorFromPercent(health / this.maxHealth);
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
