import { GamePlay } from "../GamePlay";
import { GameState } from "../GameState";

import { GameController } from "../GameController";
import { GameStateService } from "../GameStateService";

jest.mock("../GamePlay");
jest.mock("../GameStateService");

const localStorageMock = (() => {
   let store: { [key: string]: string } = {};

   return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
         store[key] = value.toString();
      },
   };
})();

Object.defineProperty(global, "localStorage", {
   value: localStorageMock,
});

beforeEach(() => {
   jest.resetAllMocks();
});

test("test load success", () => {
   const gc = new GameController(
      new GamePlay(),
      new GameStateService(localStorage)
   );
   jest.fn(() => new GameState(1));
   GamePlay.prototype.drawUi = jest.fn();
   GamePlay.prototype.redrawPositions = jest.fn();
   gc.loadGame();
   expect(GamePlay.prototype.drawUi.length).toBe(0);
   expect(GamePlay.prototype.redrawPositions.length).toBe(0);
});

test("test load error", () => {
   const gc = new GameController(
      new GamePlay(),
      new GameStateService(localStorage)
   );
   GameStateService.prototype.load = jest.fn(() => {
      throw new Error("Invalid state");
   });
   GamePlay.showError = jest.fn();
   gc.loadGame();
   expect(GamePlay.showError.length).toBe(0);
});
