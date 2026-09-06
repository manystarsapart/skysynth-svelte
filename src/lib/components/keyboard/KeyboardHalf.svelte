<script lang=ts>
  import type { AudioEngine } from "$lib/audio/audioEngine.svelte";
  import type { KeyboardEngine } from "$lib/engine/keyboardEngine.svelte";
  import { leftKeyRows, rightKeyRows } from "$lib/engine/maps";
  import KeyCap from "./KeyCap.svelte";

  let { side, engine, audio }: {
    side: 'left' | 'right';
    engine: KeyboardEngine;
    audio: AudioEngine;
  } = $props();

    let rows = $derived(side === 'left' ? leftKeyRows : rightKeyRows);
</script>

<div class="keyboard-half">
  {#each rows as row}
    <div class="key-row">
      {#each row as keyId (keyId)}
        <KeyCap {keyId} {engine} {audio} />
      {/each}
    </div>
  {/each}
</div>