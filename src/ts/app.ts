import { GamePlay } from "./GamePlay";
import { GameController } from "./GameController";
import { GameStateService } from "./GameStateService";
import { Themes } from "./themes";

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector("#game-container"));
gamePlay.drawUi(Themes.Prairie);

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();
