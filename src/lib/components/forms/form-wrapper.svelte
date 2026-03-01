<script lang="ts">
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';

	type Props = {
		children: Snippet;
		message: App.Superforms.Message | undefined;
	};
	let { children, message }: Props = $props();

	$effect(() => {
		if (message) {
			if (message.status === 'success' && message.title) {
				toast.success(message.title, {
					description: message.description || undefined
				});
			}
			if (message.status === 'error' && message.title) {
				toast.error(message.title, {
					description: message.description || undefined
				});
			}
		}
	});
</script>

<!-- Form contents -->
{@render children?.()}
