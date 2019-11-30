import { Game } from "./game";
import Log from "./log";

function init() {
  const log = new Log(document.querySelector("#log"));
  const map = new Game(document.querySelector("#map"), log);

  // status.update();

  log.add("A truly beautiful day for a heroic action!");
  log.add(
    "This tower is surrounded by plains and trees and there might be a princess sleeping on the last floor."
  );
  log.pause();
  log.add(
    "Apparently the only way to get to her is to advance through all tower levels."
  );
  log.add(
    "To move around, use {#fff}arrow keys{}, {#fff}numpad{} or {#fff}vim-keys{}."
  );
  // log.pause();

  // let level = generate(1);
  // level.activate(level.start, pc);

  // actors.loop();
}

document.body.onload = () => {
  // intro.start(document.querySelector("#intro")).then(init);
  init();
};
