import type { AudioEngine } from '$lib/audio/audioEngine.svelte';
import type { KeyboardEngine } from '$lib/engine/keyboardEngine.svelte';
import { visualStates, getVisualSettingsSnapshot } from '$lib/visual/menu.svelte';
import { SETTINGS_VERSION, type SkySettingsFile } from './schema';

export function buildSettingsFile(engine: KeyboardEngine, audio: AudioEngine): SkySettingsFile {
return {
    app: 'skysynth', type: 'settings', version: SETTINGS_VERSION,
    exportedAt: new Date().toISOString(),
    visual: getVisualSettingsSnapshot(),
    keyboard: engine.getSettingsSnapshot(),
    audio: audio.getSettingsSnapshot(),
};
}

export async function applySettingsFile(file: SkySettingsFile, engine: KeyboardEngine, audio: AudioEngine) {
    if (file.visual) Object.assign(visualStates, file.visual);
    if (file.keyboard) engine.applySettings(file.keyboard);
    if (file.audio) await audio.applySettings(file.audio); // ASYNC!!!
}

