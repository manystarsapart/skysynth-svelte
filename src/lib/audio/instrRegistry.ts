export interface InstrumentMeta {
    id: string; // MUST MATCH NAME OF ASSET FOLDER!
    displayName: string;
    spriteCount: number;
    kind: 'sampler' | 'synth';
    synthType?: 'basic' | 'duo' | 'fm' | 'am';
}
  
  export const instrRegistry: InstrumentMeta[] = [
    { id: 'piano',       displayName: 'Piano',       spriteCount: 10, kind: 'sampler' },
    { id: 'grandpiano',  displayName: 'Grand Piano', spriteCount: 0,  kind: 'sampler' },
    { id: 'eguitar',     displayName: 'E-Guitar',    spriteCount: 5,  kind: 'sampler' },
    // TODO!!!!!! OTHERS SOON!
    { id: 'synth',       displayName: 'Synth',    spriteCount: 0, kind: 'synth', synthType: 'basic' },
    { id: 'duosynth',    displayName: 'Duo Synth',spriteCount: 0, kind: 'synth', synthType: 'duo' },
  ];