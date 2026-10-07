<script lang="ts">
import { onMount, type Snippet } from 'svelte';
import { slide } from 'svelte/transition';
import { sectionOpen } from './sectionState.svelte';
  import { log } from '$lib/utils/logging';

let { title, id = title, defaultOpen = true, children, actions }: {
        title: string;
        id?: string;
        defaultOpen?: boolean;
        children: Snippet;
        actions?: Snippet;
    } = $props();

let open = $derived(sectionOpen[id] ?? defaultOpen);

onMount(() => {
    if (!(id in sectionOpen)) sectionOpen[id] = defaultOpen;
});

function toggle() { 
    sectionOpen[id] = !open; 
}
</script>

<section class="rounded-2xl bg-gray-800/40 p-4 space-y-4">
    <button
        type="button"
        class="flex items-center justify-between w-full text-left"
        onclick={toggle}
        // trying onclick because it apparently should work. 
        // onpointerdown triggers whenever you want to scroll as well which is causing a bunch of clunk
        aria-expanded={open}
    >
        <h3 class="text-xs uppercase tracking-wide opacity-50">{title}</h3>
        <div class="flex items-center gap-2">
            {@render actions?.()}
            <span class="transition-transform duration-150 {open ? 'rotate-180' : ''}">▾</span>
        </div>
    </button>

    {#if open}
        <div transition:slide={{ duration: 150 }} class="space-y-4">
            {@render children()}
        </div>
    {/if}
</section>