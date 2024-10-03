import { Character } from "./Character";

function calcTileType(index: number, boardSize: number): string {
   for (let i = 0; i <= boardSize ** 2 - 1; i += 1) {
      if (index === 0) {
         return "top-left";
      }
      if (index > 0 && index < boardSize - 1) {
         return "top";
      }
      if (index === boardSize - 1) {
         return "top-right";
      }

      if (index % boardSize === 0 && index !== boardSize ** 2 - boardSize) {
         return "left";
      }

      if (index === boardSize ** 2 - boardSize) {
         return "bottom-left";
      }

      if (index > boardSize ** 2 - boardSize && index < boardSize ** 2 - 1) {
         return "bottom";
      }

      if (index === boardSize ** 2 - 1) {
         return "bottom-right";
      }

      if (index % boardSize === boardSize - 1) {
         return "right";
      }
   }
   return "center";
}

function calcHealthLevel(health: number): string {
   if (health < 15) {
      return "critical";
   }

   if (health < 50) {
      return "normal";
   }
   return "high";
}

function getInfoTemplate(character: Character): string {
   return (
      `${String.fromCodePoint(0x1f396)}${character.level} ` +
      `${String.fromCodePoint(0x2694)}${character.attack} ` +
      `${String.fromCodePoint(0x1f6e1)}${character.defence} ` +
      `${String.fromCodePoint(0x2764)}${character.health}`
   );
}

export { calcTileType, calcHealthLevel, getInfoTemplate };
