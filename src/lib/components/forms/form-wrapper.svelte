<script lang="ts">
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';

	// import * as Alert from '$lib/components/ui/alert';

	type Props = {
		children: Snippet;
		message: App.Superforms.Message | undefined;
	};
	let { children, message }: Props = $props();

	$effect(() => {
		if (message) {
			if (message.status === 'success' && message.title) {
				toast.success(message.title);
			}
			if (message.status === 'error' && message.title) {
				toast.error(message.title);
			}
		}
	});
</script>

<!-- Global error messages were previously here as Alerts, now using toasts -->
<!-- Form contents -->
{@render children?.()}
