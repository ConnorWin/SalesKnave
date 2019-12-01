import { Game } from "./game";
import Log from "./log";
import Status from "./status";
import { Level } from "./level";
import { Actors } from "./actors";
import { Player } from "./player";

async function init() {
  const actors = new Actors();
  const level = new Level(1, actors);
  const log = new Log(document.querySelector("#log"));
  const status = new Status(document.querySelector("#status"));
  const game = new Game(document.querySelector("#map"), level, log);
  const player = new Player(game, level.start);
  actors.add(player);
  // status.update();

  log.add("Welcome to the {aqua}Leaps and Bounds Trampoline Company{}!");
  log.add(
    "You must traverse the day to day tedium of everyday life to become the {gold}CEO{}."
  );
  log.pause();
  log.add("Make sales and fend off your annoying coworkers or die of boredom.");
  log.add("To move around, use the {#fff}arrow keys{}.");
  log.pause();

  game.start(player);
  await actors.loop();
}

document.body.onload = () => {
  // intro.start(document.querySelector("#intro")).then(init);
  init();
};
