import { Game } from "./script.js";

let isMousePressed = false;
let isTouchPressed = false;
const wordTraced = [];

function handleMouseMove(event) {
    if (isMousePressed) {
        const target = event.target;
        if (target.classList.contains('tile')) {
            target.classList.add('touched');
            wordTraced.push(target.innerHTML);
        }
    }
}

function handleTouchMove(event) {
    if (isTouchPressed) {
        const target = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        if (target && target.classList.contains('tile')) {
            target.classList.add('touched');
            wordTraced.push(target.innerHTML);
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
    });
    game.grid.addEventListener('mouseleave', () => {
        isMousePressed = false;
    });
    game.grid.addEventListener('mousemove', handleMouseMove);

    game.grid.addEventListener('touchstart', () => {
        isTouchPressed = true;
    });
    document.addEventListener('touchend', () => {
        isTouchPressed = false;
    });
    game.grid.addEventListener('touchmove', handleTouchMove);
}

function checkWord() {
    //if tracedWord is word, make all touched tiles empty
    //else, make touched tiles back to normal
}