import * as Tone from 'tone';
import { log } from "$lib/utils/logging";
import { instrRegistry } from './instrRegistry';
import { buildSampler, buildSynth } from './instrLoader';
import { browser } from '$app/environment';


export function createAudioEngine() {
    function ensureVolumeNode() {
        if (!browser) return null;
        if (!volumeNode) {
            volumeNode = new Tone.Volume(Tone.gainToDb(audioState.volumePercent / 100)).toDestination();
        }
        return volumeNode;
    }

    const audioState = $state({
        currentInstrumentID: "",
        isLoading: false,
        volumePercent: 100,
        currentSustain: false,
        currentDelay: 50,
    })

    let volumeNode: Tone.Volume | null = null;
    let effectNode: Tone.ToneAudioNode | null = null;
    let instrumentNode: Tone.Sampler | Tone.PolySynth | null = null;
    const instrumentCache = new Map<string, Tone.Sampler | Tone.PolySynth>();

    function wireChain() {
        if (!browser || !instrumentNode) return;
        const vol = ensureVolumeNode()!;
        instrumentNode.disconnect();
        if (effectNode) {
            instrumentNode.connect(effectNode);
            effectNode.connect(vol);
        } else {
            instrumentNode.connect(vol);
        }
    }

    async function loadInstrument(id: string = "piano") {
        audioState.isLoading = true;
        let node = instrumentCache.get(id);
        if (!node) {
            const meta = instrRegistry.find(i => i.id === id)!;
            node = meta.kind === 'sampler' ? await buildSampler(id) : buildSynth(meta.synthType!);
            instrumentCache.set(id, node);
            audioState.currentSustain = meta.sustain;
            audioState.currentDelay = (meta.recSAWRdelay) ? meta.recSAWRdelay : 0;
            log(`[INSTR] Loaded instrument ${meta.displayName}. Sustain: ${audioState.currentSustain}. ${audioState.currentSustain ? `Recommended SAWR Delay: ${meta.recSAWRdelay}` : ''}`);
            
        }
        instrumentNode = node;
        wireChain();
        audioState.currentInstrumentID = id;
        audioState.isLoading = false;
    }

    function play(midi: number) {
        // audioState.currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);   
        instrumentNode?.triggerAttack(Tone.Frequency(midi, 'midi').toFrequency(), Tone.getContext().currentTime);
        log(`[AUDIO] Played midi note: ${midi}.`);
    }

    function release(midi: number) {
        instrumentNode?.triggerRelease(Tone.Frequency(midi, 'midi').toFrequency(), Tone.getContext().currentTime);
        log(`[AUDIO] Released midi note: ${midi}.`);
    }

    function releaseAfter(midi: number, delayMs: number = 0) {
        const releaseTime = Tone.getContext().currentTime + (delayMs / 1000);
        instrumentNode?.triggerRelease(Tone.Frequency(midi, "midi").toFrequency(), releaseTime);
        log(`[AUDIO] Released (with SAWR) midi note: ${midi} after delay (${delayMs} ms).`)
    }

    function setVolumePercent(n: number) {
        if (!volumeNode) return;
        audioState.volumePercent = n;
        volumeNode.volume.value = Tone.gainToDb(n / 100);
    }

    log(`[AUDIO] Audio engine created.`);
    
    return {
        get isLoading() { return audioState.isLoading; },
        get isSustain() { return audioState.currentSustain; },
        get currentSAWRDelay() { return audioState.currentDelay},
        get currentInstrumentId() { return audioState.currentInstrumentID; },
        get volume() { return audioState.volumePercent; },
        
        loadInstrument, setVolumePercent, play, release, releaseAfter,
    };
  }

  export type AudioEngine = ReturnType<typeof createAudioEngine>;