// ====================================================
// STATES
// ====================================================

import { log } from "$lib/utils/logging";
import { leftKeyboardKeys, rightKeyboardKeys } from "./maps";

export const skyStates = $state({
    // VERSIONING
    skysynthVersion: "0.20.6",
    skysynthLastUpdateDate: "2026-09-03",
    skysynthSheetVersion: "1.2",
    skysynthVersionOnLastVisit: null,
    // not ported from vanilla: cosmetic changes

    
})

export const keyStates = $state({
    transposeValue: 0,
    octave: 0,
    stopAudioWhenReleased: false
})

// let shiftPressed: boolean = $state(false);
// let leftAltPressed: boolean = $state(false);
// let rightAltPressed: boolean = $state(false);

let currentKeyboardMode: number = $state(0); // +12 default

export const pressedKeys = new Set<string>();
// TO STORE ALL PRESENTLY PRESSED KEYS

// ====================================================
// KEYBOARD ENGINE
// ====================================================

export function createKeyboardEngine() {

}

// ====================================================
// GET MIDI MODIFIER
// ====================================================

export function resolveKeydownMIDI(k: string) {
    // INPUT IS SANITISED (MUST BE A NOTE KEY)
    
    // THIS ONLY ADDS TO THE ROOT PITCH. 
    // THE ACTUAL ROOT PITCH IS NOT INCLUDED IN THIS FINAL OUTPUT!!!

    let modifier = 0;

    // perm modifiers
    modifier += keyStates.transposeValue; // tran
    modifier += (keyStates.octave * 12); // octv

    // temp modifiers
    if (pressedKeys.has(" ")) modifier += 12; // space --> global +12
    if (pressedKeys.has("enter")) modifier += 1; // enter --> global +1
    if (pressedKeys.has("shiftR")) modifier -= 12; // shiftR --> global -12

    // one-sided temp modifiers
    if (leftKeyboardKeys.has(k)) {
        if (pressedKeys.has("altL")) modifier += 1; // altL --> left KB +1
        if (pressedKeys.has("shiftL")) modifier -= 12; // shiftL --> left KB -12
    } else if (rightKeyboardKeys.has(k)) {
        if (pressedKeys.has("altR")) modifier += 1; // altR --> right KB +1
    } else {
        // this shouldnt happen...
        alert("error! contact dev");
    }
    
    log(`modifier: ${String(modifier)}`);
    return modifier;
}