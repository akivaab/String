const /** @type {HTMLAudioElement} */ music60_1 = document.getElementById('music60-1');
const /** @type {HTMLAudioElement} */ music60_2 = document.getElementById('music60-2');
const /** @type {HTMLAudioElement} */ music80_1 = document.getElementById('music80-1');
const /** @type {HTMLAudioElement} */ music80_2 = document.getElementById('music80-2');

export function toggleMute() {
    music60_1.muted = !music60_1.muted;
    music60_2.muted = !music60_2.muted;
    music80_1.muted = !music80_1.muted;
    music80_2.muted = !music80_2.muted;
}

export function playAudio() {
    music60_1.play();
}

export function loopAudioCheck() {
    if (music60_1.currentTime >= 60) music60_2.play();
    else if (music60_2.currentTime >= 60) music60_1.play();
    else if (music80_1.currentTime >= 45) music80_2.play();
    else if (music80_2.currentTime >= 45) music80_1.play();
}

export function speedUpAudio() {
    if (!music60_1.paused) {
        switchFromTo(music60_1, music80_1, 0.75);
    }
    else if (!music60_2.paused) {
        switchFromTo(music60_2, music80_2, 0.75);
        console.log(music60_2.paused);
        console.log(!music80_2.paused);
    }
}

export function slowDownAudio() {
    if (!music80_1.paused) {
        switchFromTo(music80_1, music60_1, 4 / 3)
    }
    else if (!music80_2.paused) {
        switchFromTo(music80_2, music60_2, 4 / 3)
    }
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
