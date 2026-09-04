<script lang="ts">

	import './layout.css'; // im not sure whats here
	import thumbnail from '$lib/assets/thumbnail.jpeg';
	import '../app.css'; // tailwind


	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={thumbnail} /></svelte:head>
{@render children()}
