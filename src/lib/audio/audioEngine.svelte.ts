export function play(note: number) {
    // note should be a sanitised MIDI
    console.log("played note: " + note);
}

export function release(note: number) {
    // note should be a sanitised MIDI
    console.log("released note: " + note);
}

export function setInstrument(inst: string) {
    // TODO
}