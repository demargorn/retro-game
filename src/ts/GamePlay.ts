import { calcHealthLevel, calcTileType } from "./utils";
import { PositionedCharacter } from "./PositionedCharacter";
import { TypeCallBackNumber } from "./Types/TypeCallBackNumber";
import { TypeCallBackEmpty } from "./Types/TypeCallBackVoid";

class GamePlay {
   boardSize: number;
   cells: HTMLElement[];
   cellClickListeners: TypeCallBackNumber[];
   cellEnterListeners: TypeCallBackNumber[];
   cellLeaveListeners: TypeCallBackNumber[];
   newGameListeners: TypeCallBackEmpty[];
   saveGameListeners: TypeCallBackEmpty[];
   loadGameListeners: TypeCallBackEmpty[];
   container: HTMLElement;
   boardEl: HTMLElement;
   newGameEl: HTMLElement;
   saveGameEl: HTMLElement;
   loadGameEl: HTMLElement;

   constructor() {
      this.boardSize = 8;
      this.container = null;
      this.boardEl = null;
      this.cells = [];
      this.cellClickListeners = [];
      this.cellEnterListeners = [];
      this.cellLeaveListeners = [];
      this.newGameListeners = [];
      this.saveGameListeners = [];
      this.loadGameListeners = [];
   }

   bindToDOM(container: HTMLElement): void {
      this.container = container;
   }

   drawUi(theme: string): void {
      this.checkBinding();

      this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

      this.newGameEl = this.container.querySelector("[data-id=action-restart]");
      this.saveGameEl = this.container.querySelector("[data-id=action-save]");
      this.loadGameEl = this.container.querySelector("[data-id=action-load]");

      this.newGameEl.addEventListener("click", (event) =>
         this.onNewGameClick(event)
      );
      this.saveGameEl.addEventListener("click", (event) => {
         this.onSaveGameClick(event);
         GamePlay.showMessage("Game saved");
      });
      this.loadGameEl.addEventListener("click", (event) => {
         this.onLoadGameClick(event);
         GamePlay.showMessage("Game loaded");
      });

      this.boardEl = this.container.querySelector("[data-id=board]");
      this.boardEl.classList.add(theme);

      for (let i = 0; i < this.boardSize ** 2; i += 1) {
         const cellEl = document.createElement("div");
         cellEl.classList.add(
            "cell",
            "map-tile",
            `map-tile-${calcTileType(i, this.boardSize)}`
         );
         cellEl.addEventListener("mouseenter", (event) =>
            this.onCellEnter(event)
         );
         cellEl.addEventListener("mouseleave", (event) =>
            this.onCellLeave(event)
         );
         cellEl.addEventListener("click", (event) => this.onCellClick(event));
         this.boardEl.appendChild(cellEl);
      }

      this.cells = Array.from(this.boardEl.children) as HTMLElement[];
   }

   redrawPositions(positions: PositionedCharacter[]): void {
      for (const cell of this.cells) {
         cell.innerHTML = "";
      }

      for (const position of positions) {
         const cellEl = this.boardEl.children[position.position];
         const charEl = document.createElement("div");
         charEl.classList.add("character", position.character.type);

         const healthEl = document.createElement("div");
         healthEl.classList.add("health-level");

         const healthIndicatorEl = document.createElement("div");
         healthIndicatorEl.classList.add(
            "health-level-indicator",
            `health-level-indicator-${calcHealthLevel(
               position.character.health
            )}`
         );
         healthIndicatorEl.style.width = `${position.character.health}%`;
         healthEl.appendChild(healthIndicatorEl);

         charEl.appendChild(healthEl);
         cellEl.appendChild(charEl);
      }
   }

   addCellEnterListener(callback: TypeCallBackNumber): void {
      this.cellEnterListeners.push(callback);
   }

   addCellLeaveListener(callback: TypeCallBackNumber): void {
      this.cellLeaveListeners.push(callback);
   }

   addCellClickListener(callback: TypeCallBackNumber): void {
      this.cellClickListeners.push(callback);
   }

   addNewGameListener(callback: TypeCallBackEmpty): void {
      this.newGameListeners.push(callback);
   }

   addSaveGameListener(callback: TypeCallBackEmpty): void {
      this.saveGameListeners.push(callback);
   }

   addLoadGameListener(callback: TypeCallBackEmpty): void {
      this.loadGameListeners.push(callback);
   }

   onCellEnter(event: Event): void {
      event.preventDefault();
      const index = this.cells.indexOf(event.currentTarget as HTMLElement);
      this.cellEnterListeners.forEach((o) => o.call(null, index));
   }

   onCellLeave(event: Event): void {
      event.preventDefault();
      const index = this.cells.indexOf(event.currentTarget as HTMLElement);
      this.cellLeaveListeners.forEach((o) => o.call(null, index));
   }

   onCellClick(event: Event): void {
      const index = this.cells.indexOf(event.currentTarget as HTMLElement);
      this.cellClickListeners.forEach((o) => o.call(null, index));
   }

   onNewGameClick(event: Event): void {
      event.preventDefault();
      this.newGameListeners.forEach((o) => o.call(null));
   }

   onSaveGameClick(event: Event): void {
      event.preventDefault();
      this.saveGameListeners.forEach((o) => o.call(null));
   }

   onLoadGameClick(event: Event): void {
      event.preventDefault();
      this.loadGameListeners.forEach((o) => o.call(null));
   }

   static showError(message: string): void {
      alert(message);
   }

   static showMessage(message: string): void {
      alert(message);
   }

   selectCell(index: number, color: string = "yellow"): void {
      this.deselectCell(index);
      this.cells[index].classList.add("selected", `selected-${color}`);
   }

   deselectCell(index: number): void {
      const cell = this.cells[index];
      cell.classList.remove(
         ...Array.from(cell.classList).filter((o) => o.startsWith("selected"))
      );
   }

   showCellTooltip(message: string, index: number): void {
      this.cells[index].title = message;
   }

   hideCellTooltip(index: number): void {
      this.cells[index].title = "";
   }

   showDamage(index: number, damage: string): Promise<void> {
      return new Promise((resolve): void => {
         const cell = this.cells[index];
         const damageEl = document.createElement("span");
         damageEl.textContent = damage;
         damageEl.classList.add("damage");
         cell.appendChild(damageEl);

         damageEl.addEventListener("animationend", () => {
            cell.removeChild(damageEl);
            resolve();
         });
      });
   }

   setCursor(cursor: string): void {
      this.boardEl.style.cursor = cursor;
   }

   checkBinding(): void {
      if (this.container === null) {
         throw new Error("GamePlay not bind to DOM");
      }
   }
}

export { GamePlay };
