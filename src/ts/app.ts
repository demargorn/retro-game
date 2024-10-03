import { GamePlay } from "./GamePlay";
import { GameController } from "./GameController";
import { GameStateService } from "./GameStateService";
import { themes } from "./themes";

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector("#game-container"));
gamePlay.drawUi(themes.prairie);

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();
