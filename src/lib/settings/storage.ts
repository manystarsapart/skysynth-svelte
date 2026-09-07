const STORAGE_PREFIX = 'skysynth:settings:';

export function loadFromStorage<T>(key: string): Partial<T> | null {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (!raw) return null;
        return JSON.parse(raw) as Partial<T>;
    } catch {
        return null; // bad data, back to defaults
    }
}

export function saveToStorage<T>(key: string, value: T) {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
        // fail silently. settings not preserved
    }
}

export function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
    let timeout: ReturnType<typeof setTimeout>;
    return ((...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms); // debounce localstorage spam (slider etc)
    }) as T;
}