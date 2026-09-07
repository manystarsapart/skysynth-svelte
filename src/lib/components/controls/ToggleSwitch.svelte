<script lang="ts">
    let { checked, onToggle, label }: {
        checked: boolean; onToggle: () => void; label: string;
    } = $props();
</script>

<button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onclick={onToggle}
    class="relative h-8 w-14 rounded-full transition-colors duration-200 shrink-0
           {checked ? 'bg-teal-600' : 'bg-gray-600'}"
>
    <span
        class="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200
               {checked ? 'translate-x-6' : 'translate-x-0'}"
    ></span>
</button>