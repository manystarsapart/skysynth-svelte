// ====================================================
// (KeyCap.svelte) keyId -> DOM element
// ====================================================

import { visualStates } from "./menu.svelte";

const keyElements = new Map<string, HTMLElement>();

export function registerKeyElement(keyId: string, el: HTMLElement) {
    keyElements.set(keyId, el);
}

export function unregisterKeyElement(keyId: string) {
    keyElements.delete(keyId);
}

// ====================================================
// RAW ANIMATION CLIPS
// ====================================================

const PULSE_MS = 500;
const FLIP_MS = 150;

function cancelAll(el: HTMLElement) {
    el.getAnimations().forEach(a => a.cancel());
}

export function pulseFlip(el: HTMLElement) {
    cancelAll(el);
    el.animate(
        [
            { transform: 'rotateY(0deg)' },
            { transform: 'rotateY(180deg)' },
            { transform: 'rotateY(360deg)' }
        ],
        { duration: PULSE_MS, easing: 'ease-in-out' }
    );
}

export function startSustainHold(el: HTMLElement) {
    cancelAll(el);
    el.animate(
        [
            { transform: 'scale(1) rotateY(0deg)' },
            { transform: 'scale(0.8) rotateY(180deg)' }
        ],
        { duration: FLIP_MS, easing: 'ease-out', fill: 'forwards' }
    );
}

export function endSustainHold(el: HTMLElement) {
    cancelAll(el);
    const anim = el.animate(
        [
            { transform: 'scale(0.8) rotateY(180deg)' },
            { transform: 'scale(1) rotateY(360deg)' }
        ],
        { duration: FLIP_MS, easing: 'ease-in', fill: 'forwards' }
    );
    anim.finished.then(() => { el.style.transform = ''; }).catch(() => {});
}

// ====================================================
// UNIFIED USING KEY IDS (FOR POINTER & KEY)
// ====================================================

export function playNoteDownAnimation(keyId: string, isSustain: boolean) {
    const el = keyElements.get(keyId);
    if (!el || visualStates.reducedAnimations) return; // not found || reduced
    if (isSustain) startSustainHold(el);
    else pulseFlip(el);
}

export function playNoteUpAnimation(keyId: string, isSustain: boolean) {
    const el = keyElements.get(keyId);
    if (!el || visualStates.reducedAnimations) return; // not found || reduced
    if (isSustain) endSustainHold(el);
}