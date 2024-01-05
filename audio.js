export class AudioPlayer {
    /**
     * @constructor
     */
    constructor() {
        /** @type {HTMLAudioElement} */ this.normalMusic = document.getElementById('normal-music');
        /** @type {HTMLAudioElement} */ this.fastMusic = document.getElementById('fast-music');
        this.normalMusic.volume = 0.4;
        this.fastMusic.volume = 0.4;
        this.normalMusicTotal = 113.258;
        this.fastMusicTotal = 75.506;
        this.currentMusic = this.normalMusic;
        /** @type {SVGElement} */ this.soundMutedDisplay = document.getElementById('volume-cross');
        /** @type {SVGElement} */ this.soundOnDisplay = document.getElementById('volume-high');
    }
    /**
     * Mute/unmute the background music
     */
    toggleMute() {
        this.normalMusic.muted = !this.normalMusic.muted;
        this.fastMusic.muted = !this.fastMusic.muted;
        if (this.soundOnDisplay.style.display == 'none') {
            this.soundMutedDisplay.style.display = 'none';
            this.soundOnDisplay.style.display = 'flex';
        }
        else {
            this.soundOnDisplay.style.display = 'none';
            this.soundMutedDisplay.style.display = 'flex';
        }
    }
    /**
     * Begin to play the background music
     */
    playAudio() {
        this.currentMusic.play();
    }
    /**
     * Check if the background music reached its end and must be looped
     */
    loopAudioCheck() {
        if (this.currentMusic === this.normalMusic && this.normalMusic.currentTime >= this.normalMusicTotal) {
            this.normalMusic.currentTime = 0;
        }
        else if (this.currentMusic === this.fastMusic && this.fastMusic.currentTime >= this.fastMusicTotal) {
            this.fastMusic.currentTime = 0;
        }
    }
    /**
     * Change the background music from the slower version to the faster one
     */
    speedUpAudio() {
        if (this.currentMusic === this.normalMusic) {
            this.currentMusic = this.fastMusic;
            this.switchFromTo(this.normalMusic, this.fastMusic, 2 / 3);
        }
    }
    /**
     * Change the background music from the faster version to the slower one
     */
    slowDownAudio() {
        if (this.currentMusic === this.fastMusic) {
            this.currentMusic = this.normalMusic;
            this.switchFromTo(this.fastMusic, this.normalMusic, 1.5);
        }
    }
    /**
     * Switch between two identical music tracks of different tempo seamlessly
     * @param {HTMLAudioElement} curMusic
     * @param {HTMLAudioElement} newMusic
     * @param {number} beatRatio the bpm of the current music divided by the bpm of the new music
     */
    switchFromTo(curMusic, newMusic, beatRatio) {
        let curTime = curMusic.currentTime;
        curMusic.pause();
        curMusic.currentTime = 0;
        let newTime = curTime * beatRatio;
        newMusic.currentTime = newTime;
        newMusic.play();
    }
    /**
     * Background music fades out and resets for next play
     */
    fadeOutAudio() {
        let fadeoutInterval = setInterval(() => {
            this.currentMusic.volume -= 0.02;
            if (this.currentMusic.volume <= 0.02) {
                clearInterval(fadeoutInterval);
                this.currentMusic.pause();
                this.currentMusic = this.normalMusic;
                this.currentMusic.currentTime = 0;
                this.normalMusic.volume = 0.4;
                this.fastMusic.volume = 0.4;
            }
        }, 200);
    }
}
