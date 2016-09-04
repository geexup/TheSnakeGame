import TheGame from "./lib/game.js";
import setConsts from "./lib/game_defaultConsts.js";
import bindEvents from "./lib/game_keyboardEvents.js";


window.game = new TheGame();
window.gameData = {};

setConsts();
bindEvents();

game.init({});