<script lang="ts">
	import * as Button from '$lib/components/ui/button/index.js';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Button.Props;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = Button.Events;
</script>

<Button.Root type="submit" on:click on:keydown {...$$restProps}>
	<slot />
</Button.Root>
