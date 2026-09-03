<script lang="ts">
// BASICS
    let htmlValue = `<div><p>some <b>HTML</b> text</p></div>`;
    let name = 'test';

// REACTIVITY
    let count = $state(0); // this is a RUNE. a state variable reacts to REASSIGNMENTS
    function increment() {
        count += 1;
    }

    let numbers = $state([1, 2, 3, 4]);
    function addNumber() {
        numbers.push(numbers.length + 1);
        console.log($state.snapshot(numbers)); 
        // you cannot console log a state variable directly! 
        // the variable is wrapped in a PROXY, which tracks changes and is what makes svelte reactive.
        // hence we need to take a snapshot of the state at that time, then log that snapshot
    }

    let total = $derived(numbers.reduce((t, n) => t = n, 0)); 
    // this is a DERIVED state. it gets updated when its dependencies are updated
    
    $inspect(numbers);
    // alternatively, you can just $inspect a state variable and it will console log itself whenever updated.

    // $inspect(total).with(console.trace);
    $inspect(`total is ${total}.`)
    // this works too. there are lots of things you can output with inspect.


    // IM PUTTING OFF LEARNING EFFECTS FOR NOW. SEEMS LIKE I WONT NEED IT YET?
    // i think i'll need it LOL. tonejs

    // GLOBAL STATE
    // NOTE!!! YOU NEED FILE.SVELTE.TS INSTEAD OF FILE.TS TO INCLUDE RUNES INSIDE!!!
    
    import { skyStates } from "$lib/engine/keyboardEngine.svelte";
  import KeyCap from "./keyboard/KeyCap.svelte";

</script>

<!-- BASICS -->

<h1>hello {name.toUpperCase()}</h1>

{htmlValue}

{@html htmlValue}

<!-- <img src="assets/thumbnail.jpeg" alt="thumbnail" /> -->


<br>
<!-- REACTIVITY -->

<button onclick={increment}>
    clicked: {count} {count === 1 ? 'time' : 'times'}
</button>

<br>

<button onclick={addNumber}>
    addnumber
    {numbers}
    <br>
    {total}
</button>


<!-- UNIVERSAL REACTIVITY -->

<!-- <button onclick={() => skyStates.count += 1}>
    among us. count is {skyStates.count}
</button> -->
