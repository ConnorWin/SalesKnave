import { RNG } from "rot-js";
import { Position } from "./position";
import { Level } from "./level";
import { Player } from "./player";
import { Wall, Boss, Enemy, Door, Potion } from "./elements";
import { CharacterDrawling } from "./characterDrawling";
import Log from "./log";

const AI_RANGE = 7;
const AI_IDLE = 0.4;
const DIRS = [
  new Position(0, -1),
  new Position(1, 0),
  new Position(0, 1),
  new Position(-1, 0)
];

function wander(level: Level, who: Enemy) {
  let result = Promise.resolve();

  if (RNG.getUniform() < AI_IDLE) {
    return result;
  }

  let xy = who.currentPosition;

  let dirs = DIRS.filter(dxy => {
    let entity = level.getEntity(xy.plus(dxy));
    return !entityBlocksMovement(entity);
  });

  if (!dirs.length) {
    return result;
  }

  let dir = RNG.getItem(dirs);
  who.currentPosition = xy.plus(dir);
  return result;
}

function entityBlocksMovement(entity: CharacterDrawling) {
  return (
    !entity ||
    entity instanceof Wall ||
    entity.symbol === "#" ||
    entity instanceof Player ||
    entity instanceof Boss ||
    entity instanceof Enemy ||
    entity instanceof Potion
  );
}

function getCloserToPC(level: Level, who: Enemy, pc: Player) {
  let best = 1 / 0;
  let avail = [];

  DIRS.forEach(dxy => {
    let xy = who.currentPosition.plus(dxy);
    let entity = level.getEntity(xy);
    if (entityBlocksMovement(entity)) {
      return;
    }

    let dist = xy.dist8(pc.currentPosition);
    if (dist < best) {
      best = dist;
      avail = [];
    }

    if (dist == best) {
      avail.push(xy);
    }
  });

  if (avail.length) {
    const to = RNG.getItem(avail);
    who.currentPosition = to;
  }

  return Promise.resolve();
}

function actHostile(level: Level, who: Enemy, pc: Player, log: Log) {
  let dist = who.currentPosition.dist8(pc.currentPosition);
  if (DIRS.some(dir => who.currentPosition.plus(dir).eq(pc.currentPosition))) {
    const attack = RNG.getItem(who.attacks);
    log.add(attack.phrase);
    pc.dealDamage(attack.damage);

    if (pc.hp === 0) {
      level.actors.clear();
      log.pause();
      log.add("You have {red}died{}. Better luck next time");
    }
    return;
  }

  if (dist <= AI_RANGE && RNG.getUniform() > 0.25) {
    return getCloserToPC(level, who, pc);
  } else {
    return wander(level, who);
  }
}

export function act(level: Level, who: Enemy, log: Log) {
  return actHostile(level, who, level.actors.pc, log);
}
