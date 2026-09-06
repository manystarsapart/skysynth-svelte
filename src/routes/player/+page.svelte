<script lang=ts>
import { createAudioEngine } from "$lib/audio/audioEngine.svelte";
import KeyboardHalf from "$lib/components/keyboard/KeyboardHalf.svelte";
import { createKeyboardEngine } from "$lib/engine/keyboardEngine.svelte";
import { handleKeydown, handleKeyup } from "$lib/engine/keyHandler";
import { log } from "$lib/utils/logging";
import { onMount } from "svelte";

const engine = createKeyboardEngine();
const audio = createAudioEngine();

onMount(() => { audio.loadInstrument('piano'); });

let currentTranspose = $derived(engine.transposeValue);
let currentOctave = $derived(engine.octave);
let currentSAWR = $derived(engine.getSAWR);
let currentSAWRDelay = $derived(engine.sawrDelay);
// let keys = $derived(engine.pressedKeys.has('enter'));
</script>

<svelte:window
  onkeydown={(e) => handleKeydown(e, engine, audio)}
  onkeyup={(e) => handleKeyup(e, engine, audio)}

  onblur={() => {engine.resetKeys(); log(`[PAGE] blur --> keys reset`)}} // CATCH TAB OUT TMOD 
  onvisibilitychange={() => { // CATCH TAB BACK TMOD 
    if (document.visibilityState === "visible") {
      engine.resetKeys();
      log(`[PAGE] vis --> keys reset`);
    }
  }}
/>
<div class="text-center text-3xl">
  <p>TRANSPOSE: {currentTranspose}</p>
  <p>OCTAVE: {currentOctave}</p>
  <p>Stop Audio When Released: {currentSAWR}{(currentSAWR) ? `; Delay: ${currentSAWRDelay}` : ``}</p>
  <!-- <p>{keys}</p> -->
</div>

<div class="flex">
  <KeyboardHalf side="left" {engine} {audio} />
  <KeyboardHalf side="right" {engine} {audio} />
</div>


