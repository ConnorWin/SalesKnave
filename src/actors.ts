export class Actors {
  private queue = [];

  add(actor) {
    this.queue.push(actor);
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

  async loop() {
    if (!this.queue.length) {
      return;
    } // endgame
    let actor = this.queue.shift();
    this.queue.push(actor);
    if (actor.act) {
      await actor.act();
    }

    return this.loop();
  }
}
