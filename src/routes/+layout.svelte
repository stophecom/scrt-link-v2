<script lang="ts">
	import '../app.css';

	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';

	import Header from '$lib/components/ui/header/header.svelte';
	import { i18n } from '$lib/i18n';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Header />
	<div class="container py-8">
		{@render children()}
	</div>
</ParaglideJS>
<ModeWatcher />
