import { addNewTile, dropTiles } from "./tile.js";
import setupInputHandler from "./input.js";

window.addEventListener('DOMContentLoaded', function() {
    const game = new Game();
    setupInputHandler(game);
    setInterval(function() { addNewTile(game); }, 997);
    setInterval(function() { dropTiles(game); }, 293);

    function gameLoop() {
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
})

export class Game {
    constructor() {
        this.grid = document.getElementById('grid');
        this.cells = Array.from(document.getElementsByClassName('cell')); 
        const gridComputedStyle = window.getComputedStyle(this.grid);
        this.numRows = gridComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;
        this.numColumns = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
    }
}
