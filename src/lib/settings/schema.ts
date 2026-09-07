export interface VisualSettings {
    charSpriteSizePercent: number;
    notesSizePercent: number;
    noteSpacingV: number;
    noteSpacingH: number;
    keyboardPosition: number;
    reducedAnimations: boolean;
    showDetailedNoteNames: boolean;
}

export interface KeyboardSettings {
    transposeValue: number;
    octave: number;
    currentKeyboardMode: number;
    sawrEnabled: boolean;
    sawrDelay: number;
}

export interface AudioSettings {
    instrumentId: string;
    volumePercent: number;
}

export const DEFAULT_VISUAL: VisualSettings = {
    charSpriteSizePercent: 30,
    notesSizePercent: 100,
    noteSpacingV: 1,
    noteSpacingH: 1,
    keyboardPosition: 5,
    reducedAnimations: false,
    showDetailedNoteNames: false,
};

export const DEFAULT_KEYBOARD: KeyboardSettings = {
    transposeValue: 0,
    octave: 0,
    currentKeyboardMode: 0,
    sawrEnabled: false,
    sawrDelay: 50,
};

export const DEFAULT_AUDIO: AudioSettings = {
    instrumentId: 'piano',
    volumePercent: 80,
};

export const SETTINGS_VERSION = 1;
export const SETTINGS_FILE_EXT = '.skysettings';

export interface SkySettingsFile {
    app: 'skysynth';
    type: 'settings';
    version: number;
    exportedAt: string;
    visual: VisualSettings;
    keyboard: KeyboardSettings;
    audio: AudioSettings;
}