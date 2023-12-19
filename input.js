import { Game } from "./script.js";
import { isAdjacent, markAboveAsFalling } from "./tile.js";
import { launchFullScreen, exitFullScreen } from "./utils.js";

let isMousePressed = false;
let isTouchPressed = false;
let lastTilePressed = null;
let tilesTraced = [];
const correctnessFlashTime = 79; //tiles flash green or red depending on vaildity of word formed
const scrollableLists = document.querySelectorAll('.scrollable-list');
let lastClickTime = 0;

/**
 * Handle events caused by mouse movement
 * @param {MouseEvent} event 
 */
function handleMouseMove(event) {
    if (isMousePressed) handleMove(event.clientX, event.clientY);
}

/**
 * Handle events caused by touching the screen
 * @param {TouchEvent} event 
 */
function handleTouchMove(event) {
    if (isTouchPressed) handleMove(event.touches[0].clientX, event.touches[0].clientY);
}

/**
 * General function that handles both mouse movements and touch movements
 * @param {number} x x-coordinate of the affected element
 * @param {number} y y-coordinate of the affected element
 */
function handleMove(x, y) {
    const target = document.elementFromPoint(x, y);
    //if the tile is highlight-able, highlight it
    if (target && target.classList.contains('tile') && !target.classList.contains('falling') &&
        isAdjacent(target, lastTilePressed) && !tilesTraced.includes(target))
    {
        const tileRect = target.getBoundingClientRect();
        const centerX = tileRect.left + tileRect.width / 2;
        const centerY = tileRect.top + tileRect.height / 2;
        if (Math.abs(x - centerX) < tileRect.width / 3 &&
            Math.abs(y - centerY) < tileRect.height / 3)
        {
            target.classList.add('touched');
            lastTilePressed = target;
            tilesTraced.push(target);
        }
    }
    //if the tile is the one touched previously, undo the last tile highlight
    else if (target === tilesTraced[tilesTraced.length - 2]) {
        const tileRect = target.getBoundingClientRect();
        const centerX = tileRect.left + tileRect.width / 2;
        const centerY = tileRect.top + tileRect.height / 2;
        if (Math.abs(x - centerX) < tileRect.width / 3 &&
            Math.abs(y - centerY) < tileRect.height / 3)
        {
            tilesTraced[tilesTraced.length - 1].classList.remove('touched');
            lastTilePressed = target;
            tilesTraced.pop();
        }
    }
}

/**
 * Set up all input handlers
 * @param {Game} game
 */
export function setupInputHandler(game) {
    //mouse and touch events
    game.grid.addEventListener('mousedown', () => {
        isMousePressed = true;
    });
    document.addEventListener('mouseup', () => {
        isMousePressed = false;
        checkWordValidity(game, lastTilePressed);
        lastTilePressed = null;
    });
    game.grid.addEventListener('mouseleave', () => {  //NOTE: deletable if you choose
        isMousePressed = false;
        checkWordValidity(game, lastTilePressed);
        lastTilePressed = null;
    });
    game.grid.addEventListener('mousemove', handleMouseMove);

    game.grid.addEventListener('touchstart', () => {
        isTouchPressed = true;
    });
    document.addEventListener('touchend', () => {
        isTouchPressed = false;
        checkWordValidity(game, lastTilePressed);
        lastTilePressed = null;
    });
    game.grid.addEventListener('touchmove', handleTouchMove);

    //UI-related events
    document.getElementById('start-button').addEventListener('click', () => {
        launchFullScreen(document.documentElement);
        game.onStart = false;
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        game.newTileIntervalIndex = document.querySelector('input[name="difficulty1"]:checked').value;
        game.newTileInterval = game.newTileIntervals[game.newTileIntervalIndex];
        
        //set game over screen difficulty selection to match start screen
        const difficultyOptions = document.querySelectorAll('input[name="difficulty2"]');
        difficultyOptions.forEach((difficultyOption) => {
            if (difficultyOption.value === game.newTileIntervalIndex) difficultyOption.checked = true;
            else difficultyOption.checked = false;
        });
    });
    document.addEventListener('click', () => {
        if (!game.onStart && !game.paused && !game.gameOver) {
            const currentTime = new Date().getTime();
            const timeDifference = currentTime - lastClickTime;
            if (timeDifference < 250) {
                exitFullScreen();
                game.paused = true;
                document.getElementById('canvas').style.display = 'none';
                document.getElementById('pause-screen').style.display = 'block';
            }
            lastClickTime = currentTime;
        }
    });
    document.getElementById('pause-button').addEventListener('click', () => {
        exitFullScreen();
        game.paused = true;
        document.getElementById('canvas').style.display = 'none';
        document.getElementById('pause-screen').style.display = 'block';
    });
    document.querySelectorAll('.list-container').forEach((list) => {
        list.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') window.open("https://www.thefreedictionary.com/" + e.target.innerHTML, "_blank");
        });
    });
    document.getElementById('resume-button').addEventListener('click', () => {
        launchFullScreen(document.documentElement);
        game.paused = false;
        document.getElementById('pause-screen').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
    });
    document.getElementById('play-again-button').addEventListener('click', () => {
        launchFullScreen(document.documentElement);
        game.reset();
    });
}

/**
 * Check if the word formed is a valid word
 * @param {Game} game
 * @param {HTMLDivElement} lastTile
 */
function checkWordValidity(game, lastTile) {
    let wordTraced = "";
    tilesTraced.forEach(tile => wordTraced += tile.innerHTML);

    // only words 3+ letters long
    if (wordTraced.length >= 3) {
        wordTraced = wordTraced.toLowerCase();
        //if word is valid
        if (game.wordList.includes(wordTraced)) {
            tilesTraced.forEach(tile => {
                tile.classList.remove('touched');
                tile.classList.add('correct');
                setTimeout(function() {
                    tile.classList.remove('correct');
                    tile.classList.remove('tile');
                    tile.classList.add('empty');
                    tile.innerHTML = '';
                }, correctnessFlashTime);
                markAboveAsFalling(game, tile);
            });
            //add word to lists in pause and game over screens
            scrollableLists.forEach(scrollableList => {
                scrollableList.style.display = 'block';
                const listContainer = scrollableList.querySelector('.list-container');
                const newWord = document.createElement('li');
                newWord.innerHTML = wordTraced;
                listContainer.appendChild(newWord);
            });
            //increase score
            const tileRect = lastTile.getBoundingClientRect();
            game.increaseScore(wordTraced, tileRect.x + tileRect.width / 2, tileRect.y + tileRect.height / 2);
            tilesTraced = [];
        }
        //if word is not valid
        else {
            tilesTraced.forEach(tile => {
                tile.classList.remove('touched');
                tile.classList.add('incorrect');
                setTimeout(function() {
                    tile.classList.remove('incorrect');  
                }, 80);
            });
            tilesTraced = [];
        }
    }
    //word is less than 3 letters
    else {
        tilesTraced.forEach(tile => {
            tile.classList.remove('touched');
        });
        tilesTraced = [];
    }
}
