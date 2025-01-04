<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import type { Snippet } from 'svelte';

	import * as Alert from '$lib/components/ui/alert';

	type Props = {
		children: Snippet;
		title?: string;
		description?: string;
		message: App.Superforms.Message | undefined;
	};
	let { children, message, title, description }: Props = $props();
</script>

<div class="max-w-lg rounded border bg-slate-100 px-5 pb-3 pt-6 dark:bg-slate-900">
	{#if title}
		<h3 class="mb-4 text-2xl">{title}</h3>
	{/if}
	{#if description}
		<p class="mb-4 leading-normal">{description}</p>
	{/if}
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
	<!-- Form contents -->
	{@render children?.()}
</div>
