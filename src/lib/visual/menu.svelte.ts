import { browser } from "$app/environment";
import { DEFAULT_VISUAL, type VisualSettings } from "$lib/settings/schema";
import { debounce, loadFromStorage, saveToStorage } from "$lib/settings/storage";

export const visualStates = $state({
    // EXPORTED AS SETTING
    charSpriteSizePercent: 30,
    notesSizePercent: 100,
    noteSpacingV: 1, // default: 1rem
    noteSpacingH: 1, // default: 1rem
    keyboardPosition: 5, // default: 5rem
    reducedAnimations: false,
    showDetailedNoteNames: false,

    // NOT EXPORTED AS SETTING
    settingsOpen: false,
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
                visualStates.keyboardPosition, visualStates.reducedAnimations,
                visualStates.showDetailedNoteNames,
            ];
            persist();
        });
    });
}


export function resetVisualDefaults() {
    Object.assign(visualStates, DEFAULT_VISUAL);
}

export function getVisualSettingsSnapshot(): VisualSettings {
    return {
        charSpriteSizePercent: visualStates.charSpriteSizePercent,
        notesSizePercent: visualStates.notesSizePercent,
        noteSpacingV: visualStates.noteSpacingV,
        noteSpacingH: visualStates.noteSpacingH,
        keyboardPosition: visualStates.keyboardPosition,
        reducedAnimations: visualStates.reducedAnimations,
        showDetailedNoteNames: visualStates.showDetailedNoteNames,
    };
}
    