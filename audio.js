export class AudioPlayer {
    /**
     * @constructor
     */
    constructor() {
        /** @type {HTMLAudioElement} */ this.music60 = document.getElementById('music60');
        /** @type {HTMLAudioElement} */ this.music80 = document.getElementById('music80');
        this.music60.volume = 0.4;
        this.music80.volume = 0.4;
        this.music60Section = 84;
        this.music60Total = 840;
        this.music80Section = 63;
        this.music80Total = 630;
        this.currentMusic = this.music60;
    }
    /**
     * Mute/unmute the background music
     */
    toggleMute() {
        this.music60.muted = !this.music60.muted;
        this.music80.muted = !this.music80.muted;
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
        if (this.currentMusic === this.music60 && this.music60.currentTime >= this.music60Total) {
            this.music60.currentTime = 0;
        }
        else if (this.currentMusic === this.music80 && this.music80.currentTime >= this.music80Total) {
            this.music80.currentTime = 0;
        }
    }
    /**
     * Change the background music from the slower version to the faster one
     */
    speedUpAudio() {
        if (this.currentMusic === this.music60) {
            this.currentMusic = this.music80;
            this.switchFromTo(this.music60, this.music80, 0.75, this.music80Section);
        }
    }
    /**
     * Change the background music from the faster version to the slower one
     */
    slowDownAudio() {
        if (this.currentMusic === this.music80) {
            this.currentMusic = this.music60;
            this.switchFromTo(this.music80, this.music60, 4 / 3, this.music60Section);
        }
    }
    /**
     * Switch between two identical music tracks of different tempo seamlessly
     * @param {HTMLAudioElement} curMusic
     * @param {HTMLAudioElement} newMusic
     * @param {number} beatRatio the bpm of the current music divided by the bpm of the new music
     * @param {number} newMusicSection the length of a section of music before it loops
     */
    switchFromTo(curMusic, newMusic, beatRatio, newMusicSection) {
        let curTime = curMusic.currentTime;
        curMusic.pause();
        curMusic.currentTime = 0;
        let newTime = curTime * beatRatio;
        while (newTime >= newMusicSection) {
            newTime -= newMusicSection;
        }
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
                this.currentMusic = this.music60;
                this.currentMusic.currentTime = 0;
                this.music60.volume = 0.4;
                this.music80.volume = 0.4;
            }
        }, 200);
    }
}
