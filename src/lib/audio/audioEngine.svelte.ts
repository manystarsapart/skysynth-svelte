import * as Tone from 'tone';
import { log } from "$lib/utils/logging";
import { instrRegistry } from './instrRegistry';
import { buildSampler, buildSynth } from './instrLoader';
import { browser } from '$app/environment';
import { DEFAULT_AUDIO, type AudioSettings } from '$lib/settings/schema';
import { debounce, loadFromStorage, saveToStorage } from '$lib/settings/storage';


export function createAudioEngine() {

    // ========================
    // INIT
    // ========================

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
        volumePercent: 80,
        currentSustain: false,
        currentDelay: 50,
    })

    let volumeNode: Tone.Volume | null = null;
    let effectNode: Tone.ToneAudioNode | null = null;
    let instrumentNode: Tone.Sampler | Tone.PolySynth | null = null;
    const instrumentCache = new Map<string, Tone.Sampler | Tone.PolySynth>();

    // ========================
    // HOOKING AUDIO
    // ========================

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

    // ========================
    // INSTRUMENT
    // ========================

    async function loadInstrument(id: string = "piano") {
        audioState.isLoading = true;
        try {
            const meta = instrRegistry.find(i => i.id === id)!;
            let node = instrumentCache.get(id);
            if (!node) {
                node = meta.kind === 'sampler' ? await buildSampler(id) : buildSynth(meta.synthType!);
                instrumentCache.set(id, node);
            }
            releaseAll();
            instrumentNode = node;
            wireChain();
            audioState.currentInstrumentID = id;
            audioState.currentSustain = meta.sustain;
            audioState.currentDelay = (meta.recSAWRdelay) ? meta.recSAWRdelay : 0;
            log(`[INSTR] Loaded instrument ${meta.displayName}. Sustain: ${audioState.currentSustain}. ${audioState.currentSustain ? `Recommended SAWR Delay: ${meta.recSAWRdelay}` : ''}`);
        } catch {
            log(`[AUDIO] ERROR! Unknown instrument. Load failed!`);
        }
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
        const vol = ensureVolumeNode();
        if (!vol) return;
        audioState.volumePercent = n;
        vol.volume.value = Tone.gainToDb(n / 100);
    }

    // ========================
    // SETTINGS
    // ========================

    function getSettingsSnapshot(): AudioSettings {
        return {
            instrumentId: audioState.currentInstrumentID,
            volumePercent: audioState.volumePercent,
        };
    }
    
    function applySettings(s: Partial<AudioSettings>) {
        if (s.instrumentId) loadInstrument(s.instrumentId); 
        if (s.volumePercent !== undefined) setVolumePercent(s.volumePercent);
    }
    
    function resetToDefaults() {
        applySettings(DEFAULT_AUDIO);
    }
    
    if (browser) {
        const saved = loadFromStorage<AudioSettings>('audio');
        if (saved) applySettings(saved);
    
        const persist = debounce(() => saveToStorage('audio', getSettingsSnapshot()), 300);
        $effect.root(() => {
            $effect(() => {
                void [audioState.currentInstrumentID, audioState.volumePercent];
                persist();
            });
        });
    }

    function releaseAll() {
        if (!instrumentNode) return;
        for (let midi = 0; midi < 128; midi++) {
            instrumentNode.triggerRelease(Tone.Frequency(midi, 'midi').toFrequency());
        }
    }

    // ========================
    // EXPOSING EVERYTHING
    // ========================
    log(`[AUDIO] Audio engine created.`);

    return {
        get isLoading() { return audioState.isLoading; },
        get isSustain() { return audioState.currentSustain; },
        get currentSAWRDelay() { return audioState.currentDelay},
        get currentInstrumentId() { return audioState.currentInstrumentID; },
        get volumePercent() { return audioState.volumePercent; },
        
        loadInstrument, setVolumePercent, play, release, releaseAfter,
        getSettingsSnapshot, applySettings, resetToDefaults, releaseAll,
    };
}



  export type AudioEngine = ReturnType<typeof createAudioEngine>;