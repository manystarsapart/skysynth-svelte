<script lang="ts">
  import type { AudioEngine } from "$lib/audio/audioEngine.svelte";
  import type { KeyboardEngine } from "$lib/engine/keyboardEngine.svelte";
  import { leftKeyRows, rightKeyRows } from "$lib/engine/maps";
  import { visualStates } from "$lib/visual/menu.svelte";
  import KeyCap from "./KeyCap.svelte";

  let { side, engine, audio }: {
    side: 'left' | 'right';
    engine: KeyboardEngine;
    audio: AudioEngine;
  } = $props();

    let rows = $derived(side === 'left' ? leftKeyRows : rightKeyRows);
</script>

<div class="keyboard-half"
  style:gap="{visualStates.noteSpacingH}rem"
>
  {#each rows as row}
    <div class="key-row"
      style:gap="{visualStates.noteSpacingV}rem"
    >
      {#each row as keyId (keyId)}
        <KeyCap {keyId} {engine} {audio} />
      {/each}
    </div>
  {/each}
</div>


<style>
  .keyboard-half {
    display: grid;
    grid-template-rows: repeat(3, 1fr); /* 3 rows */
    /* H */
    /* gap: 0.5rem */
  }
  .key-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* 5 cols */
    /* V */
    /* gap: 0.5rem; */
  }
</style>