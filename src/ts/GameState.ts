import { themes } from "./themes";
import { PositionedCharacter } from "./PositionedCharacter";

class GameState {
   turnPlayer: boolean;
   isGameOver: boolean;
   level: number;
   score: number;
   positions: PositionedCharacter[];
   isLevelUp: boolean;
   theme: string;

   constructor(public maxScore: number) {
      this.turnPlayer = true;
      this.isGameOver = false;
      this.level = 1;
      this.score = 0;
      this.isLevelUp = null;
      this.maxScore = maxScore;
      this.positions = [];
      this.theme = themes.prairie;
   }
}

export { GameState };
