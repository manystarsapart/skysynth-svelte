export const getFormattedDateTimeForDownload = (): string => {
    const now = new Date();
  
    const formattedDateTime = now.toLocaleString('default', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 24h format
    })
    // filename safe characters
    .replace(/[/:]/g, '-')  
    .replace(/, /g, '_')    
    .replace(/ /g, '_');  
  
    return formattedDateTime;
  };

export function midiToSPN(midiNumber:number) {
    const noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
    const noteIndex: number = midiNumber % 12;
    const octave: number = Math.floor((midiNumber) / 12) - 1;
    return noteNames[noteIndex] + octave;
}

export function midiToNote(midiNumber:number) {
    const noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
    const noteIndex: number = midiNumber % 12;
    return noteNames[noteIndex];
}

export function midiToOctave(midiNumber:number) {
    const octave: number = Math.floor((midiNumber) / 12) - 1;
    return octave;
}
