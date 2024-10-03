import { Bowman } from "../Characters/Bowman";
import { Magician } from "../Characters/Magician";
import { Swordsman } from "../Characters/Swordsman";
import { Daemon } from "../Characters/Daemon";
import { Vampire } from "../Characters/Vampire";
import { Undead } from "../Characters/Undead";

test("test create new Bowman character with correct attributes", () => {
   const bowman = new Bowman(1);
   expect(bowman.level).toBe(1);
   expect(bowman.health).toBe(100);
   expect(bowman.attack).toBe(50);
   expect(bowman.defence).toBe(50);
});

test("test create new Swordsman character with correct attributes", () => {
   const swordsman = new Swordsman(1);
   expect(swordsman.level).toBe(1);
   expect(swordsman.health).toBe(100);
   expect(swordsman.attack).toBe(60);
   expect(swordsman.defence).toBe(20);
});

test("test create new Magician character with correct attributes", () => {
   const magician = new Magician(1);
   expect(magician.level).toBe(1);
   expect(magician.health).toBe(100);
   expect(magician.attack).toBe(20);
   expect(magician.defence).toBe(60);
});

test("test create new Daemon character with correct attributes", () => {
   const daemon = new Daemon(1);
   expect(daemon.level).toBe(1);
   expect(daemon.health).toBe(100);
   expect(daemon.attack).toBe(20);
   expect(daemon.defence).toBe(60);
});

test("test create new Vampire character with correct attributes", () => {
   const vampire = new Vampire(1);
   expect(vampire.level).toBe(1);
   expect(vampire.health).toBe(100);
   expect(vampire.attack).toBe(50);
   expect(vampire.defence).toBe(50);
});

test("test create new Undead character with correct attributes", () => {
   const undead = new Undead(1);
   expect(undead.level).toBe(1);
   expect(undead.health).toBe(100);
   expect(undead.attack).toBe(60);
   expect(undead.defence).toBe(20);
});
