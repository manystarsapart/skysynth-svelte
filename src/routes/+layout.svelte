<script lang="ts">

	import './layout.css'; // im not sure whats here
	import thumbnail from '$lib/assets/thumbnail.jpeg';
	import '../app.css'; // tailwind

	// for deploying of static page
	export const prerender = true;
	export const trailingSlash = 'always';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={thumbnail} /></svelte:head>
{@render children()}
