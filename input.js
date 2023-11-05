import { Game } from "./script.js";
import { isAdjacent, markAboveAsFalling } from "./tile.js";

let isMousePressed = false;
let isTouchPressed = false;
let lastTilePressed = null;
let tilesTraced = [];

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
    game.grid.addEventListener('mouseleave', () => {
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
}

function checkWordValidity(game) {
    let wordTraced = "";
    tilesTraced.forEach(tile => wordTraced += tile.innerHTML);

    // only words 3+ letters long
    if (wordTraced.length >= 3) {
        wordTraced = wordTraced.toLowerCase();
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordTraced}`)
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error('Not a word.');
            })
            .then(data => {
                if (data[0].meanings) {
                    tilesTraced.forEach(tile => {
                        tile.classList.remove('touched');
                        tile.classList.add('correct');
                        setTimeout(function() {
                            tile.classList.remove('correct');
                            tile.classList.remove('tile');
                            tile.classList.add('empty');
                            tile.innerHTML = '';
                        }, 80);
                        markAboveAsFalling(game, tile);
                    });
                    tilesTraced = [];
                }
            })
            .catch(error => {
                console.error(error);
                tilesTraced.forEach(tile => {
                    tile.classList.remove('touched');
                    tile.classList.add('incorrect');
                    setTimeout(function() {
                        tile.classList.remove('incorrect');  
                    }, 80);
                });
                tilesTraced = [];
            });
    }
    else {
        tilesTraced.forEach(tile => {
            tile.classList.remove('touched');
        });
        tilesTraced = [];
    }
}
