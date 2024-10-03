import { GameState } from "./GameState";

class GameStateService {
   constructor(public storage: Storage) {
      this.storage = storage;
   }

   save(state: object): void {
      this.storage.setItem("state", JSON.stringify(state));
   }

   load(): { error?: GameState } {
      try {
         return JSON.parse(this.storage.getItem("state"));
      } catch (e) {
         throw new Error("Invalid state");
      }
   }
}

export { GameStateService };
