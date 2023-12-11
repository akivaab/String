const /** @type {HTMLCanvasElement} */ canvas = document.getElementById('canvas');
const /** @type {CanvasRenderingContext2D} */ ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export class CanvasOverlay {
    constructor() {
        /** @type {ScoreText[]} */ this.scoreTexts = [];
    }
    update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.scoreTexts.forEach(scoreText => {
            ctx.font = '2.2vh Playpen Sans';
            ctx.fillStyle = `rgba(0, 0, 0, ${scoreText.opacity})`;
            ctx.fillText(scoreText.topText, scoreText.x, scoreText.y);
            ctx.font = '1.6vh Playpen Sans';
            ctx.fillText(scoreText.bottomText, scoreText.x, scoreText.y + canvas.height / 50);
            scoreText.update();
        });
        this.scoreTexts = this.scoreTexts.filter(scoreText => !scoreText.markedForDeletion);
    }
    addScoreText(x, y, score, letters) {
        this.scoreTexts.push(new ScoreText(x, y, score, letters));
    }
}

class ScoreText {
    constructor(x, y, score, letters) {
        this.x = x;
        this.y = y;
        this.opacity = 1.0;
        this.topText = "+" + score;
        this.bottomText = "";
        if (letters.length > 0) {
            letters.forEach(letter => {
                this.bottomText += letter + ",";
            })
            this.bottomText = this.bottomText.substring(0, this.bottomText.length - 1);
            this.bottomText += "-bonus!";
        }
        this.timer = 0;
        this.markedForDeletion = false;
    }
    update() {
        this.y -= 0.3125;
        this.opacity -= 0.0125;
        this.timer++;
        if (this.timer > 80) this.markedForDeletion = true;
    }
}
