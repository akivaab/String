import { Game } from "./script.js";
import { isAdjacent, markAboveAsFalling } from "./tile.js";

let isMousePressed = false;
let isTouchPressed = false;
let lastTilePressed = null;
let tilesTraced = [];
const correctnessFlashTime = 79;
const scrollableLists = document.querySelectorAll('.scrollable-list');
let lastClickTime = 0;

function handleMouseMove(event) {
    if (isMousePressed) {
        const target = event.target;
        if (target.classList.contains('tile') && !target.classList.contains('falling') && 
            isAdjacent(target, lastTilePressed) && !tilesTraced.includes(target)) 
        {
            target.classList.add('touched');
            lastTilePressed = target;
            tilesTraced.push(target);
        }
    }
}

function handleTouchMove(event) {
    if (isTouchPressed) {
        const target = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        if (target && target.classList.contains('tile') && !target.classList.contains('falling')
            && isAdjacent(target, lastTilePressed) && !tilesTraced.includes(target))
        {
            const tileRect = target.getBoundingClientRect();
            const centerX = tileRect.left + tileRect.width / 2;
            const centerY = tileRect.top + tileRect.height / 2;
            if (Math.abs(event.touches[0].clientX - centerX) < tileRect.width / 3 &&
                Math.abs(event.touches[0].clientY - centerY) < tileRect.height / 3)
            {
                target.classList.add('touched');
                lastTilePressed = target;
                tilesTraced.push(target);
            }
        }
    }
}

/**
 * @param {Game} game 
 */
export default function setupInputHandler(game) {
    game.grid.addEventListener('mousedown', () => {
        isMousePressed = true;
    });
    document.addEventListener('mouseup', () => {
        isMousePressed = false;
        lastTilePressed = null;
        checkWordValidity(game);
    });
    game.grid.addEventListener('mouseleave', () => {  //NOTE: erase maybe?
        isMousePressed = false;
        lastTilePressed = null;
        checkWordValidity(game);
    });
    game.grid.addEventListener('mousemove', handleMouseMove);

    game.grid.addEventListener('touchstart', () => {
        isTouchPressed = true;
    });
    document.addEventListener('touchend', () => {
        isTouchPressed = false;
        lastTilePressed = null;
        checkWordValidity(game);
    });
    game.grid.addEventListener('touchmove', handleTouchMove);

    document.getElementById('start-button').addEventListener('click', () => {
        game.onStart = false;
        document.getElementById('start-screen').style.display = 'none';
    });
    game.grid.addEventListener('click', () => {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastClickTime;
        if (timeDifference < 250) {
            game.paused = true;
            document.getElementById('pause-screen').style.display = 'block';
        }
        lastClickTime = currentTime;
    });
    document.getElementById('resume-button').addEventListener('click', () => {
        game.paused = false;
        document.getElementById('pause-screen').style.display = 'none';
    });
    document.getElementById('play-again-button').addEventListener('click', () => {
        game.reset();
    });
}

/**
 * 
 * @param {Game} game 
 */
function checkWordValidity(game) {
    let wordTraced = "";
    tilesTraced.forEach(tile => wordTraced += tile.innerHTML);

    // only words 3+ letters long
    if (wordTraced.length >= 3) {
        wordTraced = wordTraced.toLowerCase();

        console.log(game.wordList);
        
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
            scrollableLists.forEach(scrollableList => {
                scrollableList.style.display = 'block';
                const listContainer = scrollableList.querySelector('.list-container');
                const newWord = document.createElement('li');
                newWord.innerHTML = wordTraced;
                listContainer.appendChild(newWord);
            });
            game.increaseScore(wordTraced.length);
            tilesTraced = [];
        }
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
    else {
        tilesTraced.forEach(tile => {
            tile.classList.remove('touched');
        });
        tilesTraced = [];
    }
}
