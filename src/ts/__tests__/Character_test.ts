import { Character } from "../Character";
import { Undead } from "../Characters/Undead";

test("test create new Character with %s keyword `Character`", () => {
   expect(() => new Character(1)).toThrow("invalid character type");
});

test("test create new Character with %s keyword `Undead`", () => {
   expect(new Undead(1)).toEqual({
      attack: 60,
      defence: 20,
      distance: 3,
      distanceAttack: 1,
      health: 100,
      level: 1,
      type: "undead",
      isEnemy: true,
   });
});
