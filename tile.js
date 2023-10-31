import { Game } from "./script.js";
import randomAtoZ from "./utils.js";

/**
 * Add a new tile to the top row of the grid
 * @param {Game} game
 */
export function addNewTile(game) {
    const /** @type {HTMLDivElement[]} */ topCells = game.cells.slice(0, game.numColumns);
    const emptyTopCells = topCells.filter(cell => cell.classList.contains('empty'));
    if (emptyTopCells.length === 0) {
        return;
    }
    const randomTopCell = emptyTopCells[Math.floor(Math.random() * emptyTopCells.length)];
    randomTopCell.classList.remove('empty');
    randomTopCell.classList.add('tile');
    randomTopCell.innerHTML = randomAtoZ();
}

/**
 * Lower the tiles down the grid
 * @param {Game} game
 */
export function dropTiles(game) {
    for (let i = game.cells.length - 1; i >= 0; i--) {
        const oldLocation = game.cells[i];
        const newLocation = game.cells[i + game.numColumns];
        if (oldLocation.classList.contains('tile') && i + game.numColumns < game.cells.length && 
            newLocation.classList.contains('empty')) 
        {
            oldLocation.classList.remove('tile');
            oldLocation.classList.add('empty');
            
            newLocation.classList.remove('empty');
            newLocation.classList.add('tile');
            newLocation.innerHTML = oldLocation.innerHTML;
            oldLocation.innerHTML = '';
        }
    }
}