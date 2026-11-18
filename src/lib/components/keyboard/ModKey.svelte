<script lang="ts">
    import type { KeyboardEngine } from '$lib/engine/keyboardEngine.svelte';
    let { keyId, label, desc, engine }: { keyId: string; label: string; desc: string; engine: KeyboardEngine } = $props();
  
    let active = $derived(engine.pressedKeys.has(keyId));
  
    function down(e: PointerEvent) {
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        engine.markDown(keyId);
    }

    function up(e: PointerEvent) {
        e.preventDefault();
        engine.markUp(keyId);
    }
</script>

<div class="flex flex-col">
    <button
        type="button"
        aria-pressed={active}
        class="h-20 min-w-32 px-3 rounded-lg text-sm {active ? 'outline-accent outline-2 text-fg' : 'bg-button'}"
        onpointerdown={down}
        onpointerup={up}
        onpointercancel={up}
    >{label}<br><span class="text-xs text-gray-400">{desc}</span></button>

</div>
