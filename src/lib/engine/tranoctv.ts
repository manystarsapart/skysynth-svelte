import { log } from "$lib/utils/logging";
import { keyStates } from "./keyboardEngine.svelte";

export function setTranspose(k: number) {
    // i thought this would be more complicated. haha
    keyStates.transposeValue = k;
}

export function octaveBy(count: number){ 
    // for now: +1 / -1 
    keyStates.octave += count;
    log("Octave modified by " + count + ". New octave: " + keyStates.octave);
}

export function resolveTrOC(k: string) {
    switch (k) {
        case "[":
            setTranspose(keyStates.transposeValue - 1); // perm -1
            break;
        case "]":
            setTranspose(keyStates.transposeValue + 1); // perm +1
            break;
        case "arrowdown":
        case "arrowleft":
            octaveBy(-1); // perm -12
            break;
        case "arrowup":
        case "arrowright":
            octaveBy(1); // perm +12
            break;
    }
}
