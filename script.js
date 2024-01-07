import { addNewTile, dropTiles } from "./tile.js";
import { setupInputHandler } from "./input.js";
import { exitFullScreen, rareLetterScoreBonus, isMobileBrowser } from "./utils.js";
import { CanvasOverlay } from "./canvas-overlay.js";
import { AudioPlayer } from "./audio.js";

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
        this.positionHeader();

        this.canvasOverlay = new CanvasOverlay();
        this.audioPlayer = new AudioPlayer();
        this.score = 0;
        this.scoreboards = document.querySelectorAll('.score');
        
        this.onStart = true;
        this.paused = false;
        this.gameOver = false;
        
        this.newTileTimer = 0;
        // 1327, 2003, 2657 are the key intervals
        this.newTileIntervals = [947, 1031, 1103, 1217, 1327, 1433, 1559, 1669, 1789, 1901, 2003, 2111, 2207, 2311, 2437, 2557, 2657];
        this.newTileIntervalIndex = document.querySelector('input[name="difficulty1"]:checked').value;
        this.newTileInterval = this.newTileIntervals[this.newTileIntervalIndex];
        this.dropTileTimer = 0;
        this.dropTileInterval = 337;
        this.scoreToChangeNewTileInterval = 150;
        
        setupInputHandler(this);
        this.scoreboards.forEach(scoreboard => scoreboard.innerHTML = this.score);
    }
    /**
     * Update the game
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        this.audioPlayer.loopAudioCheck();
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

            this.canvasOverlay.update();

            //body turns red to warn player
            if (this.cells.filter(cell => cell.classList.contains('empty')).length < 10) {
                document.body.style.backgroundColor = '#E0425A';
                this.audioPlayer.speedUpAudio();
            }
            else {
                document.body.style.backgroundColor = '#EDEDED';
                this.audioPlayer.slowDownAudio();
            }

            //increase new tile frequency when score reaches certain intervals
            if (this.score > this.scoreToChangeNewTileInterval) {
                this.scoreToChangeNewTileInterval += 150;
                this.newTileIntervalIndex = this.newTileIntervalIndex <= 0 ? 0 : this.newTileIntervalIndex - 1;
                this.newTileInterval = this.newTileIntervals[this.newTileIntervalIndex];
            }

            //game over if all cells are tiles
            if (this.cells.length === this.cells.filter(cell => cell.classList.contains('tile')).length) {
                exitFullScreen();
                this.gameOver = true;
                document.getElementById('canvas').style.display = 'none';
                document.getElementById('game-over-screen').style.display = 'block';
                this.audioPlayer.fadeOutAudio();
            }
        }
    }
    /**
     * Increase the score based on the the word formed
     * @param {string} word
     * @param {number} x coordinate of score pop-up
     * @param {number} y coordinate of score pop-up
     */
    increaseScore(word, x, y) {
        let bonusInfo = rareLetterScoreBonus(word);
        let points = word.length * (word.length - 2) + bonusInfo[0];
        this.score += points;
        this.scoreboards.forEach(scoreboard => scoreboard.innerHTML = this.score);
        this.canvasOverlay.addScoreText(x, y, points, bonusInfo[1]);
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
        this.newTileIntervalIndex = document.querySelector('input[name="difficulty2"]:checked').value;
        this.newTileInterval = this.newTileIntervals[this.newTileIntervalIndex];
        document.getElementById('game-over-screen').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        this.score = 0;
        this.scoreboards.forEach(scoreboard => scoreboard.innerHTML = this.score);
        const scrollableLists = document.querySelectorAll('.scrollable-list');
        scrollableLists.forEach(scrollableList => {
            scrollableList.style.display = 'none';
            const listContainer = scrollableList.querySelector('.list-container');
            while (listContainer.firstChild) {
                listContainer.removeChild(listContainer.firstChild);
            }
        });
        this.audioPlayer.playAudio();
    }
    /**
     * Fetch the files of possible words
     */
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
    /**
     * Dynamically position menu buttons around the grid
     */
    positionHeader() {
        if (!isMobileBrowser()) {
            document.getElementById('fullscreen-notice').style.display = 'none';
        }

        const pauseButton = document.getElementById('pause-button');
        const muteButton = document.getElementById('mute-button');
        const onscreenScoreHeader = document.getElementById('onscreen-score-header');
        const gridRect = this.grid.getBoundingClientRect();

        pauseButton.style.width = gridRect.width / (2 * this.numColumns) + 'px';
        pauseButton.style.height = Math.min(gridRect.top - 2, gridRect.height / (2 * this.numRows)) + 'px';
        const pauseButtonRect = pauseButton.getBoundingClientRect();
        pauseButton.style.top = gridRect.top - pauseButtonRect.height - 2 + 'px';
        pauseButton.style.left = gridRect.right - pauseButtonRect.width + 'px';

        muteButton.style.width = gridRect.width / (2 * this.numColumns) + 'px';
        muteButton.style.height = Math.min(gridRect.top - 2, gridRect.height / (2 * this.numRows)) + 'px';
        const muteButtonRect = muteButton.getBoundingClientRect();
        muteButton.style.top = gridRect.top - muteButtonRect.height - 2 + 'px';
        muteButton.style.left = gridRect.right - muteButtonRect.width - 2 - muteButtonRect.width + 'px';

        onscreenScoreHeader.style.width = gridRect.width / 2 + 'px';
        onscreenScoreHeader.style.height = Math.min(gridRect.top - 2, gridRect.height / (2 * this.numRows)) + 'px';
        const onscreenScoreHeaderRect = onscreenScoreHeader.getBoundingClientRect();
        onscreenScoreHeader.style.top = gridRect.top - onscreenScoreHeaderRect.height - 2 + 'px';
        onscreenScoreHeader.style.left = gridRect.left + 'px';
    }
}
