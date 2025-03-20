<script lang="ts">
	import Typewriter from 'svelte-typewriter';

	type Props = {
		message: string;
		className?: string;
		onDone?: (e: CustomEvent) => void | undefined;
	};

	let { message, onDone, className, ...rest }: Props & Partial<Typewriter> = $props();

	const onDoneHandler = onDone || (() => undefined);
</script>

<Typewriter {...rest} on:done={onDoneHandler}>
	<pre class={className}>{message}</pre>
</Typewriter>
