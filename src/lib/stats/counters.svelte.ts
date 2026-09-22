import { browser } from "$app/environment";
import { debounce, loadFromStorage, saveToStorage } from "$lib/settings/storage";
import { log } from "$lib/utils/logging";

export const statsState = $state({
    cumulativeKeypress: 0,
    cumulativeTime: 0,

})

export function incrementKeypress() {
    statsState.cumulativeKeypress++;
}

if (browser) {
    const saved = loadFromStorage<typeof statsState>('stats');
    if (saved) Object.assign(statsState, saved);

    const persist = debounce(() => saveToStorage('stats', { ...statsState }), 500);
    $effect.root(() => {
        $effect(() => {
            void [statsState.cumulativeKeypress, statsState.cumulativeTime];
            persist();
        });
    });

    let lastTick = Date.now();
    setInterval(() => {
        const now = Date.now();
        statsState.cumulativeTime += Math.floor((now - lastTick) / 1000);
        lastTick = now;
    }, 1000);

    window.addEventListener('beforeunload', () => {
        statsState.cumulativeTime += Math.floor((Date.now() - lastTick) / 1000);
        saveToStorage('stats', { ...statsState });
    });
}

export function resetStats() {
    if (confirm("Are you sure you wish to reset all statistics? This is irreversible.")) {
        log("[STATS] Statistics reset.");
        statsState.cumulativeKeypress = 0;
        statsState.cumulativeTime = 0;
    } else {
        log("[STATS] Statistics reset cancelled.");
        return
    }
}

export function formatTime(seconds:number) {
    const hours: number = Math.floor(seconds / 3600);
    const minutes: number = Math.floor((seconds % 3600) / 60);
    const secs: number = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
