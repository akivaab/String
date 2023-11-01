import { Game } from "./script.js";
import { isAdjacent } from "./tile.js";

let isMousePressed = false;
let isTouchPressed = false;
let lastTilePressed = null;
let wordTraced = [];

function handleMouseMove(event) {
    if (isMousePressed) {
        const target = event.target;
        if (target.classList.contains('tile') && !target.classList.contains('falling') && 
            isAdjacent(target, lastTilePressed)) 
        {
            target.classList.add('touched');
            lastTilePressed = target;
            wordTraced.push(target.innerHTML);
        }
    }
}

function handleTouchMove(event) {
    if (isTouchPressed) {
        const target = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        if (target && target.classList.contains('tile') && !target.classList.contains('falling')
            && isAdjacent(target, lastTilePressed)) 
        {
            const tileRect = target.getBoundingClientRect();
            const centerX = tileRect.left + tileRect.width / 2;
            const centerY = tileRect.top + tileRect.height / 2;
            if (Math.abs(event.touches[0].clientX - centerX) < tileRect.width / 3 &&
                Math.abs(event.touches[0].clientY - centerY) < tileRect.height / 3)
            {
                target.classList.add('touched');
                lastTilePressed = target;
                wordTraced.push(target.innerHTML);
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
        checkWordValidity();
    });
    game.grid.addEventListener('mouseleave', () => {
        isMousePressed = false;
        lastTilePressed = null;
        checkWordValidity();
    });
    game.grid.addEventListener('mousemove', handleMouseMove);

    game.grid.addEventListener('touchstart', () => {
        isTouchPressed = true;
    });
    document.addEventListener('touchend', () => {
        isTouchPressed = false;
        lastTilePressed = null;
        checkWordValidity();
    });
    game.grid.addEventListener('touchmove', handleTouchMove);
}

function checkWordValidity() {
    /*
    if (tracedWord is word) {
        make all touched tiles empty
    }
    else {
        make touched tiles back to normal
    }
    */
}
