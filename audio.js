const /** @type {HTMLAudioElement} */ music60 = document.getElementById('music60');
const /** @type {HTMLAudioElement} */ music80 = document.getElementById('music80');
let currentMusic = music60;

export function toggleMute() {
    music60.muted = !music60.muted;
    music80.muted = !music80.muted;
}

export function playAudio() {
    music60.play();
}

export function loopAudioCheck() {
    if (music60.currentTime >= 60) music60.currentTime = 0;
    else if (music80.currentTime >= 45) music80.currentTime = 0;
}

export function speedUpAudio() {
    if (currentMusic == music60) switchFromTo(music60, music80, 0.75);
}

export function slowDownAudio() {
    if (currentMusic == music80) switchFromTo(music80, music60, 4 / 3);
}

function switchFromTo(curMusic, newMusic, beatRatio) {
    let time = curMusic.currentTime;
    console.log(curMusic, time);
    curMusic.pause();
    console.log(curMusic.paused);
    curMusic.currentTime = 0;
    newMusic.currentTime = time * beatRatio;
    console.log(newMusic, newMusic.currentTime);
    newMusic.play();
    console.log(!newMusic.paused);
}
