import { transposeMap } from "$lib/engine/maps";

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

const noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

export function midiToSPN(midiNumber:number) {
    const noteIndex: number = midiNumber % 12;
    const octave: number = Math.floor((midiNumber) / 12) - 1;
    return noteNames[noteIndex] + octave;
}

export function midiToNote(midiNumber:number) {
    const noteIndex: number = midiNumber % 12;
    return noteNames[noteIndex];
}

export function midiToOctave(midiNumber:number) {
    const octave: number = Math.floor((midiNumber) / 12) - 1;
    return octave;
}

export function transposeToNote(transposeValue:number) {
	const note = transposeMap[transposeValue];
	return note;
}

export function formatTime(seconds:number) {
  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  const secs: number = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
