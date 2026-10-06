<script lang="ts">
  import { browser } from "$app/environment";

  // import Tutorial from "$lib/components/Tutorial.svelte";

  if (browser) {
    document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                window.location.href = "./player/";
            }
        })
  }


</script>
<h1 class="text-center text-7xl p-4">SkySynth</h1>
<br>
<a href="/player" class="flex justify-center items-center">
  <button class="text-4xl h-20 rounded-2xl bg-gray-900 p-10 flex justify-center items-center">
    <div>Player</div>
  </button>
</a>


<!-- <Tutorial /> -->

