export const sectionOpen = $state<Record<string, boolean>>({});

export function setAllSections(open: boolean) {
    for (const id of Object.keys(sectionOpen)) sectionOpen[id] = open;
}

export function allSectionsClosed() {
    const v = Object.values(sectionOpen);
    return v.length > 0 && v.every((o) => !o);
}