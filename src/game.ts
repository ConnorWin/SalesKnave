import { Display } from "rot-js/lib/index";

export class Game {
    private display: Display;
    private gameSize: { width: number, height: number };

    constructor() {
        this.gameSize = { width: 75, height: 25 };

        this.display = new Display({
            width: this.gameSize.width,
            height: this.gameSize.height,
            fontSize: 20
        });
        document.body.appendChild(this.display.getContainer());
    }
}