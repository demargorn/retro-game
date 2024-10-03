import { characterGenerator, generateTeam } from "../generators";
import { Character } from "../Character";
import { Bowman } from "../Characters/Bowman";
import { Swordsman } from "../Characters/Swordsman";
import { Magician } from "../Characters/Magician";
import { Vampire } from "../Characters/Vampire";
import { Daemon } from "../Characters/Daemon";
import { Undead } from "../Characters/Undead";

const aliveType: object[] = [Bowman, Swordsman, Magician];
const evilType: object[] = [Daemon, Vampire, Undead];
const team: Character[] = [];

test("test characterGenerator fn with aliveType characters", () => {
   const playerGenerator = characterGenerator(aliveType, 1);
   for (let i = 0; i < 10000; i += 1) {
      team.push(playerGenerator.next().value);
   }
   expect(team.length).toBe(10000);
   expect(team[6345].level).toBe(1);
   expect(team[3675].health).toBe(100);
});

test("test characterGenerator fn with evilType characters", () => {
   const playerGenerator = characterGenerator(evilType, 1);
   for (let i = 0; i < 10000; i += 1) {
      team.push(playerGenerator.next().value);
   }
   expect(team.length).toBe(20000);
   expect(team[2611].level).toBe(1);
   expect(team[675].health).toBe(100);
});

test("test generateTeam fn", () => {
   const evilTeam = generateTeam(evilType, 4, 100);
   const fourthLevel = evilTeam.find((item) => item.level > 4);
   expect(fourthLevel).toEqual(undefined);
   expect(evilTeam.length).toBe(100);
});
