<script lang="ts">
	import * as Button from '$lib/components/ui/button/index.js';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Button.Props;
</script>

<Button.Root type="submit" {...$$restProps}>
	<slot />
</Button.Root>
