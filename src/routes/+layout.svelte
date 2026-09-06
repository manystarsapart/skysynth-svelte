<script lang="ts">

	import './layout.css'; // tailwind
	import thumbnail from '$lib/assets/thumbnail.jpeg';


	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={thumbnail} /></svelte:head>
{@render children()}
