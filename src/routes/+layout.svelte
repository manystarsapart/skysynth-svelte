<script lang="ts">

	import './layout.css'; // tailwind
	import thumbnail from '$lib/assets/thumbnail.jpeg';


	let { children } = $props();
</script>

<svelte:head>
	<title>SkySynth</title>
	<meta name="description" content="Svelte-TS-powered interactive music keyboard inspired by Sky: Children of the Light. Play, transpose, record, and explore instruments/synths with intuitive keyboard controls." />
	<link rel="icon" href={thumbnail} />
</svelte:head>
{@render children()}
