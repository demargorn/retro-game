import { Character } from "./Character";

class Team {
   constructor(public characters: Character[] = []) {
      this.characters = characters;
   }
}

export { Team };
