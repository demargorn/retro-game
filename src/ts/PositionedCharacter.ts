import { Character } from "./Character";

class PositionedCharacter {
   constructor(public character: Character, public position: number) {
      if (!(character instanceof Character)) {
         throw new Error(
            "character must be instance of Character or its children"
         );
      }

      this.character = character;
      this.position = position;
   }
}
export { PositionedCharacter };
