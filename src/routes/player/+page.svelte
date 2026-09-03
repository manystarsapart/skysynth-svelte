<script>
import { createAudioEngine } from "$lib/audio/audioEngine.svelte";
import { createKeyboardEngine } from "$lib/engine/keyboardEngine.svelte";
import { handleKeydown, handleKeyup } from "$lib/engine/keyHandler";

const engine = createKeyboardEngine();
const audio = createAudioEngine();

</script>

<svelte:window
  onkeydown={(e) => handleKeydown(e, engine, audio)}
  onkeyup={(e) => handleKeyup(e, engine, audio)}
/>

<!-- <KeyboardHalf side="left" {engine} {audio} />
<KeyboardHalf side="right" {engine} {audio} /> -->