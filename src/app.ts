import { Game } from "./game";
import Log from "./log";
import Status from "./status";
import { Level } from "./level";
import { Actors } from "./actors";
import { Player } from "./player";
import { Position } from "./position";

function endGame(log: Log) {
  log.pause();
  log.add(
    "You are now the {gold}CEO{} of the {aqua}Leaps and Bounds Trampoline Company{}."
  );
  log.add("Congratulations!");
  log.add("Now back to work...");
}

async function init() {
  let levelNum = 1;
  const actors = new Actors();
  const log = new Log(document.querySelector("#log"));
  const status = new Status(document.querySelector("#status"));
  let player = new Player(undefined, new Position(0, 0), status, 30);

  const advanceLevel = async () => {
    if (levelNum > 3) {
      return endGame(log);
    }

    const level = new Level(levelNum, actors);
    const game = new Game(
      document.querySelector("#map"),
      level,
      log,
      advanceLevel
    );
    player = new Player(game, level.start, status, player.maxHp);
    actors.add(player);
    status.setMaxHealth(player.maxHp);
    status.setHealth(player.hp);

    game.start(player);
    await actors.loop(level, log);

    levelNum++;
  };

  log.add("Welcome to the {aqua}Leaps and Bounds Trampoline Company{}!");
  log.add(
    "You must traverse the day to day tedium of everyday life to become the {gold}CEO{}."
  );
  log.pause();
  log.add("Make sales and fend off your annoying coworkers or die of boredom.");
  log.add("To move around, use the {#fff}arrow keys{}.");
  log.pause();

  await advanceLevel();
}

document.body.onload = () => {
  // intro.start(document.querySelector("#intro")).then(init);
  init();
};
