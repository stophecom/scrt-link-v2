<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';

	import NavigationProgress from '$lib/components/elements/navigation-progress.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<NavigationProgress />

{@render children()}

<ModeWatcher />
