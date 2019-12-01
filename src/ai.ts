// import XY from "util/xy.js";
// import pc from "being/pc.js";
// import { DIRS } from "conf.js";
// import { BLOCKS_MOVEMENT } from "entity.js";
// import * as rules from "rules.js";
// import * as combat from "combat/combat.js";
// import * as log from "ui/log.js";
import { RNG } from "rot-js";
import { Position } from "./position";
import { Level } from "./level";
import { Player } from "./player";
import { Wall, Boss, Enemy, Door } from "./elements";
import { CharacterDrawling } from "./characterDrawling";
import Log from "./log";

const AI_RANGE = 7;
const AI_IDLE = 0.4;
const DIRS = [
  new Position(-1, -1),
  new Position(0, -1),
  new Position(1, -1),
  new Position(1, 0),
  new Position(1, 1),
  new Position(0, 1),
  new Position(-1, 1),
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
    return entityBlocksMovement(entity);
  });

  if (!dirs.length) {
    return result;
  }

  let dir = RNG.getItem(dirs);
  who.currentPosition = xy.plus(dir);
  level.moveTo(who.currentPosition, who);
  return result;
}

function entityBlocksMovement(entity: CharacterDrawling) {
  return (
    entity &&
    (entity instanceof Wall ||
      entity instanceof Player ||
      entity instanceof Boss ||
      entity instanceof Door ||
      entity["hp"] > 0)
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
    level.moveTo(to, who);
  }

  return Promise.resolve();
}

function actHostile(level: Level, who: Enemy, pc: Player, log: Log) {
  let dist = who.currentPosition.dist8(pc.currentPosition);
  if (dist == 1) {
    // log.add("{#f00}You are attacked by %a!{}", who);
    // return combat.start(who);
    const attack = RNG.getItem(who.attacks);
    log.add(attack.phrase);
    pc.dealDamage(attack.damage);
    return;
  }

  if (dist <= AI_RANGE) {
    return getCloserToPC(level, who, pc);
  } else {
    return wander(level, who);
  }
}

export function act(level: Level, who: Enemy, log: Log) {
  return actHostile(level, who, level.actors.pc, log);
}
