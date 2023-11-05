import { addNewTile, dropTiles } from "./tile.js";
import setupInputHandler from "./input.js";

window.addEventListener('DOMContentLoaded', function() {
    const game = new Game();

    let lastTime = 0;
    function gameLoop(timeStamp) {
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltaTime);
        requestAnimationFrame(gameLoop);
    }
    gameLoop(0);
})

export class Game {
    /**
     * @constructor
     */
    constructor() {
        this.grid = document.getElementById('grid');
        this.cells = Array.from(document.getElementsByClassName('cell')); 
        const gridComputedStyle = window.getComputedStyle(this.grid);
        this.numRows = gridComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;
        this.numColumns = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
        this.score = 0;
        this.newTileTimer = 0;
        this.newTileInterval = 997;
        this.dropTileTimer = 0;
        this.dropTileInterval = 293;
        setupInputHandler(this);
    }
    /**
     * Update the game
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        this.newTileTimer += deltaTime;
        this.dropTileTimer += deltaTime;
        if (this.dropTileTimer > this.dropTileInterval) {
            dropTiles(this);
            this.dropTileTimer = 0;
        }
        else if (this.newTileTimer > this.newTileInterval) {
            addNewTile(this);
            this.newTileTimer = 0;
        } 
    }
    /**
     * Increase the score based on the length of the word formed
     * @param {number} wordLength 
     */
    increaseScore(wordLength) {
        this.score += wordLength ** 2 - wordLength;
    }
}
