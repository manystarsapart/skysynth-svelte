<script lang="ts">
    let { options, value, onSelect }: {
        options: { value: number; label: string }[];
        value: number; onSelect: (v: number) => void;
    } = $props();
</script>

<div class="flex rounded-lg bg-gray-800 p-1 gap-1">
    {#each options as opt}
        <button
            type="button"
            onclick={() => onSelect(opt.value)}
            class="flex-1 h-10 rounded-md text-sm transition-colors
                   {value === opt.value ? 'bg-teal-600 text-white' : 'text-gray-400'}"
        >{opt.label}</button>
    {/each}
</div>