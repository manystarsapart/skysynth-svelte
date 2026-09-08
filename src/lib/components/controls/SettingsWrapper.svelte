<script lang="ts">
import { fly } from "svelte/transition";
import SettingsPanel from "./SettingsPanel.svelte";
import type { AudioEngine } from "$lib/audio/audioEngine.svelte";
import type { KeyboardEngine } from "$lib/engine/keyboardEngine.svelte";
  import { visualStates } from "$lib/visual/menu.svelte";

let { engine, audio }: {
    engine: KeyboardEngine;
    audio: AudioEngine;
} = $props();

// let visual = $derived(visualStates);
let open = $derived(visualStates.settingsOpen);

</script>

<button
    type="button"
    onclick={() => visualStates.settingsOpen = !open}
    aria-label="Open settings"
    class="fixed top-4 right-4 z-40 h-11 w-11 rounded-full bg-gray-800/80 backdrop-blur
           flex items-center justify-center md:top-6 md:right-6"
>⚙</button>

{#if open}
<div
    class="fixed z-50 bg-gray-900 text-gray-100 overflow-y-auto
           right-0 top-0 bottom-0 w-[55vw] min-w-70 max-w-105
           rounded-l-2xl
           pb-[env(safe-area-inset-bottom)]
           md:right-0 md:top-0 md:bottom-0 md:h-full md:w-96
           md:max-w-none md:min-w-0 md:rounded-t-none md:rounded-l-2xl"
    transition:fly={{ x: 300, duration: 200 }}
>
    <!-- drag handle, mobile only -->
    <div class="md:hidden flex justify-center py-2">
        <div class="h-1.5 w-10 rounded-full bg-gray-600"></div>
    </div>

    <div class="settings-scroll overflow-y-auto px-5 pb-6 space-y-6">
        <SettingsPanel {engine} {audio} />
    </div>
</div>
{/if}