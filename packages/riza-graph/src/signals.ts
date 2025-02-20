
import { signal } from 'riza-signal';

/**
 * Emitted on each frame update with the current frame time (seconds).
 */
export const frameTime = signal(0).is('number');

/**
 * Emitted on each frame update with the delta time since the last frame (seconds).
 */
export const frameDelta = signal(0).is('number');




let lastFrameTime = Date.now() / 1000.0;
const frameUpdater = function() {
    let now = Date.now() / 1000.0;
    frameTime.value += frameDelta.set(now - lastFrameTime, true).value;
    lastFrameTime = now;
    requestAnimationFrame(frameUpdater);
};
frameUpdater();
