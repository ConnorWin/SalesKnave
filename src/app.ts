import { Game } from "./game";
import Log from "./log";

function init() {
  const log = new Log(document.querySelector("#log"));
  const map = new Game(document.querySelector("#map"), log);

  // status.update();

  log.add("Welcome to the {aqua}Leaps and Bounds Trampoline Company{}!");
  log.add(
    "You must traverse the day to day tedium of everyday life to become the {gold}CEO{}."
  );
  log.pause();
  log.add("Make sales and fend off your annoying coworkers or die of boredom.");
  log.add("To move around, use the {#fff}arrow keys{}.");
  log.pause();

  // let level = generate(1);
  // level.activate(level.start, pc);

  // actors.loop();
}

document.body.onload = () => {
  // intro.start(document.querySelector("#intro")).then(init);
  init();
};
