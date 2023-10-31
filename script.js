import { addNewTile, dropTiles } from "./tile.js";

window.addEventListener('DOMContentLoaded', function() {
    const game = new Game();

    function gameLoop(deltaTime) {
        //addNewTile(game);
        //dropTiles(game);
        requestAnimationFrame(gameLoop);
    }
    gameLoop(0);
})

export class Game {
    constructor() {
        this.grid = document.getElementById('grid');
        this.cells = Array.from(document.getElementsByClassName('cell')); 
        const gridComputedStyle = window.getComputedStyle(this.grid);
        this.numRows = gridComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;
        this.numColumns = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
    }
    update() {

    }
}
