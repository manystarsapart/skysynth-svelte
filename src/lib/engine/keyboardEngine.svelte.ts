// ====================================================
// STATES
// ====================================================

import { log } from "$lib/utils/logging";
import { SvelteSet } from "svelte/reactivity";
import { keyboardMode0, keyboardMode1, keyboardMode2, leftKeyboardKeys, maps, rightKeyboardKeys, type KeyboardModeType } from "./maps";
import { toggleSettingsOpen } from "$lib/visual/menu.svelte";
import { DEFAULT_KEYBOARD, type KeyboardSettings } from "$lib/settings/schema";
import { browser } from "$app/environment";
import { debounce, loadFromStorage, saveToStorage } from "$lib/settings/storage";

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
        sawrEnabled: false, // stop audio when released
        sawrDelay: 50,
    });

    const pressedKeys = new SvelteSet<string>(); // includes ALL keys
    const heldNotes = new Map<string, number>(); // NOTES only. for audio attack/release

    // ========================
    // KEYBOARD MODE 
    // ========================
    
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
        let finalTr: number;
        let nTr = state.transposeValue + count; // new Transpose
        let nOc = state.octave + Math.floor(nTr / 12); // new Octave
        if (nOc > 3) {nOc = 3; finalTr = 12} // EXCEED
        else if (nOc >= -2) {finalTr = (nTr >= 0) ? nTr % 12 : nTr + 12} // NORMAL
        else {nOc = -2; finalTr = 0} // BELOW

        state.transposeValue = finalTr;
        state.octave = nOc;

        // state.transposeValue = clamp(state.transposeValue + count, 0, 12);
        log(`[KEYBOARD] Transposed to ${state.transposeValue} on octave ${state.octave}.`);
    }

    function transposeTo(target: number) {
        state.transposeValue = clamp(target, 0, 12);
        log(`[KEYBOARD] Transposed to ${state.transposeValue}`);
    }

    function octaveBy(count: number) {
        state.octave = clamp(state.octave + count, -2, 3);
        log(`[KEYBOARD] Octaved to ${state.octave}`);
    }

    function octaveTo(target: number) {
        state.octave = clamp(target, -2, 3);
        log(`[KEYBOARD] Octaved to ${state.octave}`);
    }

    function toggleSAWR(target?: boolean) {
        state.sawrEnabled = (target !== undefined) ? target : !state.sawrEnabled; 
    }
    function setSAWRDelay(target: number) {
        // state.sawrDelay = clamp(target, 0, 100);
        state.sawrDelay = target;
        log(`[KEYBOARD] Set SAWR delay to ${state.sawrDelay}`);
    }

    function applyRecommendedSAWR(sustain: boolean, delayMs: number) {
        state.sawrEnabled = sustain;
        state.sawrDelay = delayMs;
        log(`[KEYBOARD] Applied instrument-recommended SAWR: enabled=${sustain}, delay=${delayMs}ms`);
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

    function resolveMenu(k: string) {
        switch (k) {
            case "\\": // toggle SAWR
                toggleSAWR();
                break;
            // TODO THE REST
            case "escape": // toggle settings panel
                toggleSettingsOpen();
                break;
            case "tab":
                // TODO: SWAP TO THE LAST-ACTIVATED INSTRUMENT WITH PREVIOUS SETTINGS.
                // "INSTRUMENT FLIP"
                // NEED TO CACHE A COPY OF THE PREVIOUS INSTRUMENT'S SETTINGS?
        }
    }

    // ========================
    // RESET
    // ========================

    function reset() {
        state.transposeValue = 0;
        state.octave = 0;
        state.currentKeyboardMode = 0;
        state.sawrEnabled = false;
        state.sawrDelay = 0;
        pressedKeys.clear();
        heldNotes.clear();
    }

    function resetKeys() {
        pressedKeys.clear();
        heldNotes.clear();
    }

    // ========================
    // SETTINGS
    // ========================


    function getSettingsSnapshot(): KeyboardSettings {
        return {
            transposeValue: state.transposeValue,
            octave: state.octave,
            currentKeyboardMode: state.currentKeyboardMode,
            sawrEnabled: state.sawrEnabled,
            sawrDelay: state.sawrDelay,
        };
    }

    function applySettings(s: Partial<KeyboardSettings>) {
        if (s.transposeValue !== undefined) state.transposeValue = s.transposeValue;
        if (s.octave !== undefined) state.octave = s.octave;
        if (s.currentKeyboardMode !== undefined) state.currentKeyboardMode = s.currentKeyboardMode;
        if (s.sawrEnabled !== undefined) state.sawrEnabled = s.sawrEnabled;
        if (s.sawrDelay !== undefined) state.sawrDelay = s.sawrDelay;
    }
    
    function resetToDefaults() {
        applySettings(DEFAULT_KEYBOARD);
    }
    
    if (browser) {
        const saved = loadFromStorage<KeyboardSettings>('keyboard');
        if (saved) applySettings(saved);
    
        const persist = debounce(() => saveToStorage('keyboard', getSettingsSnapshot()), 300);
        $effect.root(() => {
            $effect(() => {
                void [state.transposeValue, state.octave, state.currentKeyboardMode, state.sawrEnabled, state.sawrDelay];
                persist();
            });
        });
    }

    // ========================
    // EXPOSING EVERYTHING
    // ========================

    log(`[KEYBOARD] Keyboard engine created.`);

    return {
        get currentKeyboardMode() { return state.currentKeyboardMode; },
        get transposeValue() { return state.transposeValue; },
        get octave() { return state.octave; },
        get getSAWR() { return state.sawrEnabled; },
        get sawrDelay() { return state.sawrDelay; },
        get pressedKeys(): ReadonlySet<string> { return pressedKeys; }, // UI indicator later......
        isDown, markDown, markUp,
        noteDown, noteUp,
        resolveTrOC, resolveMenu, resolveMod,
        transposeBy, transposeTo,
        octaveBy, octaveTo,
        toggleSAWR, setSAWRDelay, applyRecommendedSAWR,
        setKeyboardMode,
        reset, resetKeys,
        getSettingsSnapshot, applySettings, resetToDefaults,
        activeMap,
    }
}

export type KeyboardEngine = ReturnType<typeof createKeyboardEngine>;


// FOR VISUAL INDICATOR:

// <!-- shift-L-indicator -->
// <script>
// let shiftHeld = $derived(engine.pressedKeys.has('shiftL');
// </script>
