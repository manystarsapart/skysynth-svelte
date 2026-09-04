// ====================================================
// IMPORTING
// ====================================================

const rawFiles = import.meta.glob<string>(
    '/src/lib/assets/audio/*/*.{mp3,wav}',
    // ALL instrument folders!
    { query: '?url', import: 'default' }
    // url makes each loader resolve to an asset URL
    // default gives us a string rather than a module object
)

type Loader = () => Promise<string>;

function parseNoteName(raw: string): string {
    // "ds4" -> "D#4", "a4" -> "A4"
    const m = raw.match(/^([a-g])(s)?(\d)$/i); // top 10 regex
    if (!m) return raw.toUpperCase(); 
    const [, letter, sharp, octave] = m;
    return `${letter.toUpperCase()}${sharp ? '#' : ''}${octave}`;
}

export const instrAssetMap = new Map<string, Record<string, Loader>>(); // instrumentId -> { "A4": loader, "D#4": loader, ... }

for (const [path, loader] of Object.entries(rawFiles)) {
    const match = path.match(/audio\/([^/]+)\/([a-g]s?\d+)\.(mp3|wav)$/i);
    if (!match) continue;
    const [, folder, noteRaw] = match;
    const note = parseNoteName(noteRaw);
    if (!instrAssetMap.has(folder)) instrAssetMap.set(folder, {});
    instrAssetMap.get(folder)![note] = loader as Loader;
}
  
export function listAvailableInstrumentIds(): string[] {
    return [...instrAssetMap.keys()];
}