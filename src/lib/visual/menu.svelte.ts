import { browser } from "$app/env";
import { DEFAULT_VISUAL, type VisualSettings } from "$lib/settings/schema";
import { debounce, loadFromStorage, saveToStorage } from "$lib/settings/storage";

export const visualStates = $state({
    charSpriteSizePercent: 100,
    notesSizePercent: 100,
    noteSpacingV: 1, // default: 1rem
    noteSpacingH: 1, // default: 1rem
    keyboardPosition: 5, // default: 5rem
    reducedAnimations: false,
    settingsOpen: false,
    showDetailedNoteNames: false,
})

export function toggleSettingsOpen() {
    visualStates.settingsOpen = !visualStates.settingsOpen;
}


if (browser) {
    const saved = loadFromStorage<VisualSettings>('visual');
    if (saved) Object.assign(visualStates, saved);

    const persist = debounce(() => saveToStorage('visual', { ...visualStates }), 300);
    $effect.root(() => {
        $effect(() => {
            // NOTE: touching every field registers this effect as their dependent
            void [
                visualStates.charSpriteSizePercent, visualStates.notesSizePercent,
                visualStates.noteSpacingV, visualStates.noteSpacingH,
                visualStates.keyboardPosition, visualStates.reducedAnimations
            ];
            persist();
        });
    });
}


export function resetVisualDefaults() {
    Object.assign(visualStates, DEFAULT_VISUAL);
}