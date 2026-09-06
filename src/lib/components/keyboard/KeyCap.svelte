<script lang="ts">
    import type { KeyboardEngine } from '$lib/engine/keyboardEngine.svelte';
    import type { AudioEngine } from '$lib/audio/audioEngine.svelte';
  
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
</script>
  
<button 
    // role="button"
  class="keyboard-key ..."
  class:key-active={engine.pressedKeys.has(keyId)}
  onpointerdown={down}
  onpointerup={up}
>
  {keyId.toUpperCase()}
</button>

