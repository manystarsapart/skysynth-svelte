import { log } from "$lib/utils/logging";
import { pressedKeys, resolveKeydownMIDI, keyStates } from "./keyboardEngine.svelte";
import { leftKeyboardKeys, pitchMap, rightKeyboardKeys } from "./maps"
import { resolveTrOC, transposeToKey } from "./tranoctv";

// ====================================================
// KEY CONFIGS
// ====================================================

export const excludedKeys = new Set<string>(["control", "r"]);
const modifierKeys = new Set([" ", "enter"]);
const tempModifierKeys = new Set(["alt", "shift"]);
const menuKeys = new Set(["escape", "backspace", "tab", "delete", "\\"]);
const trocKeys = new Set(["arrowup", "arrowdown", "arrowleft", "arrowright", "[", "]"]); // troc = transpose & octave

// ====================================================
// KEY DOWN/UP HANDLERS (used in $lib/components/keyboard/KeyCap.svelte)
// ====================================================

export function handleKeydown(e: KeyboardEvent) {
    let k = e.key.toLowerCase();
    // console.log(e.location);
    if (!excludedKeys.has(e.key)) e.preventDefault();
    if (pressedKeys.has(k)) {
        // repeated call. happens when holding note
        return;
    } else {
        pressedKeys.add(k);
    }
    switch (classifyKey(k, true)) { 
        case "excl":
            break;
        case "note":
            // note
            resolveKeydownMIDI(k);
            break;
        case "modi":
            // space & enter
            // technically no action really needs to be done here..
            break;
        case "tmod":
            // modifier key
            let location = e.location; // 1 is L, 2 is R
            pressedKeys.delete(k);
            pressedKeys.add(`${k}${(location == 1) ? "L" : "R"}`);
            break;
        case "tran":
            // transpose key
            transposeToKey(pitchMap[k]);
            break;
        case "troc":
            // +1 / -1 transpose & octave key
            resolveTrOC(k);
            break;
        case "menu":
            // menu key
            // TODO
            // TODO
            // TODO
            break;
    } 
    // console.log(pressedKeys);
}

export function handleKeyup(e: KeyboardEvent) {
    let k = e.key.toLowerCase(); // PREVENTS "W" and "w" from both being in the keypress set, for example  
    e.preventDefault(); // is this even needed?
    if (classifyKey(k, false) === "tmod") {
        pressedKeys.delete(`${k}${e.location == 1 ? "L" : "R"}`)
    } else {
        pressedKeys.delete(k);
    }
    // console.log(pressedKeys);

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

    log(`keypress: ${k} --> ${keyType} (${isKeyDown ? "down" : "up"})`);
    return keyType;
}