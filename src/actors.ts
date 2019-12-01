import * as ai from "./ai";
import { Level } from "./level";
import { Player } from "./player";
import { Enemy } from "./elements";
import Log from "./log";

export class Actors {
  private queue: (Enemy | Player)[] = [];
  private _pc: Player;

  public get actors() {
    return this.queue.slice();
  }

  public get pc() {
    return this._pc;
  }

  add(actor) {
    this.queue.push(actor);
    if (actor instanceof Player) {
      this._pc = actor;
    }
  }

  clear() {
    this.queue = [];
  }

  remove(actor) {
    let index = this.queue.indexOf(actor);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
  }

  async loop(level: Level, log: Log) {
    if (!this.queue.length) {
      return;
    } // endgame
    let actor = this.queue.shift();
    this.queue.push(actor);
    if (actor instanceof Player) {
      await actor.act();
    } else {
      ai.act(level, actor, log);
    }

    return this.loop(level, log);
  }
}
