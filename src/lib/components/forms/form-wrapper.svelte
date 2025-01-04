<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import type { Snippet } from 'svelte';

	import * as Alert from '$lib/components/ui/alert';

	type Props = {
		children: Snippet;
		message: App.Superforms.Message | undefined;
	};
	let { children, message }: Props = $props();
</script>

<div class="max-w-lg rounded border bg-slate-100 p-3 dark:bg-slate-900">
	<!-- Global error messages -->
	{#if message}
		<div class="py-3">
			<Alert.Root variant={message.type === 'error' ? 'destructive' : 'success'}>
				{#if message.type === 'error'}
					<CircleAlert class="h-4 w-4" />
				{:else}
					<CircleCheck class="h-4 w-4" />
				{/if}
				<Alert.Title>{message.title}</Alert.Title>
				<Alert.Description>{message.description}</Alert.Description>
			</Alert.Root>
		</div>
	{/if}
	{@render children?.()}
</div>
