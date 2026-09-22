<script lang="ts">
import { browser } from "$app/environment";
import { onMount } from "svelte";

function isTouchDevice() {
    return browser && (matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0);
}

let showGate = $state(false);
let gateDismissed = $state(false);

onMount(() => {
    if (!browser) return;
        const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
        if (!touch) return; // desktop: never show

        const mq = matchMedia('(orientation: portrait)');
        const update = () => {
            if (!mq.matches) {
                showGate = false; // rotated to landscape -> auto-dismiss
            } else if (!gateDismissed) {
                showGate = true; // back in portrait and never explicitly dismissed
            }
        };
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
})

function confirmDismiss() {
    gateDismissed = true;
    showGate = false;
}

</script>

{#if showGate} 
<div class="fixed inset-0 z-999 bg-black/80 text-white flex flex-col items-center justify-center gap-4 p-6 text-center">
    <p class="text-xl">Rotate your device to landscape<br>for the best experience</p>
    <button onclick={confirmDismiss} class="px-4 py-2 rounded-lg bg-teal-600">Continue anyway</button>
</div>
{/if}