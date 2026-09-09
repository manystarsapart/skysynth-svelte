<script lang="ts">
import { browser } from "$app/environment";
import { createAudioEngine } from "$lib/audio/audioEngine.svelte";
import { listAvailableInstrumentIds } from "$lib/audio/instrAssets";
  import { instrRegistry } from "$lib/audio/instrRegistry";
import SettingsWrapper from "$lib/components/controls/SettingsWrapper.svelte";
import KeyboardHalf from "$lib/components/keyboard/KeyboardHalf.svelte";
import { createKeyboardEngine } from "$lib/engine/keyboardEngine.svelte";
import { handleKeydown, handleKeyup } from "$lib/engine/keyHandler";
import { maps } from "$lib/engine/maps";
import { loadFromStorage } from "$lib/settings/storage";
import { midiToSPN, transposeToNote } from "$lib/utils/helpers";
import { log } from "$lib/utils/logging";
import { visualStates } from "$lib/visual/menu.svelte";
import { onMount } from "svelte";
  
const engine = createKeyboardEngine();
const audio = createAudioEngine();
  
let currentTranspose = $derived(engine.transposeValue);
let currentOctave = $derived(engine.octave);
let currentSAWR = $derived(engine.getSAWR);
let currentSAWRDelay = $derived(engine.sawrDelay);
let currentSustain = $derived(audio.isSustain);
let hasRestoredKeyboardSettings = false;
  
if (browser) hasRestoredKeyboardSettings = !!loadFromStorage('keyboard');
  
async function selectInstrument(id: string, opts: { forceDefaults?: boolean } = {}) {
	await audio.loadInstrument(id);
	if (opts.forceDefaults || !hasRestoredKeyboardSettings) {
		engine.applyRecommendedSAWR(audio.isSustain, audio.currentSAWRDelay);
	}
	engine.resetKeys();
}
  
onMount(async () => { // THIS IS ASYNC SO INSTRUMENT LOADS BEFORE WE DEAL WITH THE STATES!!!
// await audio.loadInstrument('piano');
// if (!audio.currentInstrumentId) await audio.loadInstrument('piano');
	if (!audio.currentInstrumentId) await selectInstrument('piano'); // third times the charm
});
  
  
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

<div class="absolute p-5 text-xl">
	<p>Left Centre = <b>{midiToSPN(maps[engine.currentKeyboardMode]['d'] + engine.transposeValue + engine.octave * 12 + engine.resolveMod('d'))}</b> / Right Centre = <b>{midiToSPN(maps[engine.currentKeyboardMode]['k'] + engine.transposeValue + engine.octave * 12 + engine.resolveMod('k'))}</b></p>
	<p>Transpose: <b>{currentTranspose}</b> ({transposeToNote(currentTranspose)}) / Octave: <b>{currentOctave}</b></p>
	<!-- <p>Sustain: <b>{currentSustain}</b> / SAWR: {currentSAWR}{(currentSAWR) ? `; Delay: ${currentSAWRDelay}` : ``}</p> -->
	<p>Sustain: <b>{currentSustain}</b>{@html (currentSAWR) ? `; Delay: <b>${currentSAWRDelay}</b>` : ``}</p>
	<p>Instrument: <b>{instrRegistry.find(instr => instr.id == audio.currentInstrumentId)?.displayName}</b></p>
	<!-- <p>{keys}</p> -->
</div>
  
  <SettingsWrapper {engine} {audio}/>
  
  <div class="flex text-center justify-evenly text-4xl"
	style:padding-top="{visualStates.keyboardPosition}rem"
  >
	<div><KeyboardHalf side="left" {engine} {audio} /></div>
	<div><KeyboardHalf side="right" {engine} {audio} /></div>
	
  </div>
  <br>
  
  <!-- {@html instrStr} -->
  
  <!-- {keysArr} -->
  
  