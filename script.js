import { addNewTile, dropTiles } from "./tile.js";
import { setupInputHandler } from "./input.js";
import { exitFullScreen } from "./utils.js";

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
        
        this.wordList = [];
        this.fetchWordLists();

        this.score = 0;
        this.scoreboard = document.getElementById('score');
        
        this.onStart = true;
        this.paused = false;
        this.gameOver = false;
        
        this.newTileTimer = 0;
        // 1327, 2003, 2657 are the key intervals
        this.newTileIntervals = [1031, 1103, 1217, 1327, 1433, 1559, 1669, 1789, 1901, 2003, 2111, 2207, 2311, 2437, 2557, 2657];
        this.newTileIntervalIndex = document.querySelector('input[name="difficulty"]:checked').value;
        this.newTileInterval = this.newTileIntervals[this.newTileIntervalIndex];
        this.dropTileTimer = 0;
        this.dropTileInterval = 337;
        this.scoreToChangeNewTileInterval = 150;
        
        setupInputHandler(this);
        this.scoreboard.innerHTML = this.score;
    }
    /**
     * Update the game
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        if (!this.onStart && !this.paused && !this.gameOver) {
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

            if (this.cells.slice(0, 5).some(cell => cell.classList.contains('tile') && !cell.classList.contains('falling'))) {
                document.body.style.backgroundColor = '#E0425A';
            }
            else {
                document.body.style.backgroundColor = '#EDEDED';
            }

            //increase new tile frequency
            if (this.score > this.scoreToChangeNewTileInterval) {
                this.scoreToChangeNewTileInterval += 150;
                this.newTileIntervalIndex = this.newTileIntervalIndex < 0 ? 0 : this.newTileIntervalIndex - 1;
                this.newTileInterval = this.newTileIntervals[this.newTileIntervalIndex];
            }

            //game over if all cells are tiles
            if (this.cells.length === this.cells.filter(cell => cell.classList.contains('tile')).length) {
                exitFullScreen();
                this.gameOver = true;
                document.getElementById('game-over-screen').style.display = 'block';
                document.getElementById('final-score').innerHTML = this.score;
            }
        }
    }
    /**
     * Increase the score based on the length of the word formed
     * @param {number} wordLength 
     */
    increaseScore(wordLength) {
        this.score += wordLength * (wordLength - 2);
        this.scoreboard.innerHTML = this.score;
    }
    /**
     * Reset the game
     */
    reset() {
        this.cells.forEach(cell => {
            cell.classList = 'cell empty';
            cell.innerHTML = '';
        });
        this.gameOver = false;
        this.newTileIntervalIndex = document.querySelector('input[name="difficulty"]:checked').value;
        this.newTileInterval = this.newTileIntervals[this.newTileIntervalIndex];
        document.getElementById('game-over-screen').style.display = 'none';
        this.score = 0;
        this.scoreboard.innerHTML = this.score;
        const scrollableLists = document.querySelectorAll('.scrollable-list');
        scrollableLists.forEach(scrollableList => {
            scrollableList.style.display = 'none';
            const listContainer = scrollableList.querySelector('.list-container');
            while (listContainer.firstChild) {
                listContainer.removeChild(listContainer.firstChild);
            }
        });
    }
    async fetchWordLists() {
        const [wordList1, wordList2] = await Promise.all([
            fetch('crosswd.txt')
                .then(response1 => {
                    if (response1.ok) return response1.text();
                    else throw new Error('Error fetching first file.');
                })
                .then(file1Contents => file1Contents.split('\n').map(word => word.trim()))
                .catch(error1 => {
                    console.error(error1);
                    return [];
                }),
            fetch('crswd-d.txt')
                .then(response2 => {
                    if (response2.ok) return response2.text();
                    else throw new Error('Error fetching second file.');
                })
                .then(file2Contents => file2Contents.split('\n').map(word => word.trim()))
                .catch(error2 => {
                    console.error(error2);
                    return [];
                })
        ]);
        this.wordList = [...wordList1, ...wordList2];
    }
}
