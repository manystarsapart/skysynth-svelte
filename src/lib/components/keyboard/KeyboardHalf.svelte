<script lang=ts>
  import type { AudioEngine } from "$lib/audio/audioEngine.svelte";
  import type { KeyboardEngine } from "$lib/engine/keyboardEngine.svelte";
  import KeyCap from "./KeyCap.svelte";

  let { side, engine, audio }: {
        side: string, engine: KeyboardEngine; audio: AudioEngine;
    } = $props();

</script>

<!-- <KeyCap keyId = 'q', engine = {engine}, audio = {audio} /> -->