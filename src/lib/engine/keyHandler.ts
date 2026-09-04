import type { AudioEngine } from "$lib/audio/audioEngine.svelte";
import { log } from "$lib/utils/logging";
import { type KeyboardEngine } from "./keyboardEngine.svelte";
import { leftKeyboardKeys, pitchMap, rightKeyboardKeys } from "./maps"

// ====================================================
// KEY CONFIGS
// ====================================================

export const excludedKeys = new Set<string>(["control", "r"]);
const modifierKeys = new Set([" ", "enter"]);
const tempModifierKeys = new Set(["alt", "shift"]);
const menuKeys = new Set(["escape", "backspace", "tab", "delete", "\\"]);
const trocKeys = new Set(["arrowup", "arrowdown", "arrowleft", "arrowright", "[", "]"]); // troc = transpose & octave

const shiftMap: Record<string, string> = {
    ':': ';',
    '<': ',',
    '>': '.',
    '?': '/',
};

function getBaseKey(k: string): string {
    return shiftMap[k] || k;
}
// ====================================================
// KEY DOWN/UP HANDLERS (used in $lib/components/keyboard/KeyCap.svelte)
// ====================================================

export function handleKeydown(e: KeyboardEvent, engine: KeyboardEngine, audio: AudioEngine) {
    let k = getBaseKey(e.key.toLowerCase());
    // console.log(e.location);
    if (!excludedKeys.has(k)) e.preventDefault();

    const type: string = classifyKey(k, true);

    const trackedKey = (type === 'tmod') ? `${k}${e.location === 1 ? 'L' : 'R'}` : k; // CATCHES TMOD & ADDS LOC EARLY
    
    // removing repeat keys from holding
    if (engine.isDown(trackedKey)) return;   
    engine.markDown(trackedKey);

    if (type === 'note') {
        const midi = engine.noteDown(trackedKey);
        if (midi !== null) audio.play(midi); // TODO: AUDIO ENGINE
        return;
    }

    // NON-NOTE type handling
    switch (type) { 
        case "excl": break;
        case "modi":
            // space & enter
            // technically no action really needs to be done here..
            break;
        case "tran":
            // transpose key
            engine.transposeTo(pitchMap[trackedKey]);
            break;
        case "troc":
            // +1 / -1 transpose & octave key
            engine.resolveTrOC(trackedKey);
            break;
        case "menu":
            // menu key
            // TODO
            // TODO
            // TODO
            break;
    } 

    log(`[HANDLEKEYDOWN] ${trackedKey} --> [${type}] down`);
}

export function handleKeyup(e: KeyboardEvent, engine: KeyboardEngine, audio: AudioEngine) {
    let k = getBaseKey(e.key.toLowerCase()); // PREVENTS "W" and "w" from both being in the keypress set, for example  
    e.preventDefault(); // is this even needed?

    const type: string = classifyKey(k, false);

    if (type === 'note') {
        const midi = engine.noteUp(k);
        if (midi !== null) audio.release(midi);
        return;
    }

    const trackedKey = (type === 'tmod') ? `${k}${e.location === 1 ? 'L' : 'R'}` : k;
    engine.markUp(trackedKey);

    log(`[HANDLEKEYUP] ${trackedKey} --> [${type}] up`);
}

// ====================================================
// CLASSIFIER
// ====================================================

export function classifyKey(k: string, isKeyDown: boolean) {
    k = k.toLowerCase(); 
    let keyType: string = "";

    if (excludedKeys.has(k)) keyType = "excl";
    else if (modifierKeys.has(k)) keyType = "modi";
    else if (tempModifierKeys.has(k)) keyType = "tmod";
    else if (k in pitchMap) keyType = "tran";
    else if (trocKeys.has(k)) keyType = "troc";
    else if (menuKeys.has(k)) keyType = "menu";
    else if (leftKeyboardKeys.has(k) || rightKeyboardKeys.has(k)) keyType = "note";
    // else: keyType remains an empty string

    // console.log(pressedKeys);

    return keyType;
}