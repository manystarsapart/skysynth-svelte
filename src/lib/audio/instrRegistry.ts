export interface InstrumentMeta {
    id: string; // MUST MATCH NAME OF ASSET FOLDER!
    displayName: string;
    spriteCount: number;
    kind: 'sampler' | 'synth';
    sustain: boolean;
    recSAWRdelay?: number;
    synthType?: 'basic' | 'duo' | 'fm' | 'am';
}
  
  export const instrRegistry: InstrumentMeta[] = [
    // INSTRUMENTS
    { id: 'aurora', displayName: 'Aurora', spriteCount: 0, kind: 'sampler', sustain: true, recSAWRdelay: 500 },
    { id: 'banjo', displayName: 'Banjo', spriteCount: 5, kind: 'sampler', sustain: false },
    { id: 'bugle', displayName: 'Bugle', spriteCount: 7, kind: 'sampler', sustain: false },
    { id: 'eguitar', displayName: 'E-Guitar', spriteCount: 5,  kind: 'sampler', sustain: true, recSAWRdelay: 50 },
    { id: 'flute', displayName: 'Flute', spriteCount: 5, kind: 'sampler', sustain: false },
    { id: 'grandpiano', displayName: 'Grand Piano', spriteCount: 0, kind: 'sampler', sustain: false, recSAWRdelay: 50 }, // default sprite
    { id: 'guitar', displayName: 'Guitar', spriteCount: 5, kind: 'sampler', sustain: false },
    { id: 'harmonica_long', displayName: 'Harmonica (Long)', spriteCount: 0, kind: 'sampler', sustain: true, recSAWRdelay: 50 }, // default sprite
    { id: 'harmonica_short', displayName: 'Harmonica (Short)', spriteCount: 0, kind: 'sampler', sustain: false }, // default sprite
    { id: 'harp', displayName: 'Harp', spriteCount: 5, kind: 'sampler', sustain: false },
    { id: 'horn', displayName: 'Horn', spriteCount: 7, kind: 'sampler', sustain: false },
    { id: 'kalimba', displayName: 'Kalimba', spriteCount: 0, kind: 'sampler', sustain: false }, // default sprite
    { id: 'musicbox', displayName: 'Music Box', spriteCount: 0, kind: 'sampler', sustain: false }, // default sprite
    { id: 'panflute', displayName: 'Panflute', spriteCount: 0, kind: 'sampler', sustain: false }, // default sprite
    
    // TODO MORE
    

    { id: 'piano', displayName: 'Piano', spriteCount: 10, kind: 'sampler', sustain: false },
    // { id: 'grandpiano',  displayName: 'Grand Piano', spriteCount: 0,  kind: 'sampler', sustain: false },

    // TODO!!!!!! OTHERS SOON!


    // SYNTHS
    { id: 'synth', displayName: 'Synth', spriteCount: 0, kind: 'synth', sustain: true, recSAWRdelay: 50, synthType: 'basic' },
    { id: 'duosynth', displayName: 'Duo Synth',spriteCount: 0, kind: 'synth', sustain: true, recSAWRdelay: 50, synthType: 'duo' },


    // CALLS. soontm?


    // MISC
    { id: 'meow', displayName: 'Meow', spriteCount: 0, kind: 'sampler', sustain: true, recSAWRdelay: 500 },
    
  ];