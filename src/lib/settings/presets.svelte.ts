import { browser } from '$app/environment';
import type { AudioEngine } from '$lib/audio/audioEngine.svelte';
import type { KeyboardEngine } from '$lib/engine/keyboardEngine.svelte';
import { log } from '$lib/utils/logging';
import { applySettingsFile } from './apply';
import type { SkySettingsFile } from './schema';
import { loadFromStorage, saveToStorage } from './storage';

export const PRESET_COUNT = 9;

export const presetState = $state({
    slots: Array.from({ length: PRESET_COUNT }, (_, i) => ({
        index: i + 1, file: null as SkySettingsFile | null, label: '' as string,        
    })),
});

if (browser) {
    const saved = loadFromStorage<{ slots: typeof presetState.slots }>('presets');
    saved?.slots?.forEach((s, i) => { if (presetState.slots[i]) presetState.slots[i] = s; });
}

function persist() {
    if (browser) saveToStorage('presets', { slots: $state.snapshot(presetState.slots) });
}

export function assignPreset(index: number, file: SkySettingsFile, label = '') {
    const slot = presetState.slots.find(s => s.index === index);
    if (slot) { slot.file = file; slot.label = label; persist(); }
}

export function clearPreset(index: number) {
    const slot = presetState.slots.find(s => s.index === index);
    if (slot) { slot.file = null; slot.label = ''; persist(); }
}

export function getPreset(index: number) {
    return presetState.slots.find(s => s.index === index)?.file ?? null;
}

export function renamePreset(index: number, label: string) {
    const slot = presetState.slots.find(s => s.index === index);
    if (slot) { slot.label = label; persist(); }
}

const presetKeyToSlot: Record<string, number> = {
    '1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9, // leave `,0,-,= free/unmapped for now
  };
  
export async function loadPresetForKey(k: string, engine: KeyboardEngine, audio: AudioEngine) {
    const slot = presetKeyToSlot[k];
    if (slot === undefined) return;
    const file = getPreset(slot);
    if (!file) { log(`[PRESET] slot ${slot} is empty`); return; }
    await applySettingsFile(file, engine, audio);
    log(`[PRESET] loaded slot ${slot}`);
}