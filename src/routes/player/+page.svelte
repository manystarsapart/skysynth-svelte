<script lang="ts">
import { createAudioEngine } from "$lib/audio/audioEngine.svelte";
import { listAvailableInstrumentIds } from "$lib/audio/instrAssets";
import KeyboardHalf from "$lib/components/keyboard/KeyboardHalf.svelte";
import { createKeyboardEngine } from "$lib/engine/keyboardEngine.svelte";
import { handleKeydown, handleKeyup } from "$lib/engine/keyHandler";
import { log } from "$lib/utils/logging";
import { visualStates } from "$lib/visual/menu.svelte";
import { onMount } from "svelte";

const engine = createKeyboardEngine();
const audio = createAudioEngine();

onMount(async () => { // THIS IS ASYNC SO INSTRUMENT LOADS BEFORE WE DEAL WITH THE STATES!!!
  await audio.loadInstrument('piano');
  log("[PLAYER] Sustain: " + String(audio.isSustain));
  engine.toggleSAWR(audio.isSustain);
  engine.setSAWRDelay(audio.currentSAWRDelay);
  log("[PLAYER] SAWR: " + String(engine.getSAWR));
});

let currentTranspose = $derived(engine.transposeValue);
let currentOctave = $derived(engine.octave);
let currentSAWR = $derived(engine.getSAWR);
let currentSAWRDelay = $derived(engine.sawrDelay);
let currentSustain = $derived(audio.isSustain);

// let keysArr: string[] = $derived([]);

// engine.pressedKeys.forEach(x => {
//   keysArr.push(String(x))
// });

let instr = $derived(listAvailableInstrumentIds());
let instrStr = $derived(String(instr).replace(/\b,\b/g,"<br>"));


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
  <p>Instrument sustain: {currentSustain}</p>
  <p>Stop Audio When Released: {currentSAWR}{(currentSAWR) ? `; Delay: ${currentSAWRDelay}` : ``}</p>
  <!-- <p>{keys}</p> -->
</div>

<div class="flex text-center justify-evenly text-4xl"
  style:padding-top="{visualStates.keyboardPosition}rem"
>
  <div><KeyboardHalf side="left" {engine} {audio} /></div>
  <div><KeyboardHalf side="right" {engine} {audio} /></div>
  
</div>
<br>

<!-- {@html instrStr} -->
 
<!-- {keysArr} -->

