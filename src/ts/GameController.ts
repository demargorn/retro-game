import { themes } from "./themes";
import { cursors } from "./cursors";

import { GamePlay } from "./GamePlay";
import { GameState } from "./GameState";
import { GameStateService } from "./GameStateService";
import { PositionedCharacter } from "./PositionedCharacter";
import { getRandomInt, generateTeam } from "./generators";
import { getInfoTemplate } from "./utils";

import { Bowman } from "./Characters/Bowman";
import { Swordsman } from "./Characters/Swordsman";
import { Magician } from "./Characters/Magician";
import { Vampire } from "./Characters/Vampire";
import { Undead } from "./Characters/Undead";
import { Daemon } from "./Characters/Daemon";
import { Character } from "./Character";

class GameController {
   gameState: GameState;
   currentPositionCharacter: PositionedCharacter;
   currentCellEnter: number;

   constructor(
      public gamePlay: GamePlay,
      public stateService?: GameStateService
   ) {
      this.gamePlay = gamePlay;
      this.stateService = stateService;
   }

   init(): void {
      this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
      this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
      this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
      this.gamePlay.addNewGameListener(() => this.initGame());
      this.gamePlay.addSaveGameListener(() => this.saveGame());
      this.gamePlay.addLoadGameListener(() => this.loadGame());
      this.loadGame();
      if (!this.gameState) {
         this.initGame();
      }
   }

   initGame(): void {
      this.loadGame();
      const maxScore =
         this.gameState && this.gameState.maxScore
            ? this.gameState.maxScore
            : 0;
      this.gameState = new GameState(maxScore);
      this.gamePlay.drawUi(this.gameState.theme);
      const playerTeam = generateTeam([Bowman, Swordsman, Magician], 1, 2);
      const enemyTeam = generateTeam([Daemon, Undead, Vampire], 1, 2);
      this.initTeam(playerTeam, enemyTeam);
      this.saveGame();
   }

   saveGame(): void {
      this.stateService.save(this.gameState);
   }

   loadGame(): void {
      try {
         this.gameState = this.stateService.load() as GameState;
         if (this.gameState) {
            this.gamePlay.drawUi(this.gameState.theme);
            this.gamePlay.redrawPositions(this.gameState.positions);
         }
      } catch (e) {
         GamePlay.showError(e.message);
      }
   }

   initTeam(playerTeam: Character[], enemyTeam: Character[]): void {
      this.gameState.positions = [];
      const playersPositions = this.playersPositions();
      const enemyPositions = this.enemyPositions();

      playerTeam.forEach((character) => {
         let position = -1;
         while (position < 0) {
            const pos =
               playersPositions[getRandomInt(0, playersPositions.length)];
            if (
               !this.gameState.positions.find((item) => item.position === pos)
            ) {
               position = pos;
            }
         }
         this.gameState.positions.push(
            new PositionedCharacter(character, position)
         );
      });
      enemyTeam.forEach((character) => {
         let position = -1;
         while (position < 0) {
            const pos = enemyPositions[getRandomInt(0, enemyPositions.length)];
            if (
               !this.gameState.positions.find((item) => item.position === pos)
            ) {
               position = pos;
            }
         }
         this.gameState.positions.push(
            new PositionedCharacter(character, position)
         );
      });

      this.gamePlay.redrawPositions(this.gameState.positions);
   }

   onCellClick(index: number): void {
      if (this.gameState.turnPlayer && !this.gameState.isGameOver) {
         const position = this.gameState.positions.find(
            (element) => element.position === index
         );
         if (position && !position.character.isEnemy) {
            if (this.currentPositionCharacter) {
               this.gamePlay.deselectCell(
                  this.currentPositionCharacter.position
               );
            }
            this.gamePlay.selectCell(index);
            this.currentPositionCharacter = position;
         } else if (
            !position &&
            this.currentPositionCharacter &&
            this.checkDistanceAllowed(this.currentPositionCharacter, index)
         ) {
            const prevPosition = this.currentPositionCharacter.position;
            this.currentPositionCharacter.position = index;
            this.gamePlay.deselectCell(prevPosition);
            this.gamePlay.deselectCell(index);
            this.currentPositionCharacter = undefined;
            this.gamePlay.redrawPositions(this.gameState.positions);
            this.gameState.turnPlayer = false;
            this.enemyAction();
         } else if (
            position &&
            position.character.isEnemy &&
            this.currentPositionCharacter &&
            this.checkAttackAllowed(this.currentPositionCharacter, index)
         ) {
            this.gamePlay.deselectCell(this.currentPositionCharacter.position);
            this.attack(this.currentPositionCharacter, position).then(() => {
               if (!this.gameState.isGameOver && !this.gameState.isLevelUp) {
                  this.enemyAction();
               } else if (this.gameState.isLevelUp) {
                  this.gameState.isLevelUp = false;
               }
            });
            this.currentPositionCharacter = undefined;
         } else if (position && position.character.isEnemy) {
            GamePlay.showError("This is the enemy character");
         }
      }
   }

   onCellEnter(index: number): void {
      if (this.gameState.turnPlayer && !this.gameState.isGameOver) {
         const position = this.gameState.positions.find(
            (item) => item.position === index
         );
         this.visualCallback(
            position,
            this.currentCellEnter,
            index,
            this.currentPositionCharacter
         );
      }
   }

   onCellLeave(index: number): void {
      this.gamePlay.hideCellTooltip(index);
   }

   visualCallback(
      position: PositionedCharacter,
      prevCell: number,
      curCell: number,
      currentPositionCharacter: PositionedCharacter
   ): void {
      if (
         prevCell !== undefined &&
         (!currentPositionCharacter ||
            currentPositionCharacter.position !== this.currentCellEnter)
      ) {
         this.gamePlay.deselectCell(prevCell);
      }
      this.currentCellEnter = curCell;
      if (position) {
         if (currentPositionCharacter) {
            if (
               position.character.isEnemy &&
               this.checkAttackAllowed(this.currentPositionCharacter, curCell)
            ) {
               this.gamePlay.selectCell(curCell, "red");
               this.gamePlay.setCursor(cursors.crosshair);
            } else if (
               !this.checkAttackAllowed(
                  this.currentPositionCharacter,
                  curCell
               ) &&
               position.character.isEnemy
            ) {
               this.gamePlay.setCursor(cursors.notallowed);
            } else {
               this.gamePlay.setCursor(cursors.pointer);
            }
         } else {
            this.gamePlay.setCursor(cursors.pointer);
         }
         const { character } = position;
         this.gamePlay.showCellTooltip(getInfoTemplate(character), curCell);
      } else if (currentPositionCharacter) {
         if (this.checkDistanceAllowed(currentPositionCharacter, curCell)) {
            this.gamePlay.selectCell(curCell, "green");
            this.gamePlay.setCursor(cursors.pointer);
         } else {
            this.gamePlay.setCursor(cursors.notallowed);
         }
      } else {
         this.gamePlay.setCursor(cursors.auto);
      }
   }

   checkDistanceAllowed(position: PositionedCharacter, index: number): boolean {
      const xCurrent = position.position % this.gamePlay.boardSize;
      const xEnter = index % this.gamePlay.boardSize;
      const yCurrent = Math.floor(position.position / this.gamePlay.boardSize);
      const yEnter = Math.floor(index / this.gamePlay.boardSize);
      return (
         Math.abs(xCurrent - xEnter) <= position.character.distance &&
         Math.abs(yCurrent - yEnter) <= position.character.distance &&
         (Math.abs(xCurrent - xEnter) === Math.abs(yCurrent - yEnter) ||
            Math.abs(xCurrent - xEnter) === 0 ||
            Math.abs(yCurrent - yEnter) === 0)
      );
   }

   checkAttackAllowed(
      attackPosition: PositionedCharacter,
      defencePositionIndex: number
   ): boolean {
      const xCurrent = attackPosition.position % this.gamePlay.boardSize;
      const xEnter = defencePositionIndex % this.gamePlay.boardSize;
      const yCurrent = Math.floor(
         attackPosition.position / this.gamePlay.boardSize
      );
      const yEnter = Math.floor(defencePositionIndex / this.gamePlay.boardSize);
      return (
         Math.abs(xCurrent - xEnter) <=
            attackPosition.character.distanceAttack &&
         Math.abs(yCurrent - yEnter) <=
            attackPosition.character.distanceAttack &&
         (Math.abs(xCurrent - xEnter) === Math.abs(yCurrent - yEnter) ||
            Math.abs(xCurrent - xEnter) === 0 ||
            Math.abs(yCurrent - yEnter) === 0)
      );
   }

   playersPositions(): number[] {
      const charIndexes = [];
      for (
         let i = 0;
         i < this.gamePlay.boardSize * this.gamePlay.boardSize;
         i += 1
      ) {
         const x = i % this.gamePlay.boardSize;
         if (x === 0 || x === 1) {
            charIndexes.push(i);
         }
      }
      return charIndexes;
   }

   enemyPositions(): number[] {
      const charIndexes = [];
      for (
         let i = 0;
         i < this.gamePlay.boardSize * this.gamePlay.boardSize;
         i += 1
      ) {
         const x = i % this.gamePlay.boardSize;
         if (
            x === this.gamePlay.boardSize - 1 ||
            x === this.gamePlay.boardSize - 2
         ) {
            charIndexes.push(i);
         }
      }
      return charIndexes;
   }

   enemyAction(): void {
      const enemyPositions = this.gameState.positions.filter(
         (position) => position.character.isEnemy
      );
      const playerPositions = this.gameState.positions.filter(
         (position) => !position.character.isEnemy
      );
      const attackerEnemy = enemyPositions.find((position) => {
         for (let i = 0; i < playerPositions.length; i += 1) {
            if (
               this.checkAttackAllowed(position, playerPositions[i].position)
            ) {
               return true;
            }
         }
         return false;
      });
      if (attackerEnemy) {
         const def = playerPositions.find((p) =>
            this.checkAttackAllowed(attackerEnemy, p.position)
         );
         this.attack(attackerEnemy, def);
      } else {
         const moverEnemy =
            enemyPositions[getRandomInt(0, enemyPositions.length)];
         const x = moverEnemy.position % this.gamePlay.boardSize;
         let left = getRandomInt(0, 2);
         if (x > 0 && left === 0) {
            if (x >= moverEnemy.character.distance) {
               moverEnemy.position -= moverEnemy.character.distance;
            } else {
               moverEnemy.position -= x;
            }
         } else if (
            x + moverEnemy.character.distance <
            this.gamePlay.boardSize
         ) {
            moverEnemy.position += moverEnemy.character.distance;
         } else if (x + 1 < this.gamePlay.boardSize) {
            moverEnemy.position += this.gamePlay.boardSize - 1 - x;
         } else {
            moverEnemy.position -= moverEnemy.character.distance;
            left = 0;
         }
         if (
            playerPositions.find((p) => p.position === moverEnemy.position) &&
            enemyPositions.find((p) => p.position === moverEnemy.position)
         ) {
            if (left === 0) {
               moverEnemy.position += 1;
            } else {
               moverEnemy.position -= 1;
            }
         }
         this.gamePlay.redrawPositions(this.gameState.positions);
         this.gameState.turnPlayer = !this.gameState.turnPlayer;
      }
   }

   attack(
      attacker: PositionedCharacter,
      defender: PositionedCharacter
   ): Promise<void> {
      const attackerAttack = attacker.character.attack;
      const targetDefence = defender.character.defence;
      const damage = Math.round(
         Math.max(attackerAttack - targetDefence, attackerAttack * 0.1)
      );
      const promise = this.gamePlay.showDamage(
         defender.position,
         damage.toString()
      );
      const defender0 = defender;
      promise.then(() => {
         const del = this.gameState.positions.findIndex(
            (element) => element === defender
         );
         defender0.character.health -= damage;
         if (defender0.character.health <= 0) {
            this.gameState.positions.splice(del, 1);
         }
         const enemyPositions = this.gameState.positions.filter(
            (position) => position.character.isEnemy
         );
         const playerPositions = this.gameState.positions.filter(
            (position) => !position.character.isEnemy
         );
         if (playerPositions.length <= 0) {
            if (this.gameState.maxScore < this.gameState.score) {
               this.gameState.maxScore = this.gameState.score;
            }
            GamePlay.showMessage(
               `GAME OVER \n Ваш счёт: ${this.gameState.score} \n Ваш максимальный счёт: ${this.gameState.maxScore}`
            );
            this.gameState.isGameOver = true;
            this.saveGame();
         } else if (enemyPositions.length <= 0) {
            this.nextLevel();
         } else {
            this.gameState.turnPlayer = !this.gameState.turnPlayer;
         }
         this.gamePlay.redrawPositions(this.gameState.positions);
      });
      return promise;
   }

   nextLevel(): void {
      const playerPositions = this.gameState.positions.filter(
         (position) => !position.character.isEnemy
      );
      let playerTeam = playerPositions.map((position) => position.character);
      this.gameState.score += playerTeam.reduce(
         (acc, character) => acc + character.health,
         0
      );
      this.gameState.level += 1;
      if (this.gameState.level === 5) {
         if (this.gameState.maxScore < this.gameState.score) {
            this.gameState.maxScore = this.gameState.score;
         }
         GamePlay.showMessage(
            `WINNER WINNER CHICKEN DINNER \n Ваш счёт: ${this.gameState.score} \n Ваш максимальный счёт: ${this.gameState.maxScore}`
         );
         this.gameState.isGameOver = true;
      } else {
         let enemyTeam;
         playerTeam.forEach((character) => character.levelUp());
         if (this.gameState.level === 2) {
            this.gamePlay.drawUi(themes.desert);
            this.gameState.theme = themes.desert;
            playerTeam = playerTeam.concat(
               generateTeam([Bowman, Swordsman, Magician], 1, 1)
            );
            enemyTeam = generateTeam(
               [Daemon, Undead, Vampire],
               2,
               playerTeam.length
            );
         }
         if (this.gameState.level === 3) {
            this.gamePlay.drawUi(themes.arctic);
            this.gameState.theme = themes.arctic;
            playerTeam = playerTeam.concat(
               generateTeam([Bowman, Swordsman, Magician], 2, 2)
            );
            enemyTeam = generateTeam(
               [Daemon, Undead, Vampire],
               3,
               playerTeam.length
            );
         }
         if (this.gameState.level === 4) {
            this.gamePlay.drawUi(themes.mountain);
            this.gameState.theme = themes.mountain;
            playerTeam = playerTeam.concat(
               generateTeam([Bowman, Swordsman, Magician], 3, 2)
            );
            enemyTeam = generateTeam(
               [Daemon, Undead, Vampire],
               4,
               playerTeam.length
            );
         }
         this.initTeam(playerTeam, enemyTeam);
         this.gameState.turnPlayer = true;
         this.gameState.isLevelUp = true;
      }

      this.saveGame();
   }
}

export { GameController };
