<script lang="ts">
	import Typewriter from 'svelte-typewriter';

	export let message: string | undefined;
</script>

<Typewriter mode="scramble" scrambleDuration={900}>
	<span>{message}</span>
</Typewriter>
