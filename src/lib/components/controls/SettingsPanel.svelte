<script lang="ts">
import type { AudioEngine } from "$lib/audio/audioEngine.svelte";
import type { KeyboardEngine } from "$lib/engine/keyboardEngine.svelte";
import { getVisualSettingsSnapshot, resetVisualDefaults, visualStates } from "$lib/visual/menu.svelte";
import { slide } from "svelte/transition";
import LabelledSlider from "./LabelledSlider.svelte";
import ToggleSwitch from "./ToggleSwitch.svelte";
import { listAvailableInstrumentIds } from "$lib/audio/instrAssets";
import { instrRegistry } from "$lib/audio/instrRegistry";
import SegmentedControl from "./SegmentedControl.svelte";
import Stepper from "./Stepper.svelte";
import { transposeMap } from "$lib/engine/maps";
import { SETTINGS_FILE_EXT, SETTINGS_VERSION, type SkySettingsFile } from "$lib/settings/schema";
import { getFormattedDateTimeForDownload } from "$lib/utils/helpers";
import { assignPreset, clearPreset, presetState, renamePreset } from "$lib/settings/presets.svelte";
import { applySettingsFile, buildSettingsFile } from "$lib/settings/apply";
import { log } from "$lib/utils/logging";

// ========================
// INIT
// ========================

let { engine, audio }: {
    engine: KeyboardEngine;
    audio: AudioEngine;
} = $props();

// ========================
// IMPORT / EXPORT
// ========================

let fileInput: HTMLInputElement;
let pendingSlotIndex: number | null = null; 
// null = normal import
// else = target preset slot

function exportSettings() {
    const payload = buildSettingsFile(engine, audio);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skysynth-settings_${getFormattedDateTimeForDownload()}${SETTINGS_FILE_EXT}`;
    a.click();
    URL.revokeObjectURL(url);
}

function triggerImport() {
    pendingSlotIndex = null;
    fileInput.click();
}

function triggerImportToSlot(index: number) {
    pendingSlotIndex = index;
    fileInput.click();
}

async function handleImportFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    const slotIndex = pendingSlotIndex; // capture before its reset
    pendingSlotIndex = null;
    input.value = ''; // allow re-selecting the same file later

    if (!file) return;

    try {
        const text = await file.text();
        const parsed = JSON.parse(text) as Partial<SkySettingsFile>;

        if (parsed.app !== 'skysynth' || parsed.type !== 'settings') {
            alert('Not a valid SkySynth settings file.');
            return;
        }
        if (parsed.version !== undefined && parsed.version > SETTINGS_VERSION) {
            alert('This settings file was made by a newer version of SkySynth.');
            return;
        }

        if (slotIndex !== null) { // GOING INTO PRESETS
            const label = prompt('Name this preset (optional):', `Preset ${slotIndex}`) ?? '';
            assignPreset(slotIndex, parsed as SkySettingsFile, label);
        } else { // LIVE IMPORT (NOT PRESET)
            await applySettingsFile(parsed as SkySettingsFile, engine, audio);
        }
    } catch {
        alert('Could not read that file — it may be corrupted or not a settings file.');
    }
}

// null-safe wrapper
function loadSlot(file: SkySettingsFile | null) {
    if (!file) return;
    applySettingsFile(file, engine, audio);
}


function renameLabel(slot: { index: number; file: SkySettingsFile | null; label: string }) {
    const newLabel = prompt('Name this preset', slot.label) ?? slot.label;
    renamePreset(slot.index, newLabel);
    log(`[PRESET] Renamed slot ${slot.index} to ${newLabel}.`);
}

// ========================
// RESET
// ========================

function resetAll() {
    if (!confirm('Reset ALL settings (audio, keyboard, visual) to defaults? This cannot be undone.')) return;
    audio.resetToDefaults();
    engine.resetToDefaults();
    resetVisualDefaults();
}


</script>
<div class="sticky top-0 z-10 bg-gray-900/95 backdrop-blur
    border-b border-gray-800 px-5 py-3">
    <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Settings</h2>
        <div class="sticky top-0 z-10 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-5 py-3">
            <div class="flex items-center justify-between">
                <h2 class="text-base font-semibold">Settings</h2>
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        onclick={resetAll}
                        class="text-xs px-3 py-2 rounded-lg bg-gray-800 opacity-80 hover:opacity-100"
                    >Reset all</button>
                </div>
            </div>
        </div>
        <button
            type="button"
            onclick={() => visualStates.settingsOpen = false}
            class="h-11 w-11 rounded-xl bg-gray-800
                flex items-center justify-center"
            aria-label="Close settings"
        >
            ✕
        </button>
    </div>
</div>


<!-- LIVE IMPORT / EXPORT  -->
<section class="rounded-2xl bg-gray-800/40 p-4 space-y-4">
    <div class="flex items-center justify-between">
        <h3 class="text-xs uppercase tracking-wide opacity-50">IMPORT / EXPORT</h3>
    </div>

    <input
        bind:this={fileInput}
        type="file"
        accept="{SETTINGS_FILE_EXT},application/json"
        class="hidden"
        onchange={handleImportFile}
    />

    <div class="flex gap-2 px-1 pb-2 border-b border-gray-700">
        <button type="button" onclick={exportSettings}
            class="flex-1 h-10 rounded-lg bg-gray-700 text-sm">Export settings</button>
        <button type="button" onclick={triggerImport}
            class="flex-1 h-10 rounded-lg bg-gray-700 text-sm">Import settings</button>
    </div>
</section>

<!-- PRESET -->
<input
    bind:this={fileInput}
    type="file"
    accept="{SETTINGS_FILE_EXT},application/json"
    class="hidden"
    onchange={handleImportFile}
/>

<section class="rounded-2xl bg-gray-800/40 p-4 space-y-4">
    <div class="flex items-center justify-between">
        <h3 class="text-xs uppercase tracking-wide opacity-50">Presets (Alt + number)</h3>
    </div>
    <div class="grid grid-cols-3 gap-2">
        {#each presetState.slots as slot (slot.index)}
            <div class="rounded-lg bg-gray-700 p-2 flex flex-col gap-1">
                <span class="text-xs opacity-70">Alt+{slot.index}</span>
                {#if slot.file}
                    <div class="flex justify-around">
                        <span class="text-sm truncate">{slot.label || `Preset ${slot.index}`}</span>
                        <button onclick={() => renameLabel(slot)}>✎</button>
                        
                    </div>
                    
                    <div class="flex gap-1">
                        <button onclick={() => loadSlot(slot.file)}
                            class="flex-1 text-xs rounded bg-teal-600 py-1">Load</button>
                        <button onclick={() => clearPreset(slot.index)}
                            class="text-xs rounded bg-gray-600 px-2">✕</button>
                    </div>
                {:else}
                    <button onclick={() => assignPreset(slot.index, buildSettingsFile(engine, audio))}
                        class="text-xs rounded bg-gray-600 py-1">Save current</button>
                    <button onclick={() => triggerImportToSlot(slot.index)}
                        class="text-xs rounded bg-gray-600 py-1">Upload file</button>
                {/if}
            </div>
        {/each}
    </div>
</section>

<!-- AUDIO -->
<section class="rounded-2xl bg-gray-800/40 p-4 space-y-4">
    <div class="flex items-center justify-between">

        <h3 class="text-xs uppercase tracking-wide opacity-50">Audio</h3>
        <button type="button" onclick={() => audio.resetToDefaults()}
            class="text-xs px-2 py-1 rounded bg-gray-800 opacity-70">Reset</button>
    </div>

    <div>
        <span class="text-sm">Instrument</span>
        <div class="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 mt-1 touch-pan-x">
            {#each listAvailableInstrumentIds() as id}
                <button
                    type="button"
                    onclick={() => audio.loadInstrument(id)}
                    class="snap-start shrink-0 h-11 px-4 rounded-full text-sm whitespace-nowrap transition-colors
                           {audio.currentInstrumentId === id ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300'}"
                >{instrRegistry.find(instr => instr.id == id)?.displayName}</button>
            {/each}
        </div>
    </div>

    <LabelledSlider
        label="Volume"
        value={audio.volumePercent}
        min={0} max={100}
        unit="%"
        onInput={(v) => audio.setVolumePercent(v)}
    />

    <div class="flex items-center justify-between py-2">
        <span class="text-sm">Stop Audio When Released</span>
        <ToggleSwitch
            checked={engine.getSAWR}
            label="Toggle SAWR"
            onToggle={() => engine.toggleSAWR()}
        />
    </div>

    {#if engine.getSAWR}
        <div transition:slide={{ duration: 150 }}>
            <LabelledSlider
                label="Release delay"
                value={engine.sawrDelay}
                min={0} max={2000} step={10}
                unit="ms"
                onInput={(v) => engine.setSAWRDelay(v)}
            />
        </div>
    {/if}
</section>

<!-- ENGINE -->
<section class="space-y-3rounded-2xl bg-gray-800/40 p-4 space-y-4">
    <div class="flex items-center justify-between">
        <h3 class="text-xs uppercase tracking-wide opacity-50">Keyboard</h3>
        <button type="button" onclick={() => engine.resetToDefaults()}
            class="text-xs px-2 py-1 rounded bg-gray-800 opacity-70">Reset</button>
    </div>

    <div>
        <span class="text-sm">Keyboard mode</span>
        <div class="mt-1">
            <SegmentedControl
                options={[{value:0,label:'+12'},{value:1,label:'+1'},{value:2,label:'−1'}]}
                value={engine.currentKeyboardMode}
                onSelect={(v) => engine.setKeyboardMode(v)}
            />
        </div>
    </div>

    <Stepper
        label="Transpose"
        value={engine.transposeValue}
        displayValue={String(transposeMap[engine.transposeValue])}
        onDecrement={() => engine.transposeBy(-1)}
        onIncrement={() => engine.transposeBy(1)}
        disabledDown={engine.transposeValue <= 0}
        disabledUp={engine.transposeValue >= 12}
    />

    <Stepper
        label="Octave"
        value={engine.octave}
        onDecrement={() => engine.octaveBy(-1)}
        onIncrement={() => engine.octaveBy(1)}
        disabledDown={engine.octave <= -2}
        disabledUp={engine.octave >= 3}
    />
</section>

<!-- VISUAL -->
<section class="rounded-2xl bg-gray-800/40 p-4 space-y-4">
    <div class="flex items-center justify-between">
        <h3 class="text-xs uppercase tracking-wide opacity-50">Visual</h3>
        <button type="button" onclick={resetVisualDefaults}
            class="text-xs px-2 py-1 rounded bg-gray-800 opacity-70">Reset</button>
    </div>

    <LabelledSlider label="Character size [TODO]" value={visualStates.charSpriteSizePercent}
        min={10} max={100} unit="%" onInput={(v) => visualStates.charSpriteSizePercent = v} />

    <LabelledSlider label="Note size" value={visualStates.notesSizePercent}
        min={30} max={200} unit="%" onInput={(v) => visualStates.notesSizePercent = v} />

    <LabelledSlider label="Note spacing (vertical)" value={visualStates.noteSpacingV}
        min={0} max={5} step={0.1} onInput={(v) => visualStates.noteSpacingV = v} />

    <LabelledSlider label="Note spacing (horizontal)" value={visualStates.noteSpacingH}
        min={0} max={5} step={0.1} onInput={(v) => visualStates.noteSpacingH = v} />

    <LabelledSlider label="Keyboard position" value={visualStates.keyboardPosition}
        min={0} max={80} onInput={(v) => visualStates.keyboardPosition = v} />

    <div class="flex items-center justify-between py-2">
        <span class="text-sm">Reduced animations</span>
        <ToggleSwitch
            checked={visualStates.reducedAnimations}
            label="Toggle reduced animations"
            onToggle={() => visualStates.reducedAnimations = !visualStates.reducedAnimations}
        />
    </div>
</section>