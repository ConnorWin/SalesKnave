import { Display } from "rot-js/lib/index";
import { Position } from "../position";
import { CharacterDrawling } from "../characterDrawling";

const FONT_BASE = 25;

export class EndGame {
  private display: Display;
  private center: Position;
  private map = {};
  private options = {
    width: 300,
    height: 300,
    spacing: 1.1,
    fontSize: FONT_BASE
  };

  constructor(parent: Element) {
    this.display = new Display(this.options);
    parent.firstChild && parent.removeChild(parent.firstChild);
    parent.appendChild(this.display.getContainer());
    parent.classList.remove("hidden");

    this.fit();
    setInterval(() => {
      this.display.clear();
      this.map = {};
      this.displayEnding();
      this.centerOn(new Position(10, 4));
    }, 200);
  }

  private shift = 0;
  private sign = 1;
  displayEnding() {
    this.shift += 1 * this.sign;

    const shiftXY = new Position(0, this.shift);
    this.map[
      this.keyFrom(new Position(1, 0).plus(shiftXY))
    ] = new CharacterDrawling("@", "teal");
    this.map[
      this.keyFrom(new Position(1, 1).plus(shiftXY))
    ] = new CharacterDrawling("|", "teal");
    this.map[
      this.keyFrom(new Position(0, 1).plus(shiftXY))
    ] = new CharacterDrawling("\\", "teal");
    this.map[
      this.keyFrom(new Position(2, 1).plus(shiftXY))
    ] = new CharacterDrawling("/", "teal");
    this.map[
      this.keyFrom(new Position(1, 2).plus(shiftXY))
    ] = new CharacterDrawling("|", "teal");
    this.map[
      this.keyFrom(new Position(0, 3).plus(shiftXY))
    ] = new CharacterDrawling(this.sign < 0 ? "^" : "/", "teal");
    this.map[
      this.keyFrom(new Position(2, 3).plus(shiftXY))
    ] = new CharacterDrawling(this.sign < 0 ? "^" : "\\", "teal");

    //trampoline
    this.map[this.key(-2, 8)] = new CharacterDrawling("|", "teal");
    this.map[this.key(4, 8)] = new CharacterDrawling("|", "teal");
    this.map[this.key(-1, 7)] = new CharacterDrawling("—", "teal");
    this.map[this.key(-2, 7)] = new CharacterDrawling("—", "teal");
    this.map[this.key(0, 7)] = new CharacterDrawling("—", "teal");
    this.map[this.key(1, 7)] = new CharacterDrawling("—", "teal");
    this.map[this.key(2, 7)] = new CharacterDrawling("—", "teal");
    this.map[this.key(3, 7)] = new CharacterDrawling("—", "teal");
    this.map[this.key(4, 7)] = new CharacterDrawling("—", "teal");

    if (this.shift >= 3 || this.shift <= -2) {
      this.sign *= -1;
    }

    const message = "You won! You're the CEO now!";
    this.display.drawText(10, 1, message);
  }

  private levelToDisplay(xy: Position) {
    // level XY to display XY; center = middle point
    let half = new Position(this.options.width, this.options.height)
      .scale(0.5)
      .floor();
    return xy.minus(this.center).plus(half);
  }

  private displayToLevel(xy: Position) {
    // display XY to level XY; middle point = center
    let half = new Position(this.options.width, this.options.height)
      .scale(0.5)
      .floor();
    return xy.minus(half).plus(this.center);
  }

  private fit() {
    let node = this.display.getContainer();
    let parent = node.parentNode as HTMLElement;
    let avail = new Position(parent.offsetWidth, parent.offsetHeight);

    let size = this.display.computeSize(avail.x, avail.y);
    size[0] += size[0] % 2 ? 2 : 1;
    size[1] += size[1] % 2 ? 2 : 1;
    this.options = {
      ...this.options,
      width: size[0],
      height: size[1]
    };
    this.display.setOptions(this.options);

    let current = new Position(node.offsetWidth, node.offsetHeight);
    let offset = avail.minus(current).scale(0.5);
    node.style.left = `${offset.x}px`;
    node.style.top = `${offset.y}px`;
  }

  private update(levelXY: Position) {
    let visual = this.map[this.keyFrom(levelXY)];
    if (!visual) {
      return;
    }
    let displayXY = this.levelToDisplay(levelXY);
    this.display.draw(
      displayXY.x,
      displayXY.y,
      visual.symbol,
      visual.fg,
      visual.bg
    );
  }

  private centerOn(newCenter: Position) {
    this.center = newCenter.clone();

    let displayXY = new Position(0, 0);
    for (displayXY.x = 0; displayXY.x < this.options.width; displayXY.x++) {
      for (displayXY.y = 0; displayXY.y < this.options.height; displayXY.y++) {
        this.update(this.displayToLevel(displayXY));
      }
    }
  }

  private keyFrom(pos: Position) {
    return this.key(pos.x, pos.y);
  }

  private key(x: number, y: number) {
    return `${x},${y}`;
  }
}
