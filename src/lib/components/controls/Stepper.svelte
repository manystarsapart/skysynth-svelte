<script lang="ts">
    let { label, value, displayValue, onDecrement, onIncrement, disabledDown = false, disabledUp = false }: {
        label: string; value: number; displayValue?: string;
        onDecrement: () => void; onIncrement: () => void;
        disabledDown?: boolean; disabledUp?: boolean;
    } = $props();
</script>

<div class="flex items-center justify-between py-2">
    <span class="text-sm">{label}</span>
    <div class="flex items-center gap-3">
        <button
            type="button"
            onclick={onDecrement}
            disabled={disabledDown}
            aria-label="Decrease {label}"
            class="h-11 w-11 rounded-full bg-gray-700 disabled:opacity-30 active:scale-90 transition-transform"
        >−</button>
        <span class="w-12 text-center tabular-nums">{displayValue ?? value}</span>
        <button
            type="button"
            onclick={onIncrement}
            disabled={disabledUp}
            aria-label="Increase {label}"
            class="h-11 w-11 rounded-full bg-gray-700 disabled:opacity-30 active:scale-90 transition-transform"
        >+</button>
    </div>
</div>