// ====================================================
// LOADING
// ====================================================

import * as Tone from 'tone';
import { instrAssetMap } from './instrAssets';

export async function buildSampler(id: string): Promise<Tone.Sampler> {
    const loaders = instrAssetMap.get(id);
    if (!loaders) throw new Error(`[LOADER] No audio assets! instrument "${id}"`);

    const entries = await Promise.all(
        Object.entries(loaders).map(async ([note, load]) => [note, await load()] as const) // each lazy import --> URL string
    );
    const urls = Object.fromEntries(entries);
  
    return new Promise((resolve, reject) => {
        const sampler = new Tone.Sampler({
            urls,
            onload: () => resolve(sampler),
            onerror: reject,
        }); 
    });
}
  
export function buildSynth(type: 'basic' | 'duo' | 'fm' | 'am') {
    const Ctor = { basic: Tone.Synth, duo: Tone.DuoSynth, fm: Tone.FMSynth, am: Tone.AMSynth }[type];
    return new Tone.PolySynth(Ctor as any);
}