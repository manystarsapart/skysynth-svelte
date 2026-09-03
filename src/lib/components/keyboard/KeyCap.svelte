<script lang="ts">
// COMPONENT FOUND IN PLAYER PAGE ($lib/routes/player/+page.svelte)
    import { onMount } from "svelte";
    import { handleKeydown, handleKeyup } from "$lib/engine/keyClassifier";
    
    onMount(() => {
        document.addEventListener("keydown", handleKeydown);
        document.addEventListener("keyup", handleKeyup)

        return () => {
            document.removeEventListener("keydown", handleKeydown);
            document.removeEventListener("keyup", handleKeyup);
        };
    });
</script>
