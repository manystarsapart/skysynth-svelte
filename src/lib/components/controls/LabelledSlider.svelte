<script lang="ts">
    let { label, value, min, max, step = 1, unit = '', onInput }: {
        label: string; value: number; min: number; max: number; step?: number;
        unit?: string; onInput: (v: number) => void;
    } = $props();
</script>

<div class="flex flex-col gap-1 py-2">
    <div class="flex justify-between text-sm">
        <span>{label}</span>
        <span class="tabular-nums opacity-70">{value}{unit}</span>
    </div>
    <input
        type="range"
        {min} {max} {step}
        value={value}
        oninput={(e) => onInput(Number(e.currentTarget.value))}
        class="w-full h-10 touch-none accent-teal-500"
        aria-label={label}
    />
</div>