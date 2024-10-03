import { calcTileType, getInfoTemplate } from "../utils";
import { Bowman } from "../Characters/Bowman";

test("test calcTileType fn", () => {
   expect(calcTileType(0, 8)).toBe("top-left");
   expect(calcTileType(1, 8)).toBe("top");
   expect(calcTileType(7, 8)).toBe("top-right");
   expect(calcTileType(8, 8)).toBe("left");
   expect(calcTileType(15, 8)).toBe("right");
   expect(calcTileType(56, 8)).toBe("bottom-left");
   expect(calcTileType(57, 8)).toBe("bottom");
   expect(calcTileType(63, 8)).toBe("bottom-right");
});

test("test getInfoTemplate fn", () => {
   const bowman = new Bowman(1);
   expect(bowman.level).toBe(1);
   expect(bowman.health).toBe(100);
   expect(bowman.attack).toBe(50);
   expect(bowman.defence).toBe(50);
   const info = getInfoTemplate(bowman);
   expect(info).toBe(
      `${String.fromCodePoint(0x1f396)}1 ` +
         `${String.fromCodePoint(0x2694)}50 ` +
         `${String.fromCodePoint(0x1f6e1)}50 ` +
         `${String.fromCodePoint(0x2764)}100`
   );
});
