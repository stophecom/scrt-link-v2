<script lang="ts">
	import '../app.css';

	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';

	import { i18n } from '$lib/i18n';

	import type { LayoutData } from './$types';
	import Footer from './footer.svelte';
	import Header from './header.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<ParaglideJS {i18n}>
	<Header user={data.user} />
	<div class="py-8">
		{@render children()}
	</div>
	<Footer />
</ParaglideJS>
<ModeWatcher />
