<script lang="ts">
    import type { KeyboardEngine } from '$lib/engine/keyboardEngine.svelte';
    import type { AudioEngine } from '$lib/audio/audioEngine.svelte';
    import { visualStates } from '$lib/visual/menu.svelte';
  
    let { keyId, engine, audio }: {
        keyId: string; engine: KeyboardEngine; audio: AudioEngine;
    } = $props();
  
    // THIS IS ONLY FOR TOUCH!!! 
    function down(e: PointerEvent) {
        e.preventDefault();
        const midi = engine.noteDown(keyId);
        if (midi !== null) audio.play(midi);
        // VISUAL CHANGES: TO INTERACT WITH KEYBOARD ENGINE
    }
    function up(e: PointerEvent) {
        e.preventDefault();
        const midi = engine.noteUp(keyId);
        if (midi !== null) audio.release(midi);
        // VISUAL CHANGES: TO INTERACT WITH KEYBOARD ENGINE 
    }

    let visuals = $derived(visualStates);

    // TO DO A TRANSITION FOR NON SUSTAIN:
    // 1. FLIP
    // 2. UNFLIP

    // TO DO A TRANSITION FOR SUSTAIN:
    // 1. SHRINK & FLIP
    // 2. HOLD
    // 3. UNFLIP & EXPAND

</script>
  
<button 
    // role="button"
    class="keyboard-key ..."
    class:key-active={engine.pressedKeys.has(keyId)}
    style:transition={engine.getSAWR ? "none" : "0.3s ease-out"}
    onpointerdown={down}
    onpointerup={up}
>
  {keyId.toUpperCase()}
</button>

<style>
    .keyboard-key {
        outline: red solid 1px;
        width: 6rem;
        aspect-ratio: 1 / 1 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box; /* so padding/border dont add to width/height */
    }

    .key-active {
        background-color: teal;
        transition: none !important; /* the important here overrides the base transition when it applied */
    }
</style>

