import { Game } from "./script.js";
import { randomAtoZ } from "./utils.js";

/**
 * Add a new tile to the top row of the grid
 * @param {Game} game
 */
export function addNewTile(game) {
    const /** @type {HTMLDivElement[]} */ topCells = game.cells.slice(0, game.numColumns);
    const emptyTopCells = topCells.filter(cell => cell.classList.contains('empty'));
    if (emptyTopCells.length === 0) return;
    const randomTopCell = emptyTopCells[Math.floor(Math.random() * emptyTopCells.length)];
    randomTopCell.classList.remove('empty');
    randomTopCell.classList.add('tile', 'falling');
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
            oldLocation.classList.remove('tile', 'falling');
            oldLocation.classList.add('empty');
            
            newLocation.classList.remove('empty');
            newLocation.classList.add('tile');
            if (i + game.numColumns < game.cells.length - game.numColumns) newLocation.classList.add('falling');
            newLocation.innerHTML = oldLocation.innerHTML;
            oldLocation.innerHTML = '';
        }
        else {  //NOTE: nested if-clause 4-lines above may make this deletable
            oldLocation.classList.remove('falling');
        }
    }
}

/**
 * Mark all tiles above a given tile as falling
 * @param {Game} game
 * @param tile
 */
export function markAboveAsFalling(game, tile) {
    let tileIndex = game.cells.findIndex(cell => cell === tile);
    for (tileIndex; tileIndex >= 0; tileIndex -= game.numColumns) {
        game.cells[tileIndex].classList.add('falling');
    }
}

const pixelRatio = (window.devicePixelRatio || 1) / 10000;
/**
 * Check if two tiles are adjacent to one another
 * @param {HTMLElement} newTile 
 * @param {HTMLElement} lastTile 
 * @returns {boolean} are tiles adjacent
 */
export function isAdjacent(newTile, lastTile) {
    if (!lastTile) return true;
    if (newTile === lastTile) return false;
    const newTileRect = newTile.getBoundingClientRect();
    const lastTileRect = lastTile.getBoundingClientRect();
    const verticallyAdjacent = 
        (Math.abs(newTileRect.bottom - lastTileRect.top) <= pixelRatio || 
        Math.abs(newTileRect.top - lastTileRect.bottom) <= pixelRatio) &&
        newTileRect.left === lastTileRect.left && newTileRect.right === lastTileRect.right;
    const horizontallyAdjacent = 
        (Math.abs(newTileRect.right - lastTileRect.left) <= pixelRatio ||
        Math.abs(newTileRect.left - lastTileRect.right) <= pixelRatio) &&
        newTileRect.top === lastTileRect.top && newTileRect.bottom === lastTileRect.bottom;
    const diagonallyAdjacent =
        (Math.abs(newTileRect.bottom - lastTileRect.top) <= pixelRatio && 
        (Math.abs(newTileRect.right - lastTileRect.left) <= pixelRatio || 
        Math.abs(newTileRect.left - lastTileRect.right) <= pixelRatio)) ||
        (Math.abs(newTileRect.top - lastTileRect.bottom) <= pixelRatio && 
        (Math.abs(newTileRect.right - lastTileRect.left) <= pixelRatio || 
        Math.abs(newTileRect.left - lastTileRect.right) <= pixelRatio));
    return verticallyAdjacent || horizontallyAdjacent || diagonallyAdjacent;
}
