<script lang="ts">
    import type { KeyboardEngine } from '$lib/engine/keyboardEngine.svelte';
    import type { AudioEngine } from '$lib/audio/audioEngine.svelte';
    // import { visualStates } from '$lib/visual/menu.svelte';e
  import { onDestroy, onMount } from 'svelte';
  import { playNoteDownAnimation, playNoteUpAnimation, registerKeyElement, unregisterKeyElement } from '$lib/visual/keyAnimations';
  
    let { keyId, engine, audio, svgPattern }: {
        keyId: string; engine: KeyboardEngine; audio: AudioEngine; svgPattern: number;
    } = $props();
  
    let el: HTMLButtonElement;
    onMount(() => registerKeyElement(keyId, el));
    onDestroy(() => unregisterKeyElement(keyId));

    // THIS IS ONLY FOR TOUCH!!! 
    function down(e: PointerEvent) {
        e.preventDefault();
        const midi = engine.noteDown(keyId);
        if (midi === null) return;
        audio.play(midi);
        playNoteDownAnimation(keyId, engine.getSAWR);
    }
    function up(e: PointerEvent) {
        e.preventDefault();
        const midi = engine.noteUp(keyId);
        if (midi === null) return;
        audio.release(midi);
        playNoteUpAnimation(keyId, engine.getSAWR);
    }

    const svgMap: Record<number, string> = {
        // SVGS COURTESY OF SPECY (AUTHOR OF SKY MUSIC NIGHTLY)
        1: `<path d="M 31.939164,9.4384766 A 22.500162,22.500162 0 0 0 9.4384767,31.939165 22.500162,22.500162 0 0 0 31.939164,54.438477 22.500162,22.500162 0 0 0 54.438476,31.939165 22.500162,22.500162 0 0 0 31.939164,9.4384766 Z m 0,2.5303484 A 19.969496,19.969496 0 0 1 51.908129,31.939165 19.969496,19.969496 0 0 1 31.939164,51.90813 19.969496,19.969496 0 0 1 11.968824,31.939165 19.969496,19.969496 0 0 1 31.939164,11.968825 Z"></path><path d="M 30.878793,1.0626133 1.0626133,30.878793 a 1.4999541,1.4999541 89.999124 0 0 3.24e-5,2.121288 L 30.87876,62.814372 a 1.5000459,1.5000459 179.99912 0 0 2.121353,-3.2e-5 L 62.81434,33.000113 a 1.5000459,1.5000459 90.000876 0 0 3.2e-5,-2.121353 L 33.000081,1.0626457 a 1.4999541,1.4999541 8.7588976e-4 0 0 -2.121288,-3.24e-5 z m 2.121284,3.400427 26.413908,26.4157167 a 1.5000513,1.5000513 90.00098 0 1 -3.6e-5,2.121356 L 33.000113,59.413949 a 1.5000513,1.5000513 179.99902 0 1 -2.121356,3.6e-5 L 4.4630403,33.000077 A 1.4999487,1.4999487 89.99902 0 1 4.463004,30.878793 L 30.878793,4.463004 a 1.4999487,1.4999487 9.804247e-4 0 1 2.121284,3.63e-5 z"></path>`,
        2: `<path d="M 30.878793,1.0626133 1.0626133,30.878793 a 1.4999541,1.4999541 89.999124 0 0 3.24e-5,2.121288 L 30.87876,62.814372 a 1.5000459,1.5000459 179.99912 0 0 2.121353,-3.2e-5 L 62.81434,33.000113 a 1.5000459,1.5000459 90.000876 0 0 3.2e-5,-2.121353 L 33.000081,1.0626457 a 1.4999541,1.4999541 8.7588976e-4 0 0 -2.121288,-3.24e-5 z m 2.121284,3.400427 26.413908,26.4157167 a 1.5000513,1.5000513 90.00098 0 1 -3.6e-5,2.121356 L 33.000113,59.413949 a 1.5000513,1.5000513 179.99902 0 1 -2.121356,3.6e-5 L 4.4630403,33.000077 A 1.4999487,1.4999487 89.99902 0 1 4.463004,30.878793 L 30.878793,4.463004 a 1.4999487,1.4999487 9.804247e-4 0 1 2.121284,3.63e-5 z"></path>`,
        3: `<path d="M 31.939164,9.4384766 A 22.500162,22.500162 0 0 0 9.4384767,31.939165 22.500162,22.500162 0 0 0 31.939164,54.438477 22.500162,22.500162 0 0 0 54.438476,31.939165 22.500162,22.500162 0 0 0 31.939164,9.4384766 Z m 0,2.5303484 A 19.969496,19.969496 0 0 1 51.908129,31.939165 19.969496,19.969496 0 0 1 31.939164,51.90813 19.969496,19.969496 0 0 1 11.968824,31.939165 19.969496,19.969496 0 0 1 31.939164,11.968825 Z"></path>`,
    } as const;

</script>
  
<button 
    bind:this={el}
    class="keyboard-key ..."
    class:key-active={engine.pressedKeys.has(keyId)}
    style:transition={engine.getSAWR ? "none" : "0.3s ease-out"}
    onpointerdown={down}
    onpointerup={up}
>
<svg class="svg-note" viewBox="0 0 63.87 63.87" xmlns="http://www.w3.org/2000/svg" style="fill: currentcolor; stroke: currentcolor;">{@html svgMap[svgPattern]}</svg>   
</button>

<style>
    .keyboard-key {
        /* outline: red solid 1px; */
        border-radius: 1rem; /* TODO: MAKE THIS CUSTOMISABLE */
        width: 6rem; /* TODO: MAKE THIS CUSTOMISABLE */
        aspect-ratio: 1 / 1 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box; /* so padding/border dont add to width/height */
        perspective: 400px; /* gives rotateY depth????? */
    }

    .key-active {
        background-color: teal;
        transition: none !important; /* the important here overrides the base transition when it applied */
    }

    .svg-note {
        width: 100%;
        height: 100%;
        transform: scale(0.8);
        backface-visibility: hidden; /* else spin ugly */
    }
</style>

