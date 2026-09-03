import { log } from "$lib/utils/logging";

export function createAudioEngine() {
    function play(midi: number) {
        // TODO
        log(`[AUDIO] played midi note: ${midi}`);
     }
    function release(midi: number) {
        // TODO
        log(`[AUDIO] released midi note: ${midi}`);
    }
    function setInstrument(inst: string) {
        // TODO
    }
    return { play, release, setInstrument };
  }

  export type AudioEngine = ReturnType<typeof createAudioEngine>;