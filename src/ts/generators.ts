import { Character } from "./Character";
import { Bowman } from "./Characters/Bowman";
import { Magician } from "./Characters/Magician";
import { Swordsman } from "./Characters/Swordsman";
import { Daemon } from "./Characters/Daemon";
import { Vampire } from "./Characters/Vampire";
import { Undead } from "./Characters/Undead";

function getRandomInt(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min) + min);
}

function* characterGenerator(
   allowedTypes: object[],
   maxLevel: number
): Iterator<object> {
   const level = (maxLevel: number): number =>
      Math.floor(Math.random() * maxLevel) + 1;

   for (
      let i = 0;
      i <= allowedTypes.length;
      i = Math.floor(Math.random() * allowedTypes.length)
   ) {
      if (allowedTypes[i] === Bowman) {
         yield new Bowman(level(maxLevel));
      }
      if (allowedTypes[i] === Magician) {
         yield new Magician(level(maxLevel));
      }
      if (allowedTypes[i] === Swordsman) {
         yield new Swordsman(level(maxLevel));
      }
      if (allowedTypes[i] === Daemon) {
         yield new Daemon(level(maxLevel));
      }
      if (allowedTypes[i] === Vampire) {
         yield new Vampire(level(maxLevel));
      }
      if (allowedTypes[i] === Undead) {
         yield new Undead(level(maxLevel));
      }
   }
}

function generateTeam(
   allowedTypes: object[],
   maxLevel: number,
   characterCount: number
): Character[] {
   const playerGenerator = characterGenerator(allowedTypes, maxLevel);
   const team: Character[] = [];

   for (let i = 0; i < characterCount; i += 1) {
      team.push(playerGenerator.next().value);
   }

   return team;
}

export { characterGenerator, generateTeam, getRandomInt };
