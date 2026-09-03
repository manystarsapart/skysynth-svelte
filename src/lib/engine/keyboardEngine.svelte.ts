// ====================================================
// STATES
// ====================================================

import { log } from "$lib/utils/logging";
import { SvelteSet } from "svelte/reactivity";
import { keyboardMode0, keyboardMode1, keyboardMode2, leftKeyboardKeys, rightKeyboardKeys, type KeyboardModeType } from "./maps";

export const skyStates = $state({
    // VERSIONING
    skysynthVersion: "0.20.6",
    skysynthLastUpdateDate: "2026-09-03",
    skysynthSheetVersion: "1.2",
    skysynthVersionOnLastVisit: null as string | null,
    // not ported from vanilla: cosmetic changes

    
})


// ====================================================
// KEYBOARD ENGINE
// ====================================================

export function createKeyboardEngine() {

    // ========================
    // STATE & SETS
    // ========================
    const state = $state({
        transposeValue: 0,
        octave: 0,
        currentKeyboardMode: 0,
    });

    const pressedKeys = new SvelteSet<string>(); // includes ALL keys
    const heldNotes = new Map<string, number>(); // NOTES only. for audio attack/release

    // ========================
    // KEYBOARD MODE 
    // ========================
    const maps: KeyboardModeType[] = [keyboardMode0, keyboardMode1, keyboardMode2];
    const activeMap = () => maps[state.currentKeyboardMode];

    function setKeyboardMode(mode: number) {
        if (mode < 0 || mode > 2) return; // catch err
        state.currentKeyboardMode = mode;
      }

    // ========================
    // HELPERS FOR SETS
    // ========================

    function isDown(k: string) { return pressedKeys.has(k) };
    function markDown(k: string) { pressedKeys.add(k) };
    function markUp(k: string) { pressedKeys.delete(k) };

    // ========================
    // GET MIDI
    // ========================

    function noteDown(k: string): number | null {
        if (heldNotes.has(k)) return null; // ALREADY HELD
        const base = activeMap()[k];
        if (base === undefined) return null; // catch err
        const midi = (
            base + state.transposeValue + state.octave * 12 + resolveMod(k)
        )

        heldNotes.set(k, midi);
        markDown(k);
        return midi
    }

    function noteUp(k: string): number | null {
        const midi = heldNotes.get(k);
        if (midi === undefined) return null; // catch
        
        heldNotes.delete(k);
        markUp(k);
        return midi;
    }

    // ========================
    // TEMP MODIFIERS
    // ========================
    
    function resolveMod(k: string): number {
        let mod = 0;
        
        if (pressedKeys.has(' ')) mod += 12;        // space  --> global +12
        if (pressedKeys.has('enter')) mod += 1;     // enter  --> global +1
        if (pressedKeys.has('shiftR')) mod -= 12;   // shiftR --> global -12
      
        if (leftKeyboardKeys.has(k)) {
          if (pressedKeys.has('altL')) mod += 1;      // altL   --> left-side +1
          if (pressedKeys.has('shiftL')) mod -= 12;   // shiftL --> left-side -12
        } else if (rightKeyboardKeys.has(k)) {
          if (pressedKeys.has('altR')) mod += 1;      // altR   --> right-side +1
        }

        return mod;
    }

    // ========================
    // TRANSPOSE & OCTAVE (PERM)
    // ========================

    function clamp(n: number, lo: number, hi: number) {
        return Math.min(hi, Math.max(lo, n));
    }
      
    function transposeBy(count: number) {
        // TODO: IMPORT LOGIC FOR CARRYING INTO OCTAVE PAST 0 OR 12
        state.transposeValue = clamp(state.transposeValue + count, 0, 12);
        log(`Transposed to ${state.transposeValue}`);
    }

    function transposeTo(target: number) {
        state.transposeValue = clamp(target, 0, 12);
        log(`Transposed to ${state.transposeValue}`);
    }

    function octaveBy(count: number) {
        state.octave = clamp(state.octave + count, -2, 3);
        log(`Octaved to ${state.octave}`);
    }

    function octaveTo(target: number) {
        state.octave = clamp(target, -2, 3);
        log(`Octaved to ${state.octave}`);
    }

    function resolveTrOC(k: string) {
        switch (k) {
            case "[":
                transposeBy(-1) // perm -1
                break;
            case "]":
                transposeBy(+1); // perm +1
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

    // ========================
    // RESET
    // ========================

    function reset() {
        state.transposeValue = 0;
        state.octave = 0;
        state.currentKeyboardMode = 0;
        pressedKeys.clear();
        heldNotes.clear();
    }

    // ========================
    // EXPOSING EVERYTHING
    // ========================

    return {
        get currentKeyboardMode() { return state.currentKeyboardMode; },
        get transposeValue() { return state.transposeValue; },
        get octave() { return state.octave; },
        get pressedKeys(): ReadonlySet<string> { return pressedKeys; }, // UI indicator later......
        isDown, markDown, markUp,
        noteDown, noteUp,
        resolveTrOC,
        transposeBy, transposeTo,
        octaveBy, octaveTo,
        setKeyboardMode,
        reset,

    }
}

export type KeyboardEngine = ReturnType<typeof createKeyboardEngine>;


// FOR VISUAL INDICATOR:

// <!-- shift-L-indicator -->
// <script>
// let shiftHeld = $derived(engine.pressedKeys.has('shiftL');
// </script>
