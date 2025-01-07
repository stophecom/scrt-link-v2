<script lang="ts">
	import type { Snippet } from 'svelte';

	import * as Alert from '$lib/components/ui/alert';

	type Props = {
		children: Snippet;
		message: App.Superforms.Message | undefined;
	};
	let { children, message }: Props = $props();
</script>

<!-- Global error messages -->
{#if message}
	<div class="py-3">
		<Alert.Root
			title={message.title}
			variant={message.type === 'error' ? 'destructive' : 'success'}
		>
			{message.description}
		</Alert.Root>
	</div>
{/if}
<!-- Form contents -->
{@render children?.()}
