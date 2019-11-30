import { Display, Map } from "rot-js/lib/index";

export class BossFight {
  constructor() {}

  public drawDisplay(display: Display, width: number, height: number) {
    let actionbar = "";
    for (let i = 0; i < width; i++) {
      actionbar += "=";
    }
    console.log(actionbar);
    display.drawText((width - actionbar.length) / 2, height - 2, actionbar);
  }
}
