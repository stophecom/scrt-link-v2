<script lang="ts">
	import type { Snippet } from 'svelte';

	import Logo from '$lib/assets/images/logo.svg?component';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { emailSupport } from '$lib/data/app';
	import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime';

	type Props = { title: string; lead?: string; markNotTranslated?: boolean; children: Snippet };
	let { title, lead, markNotTranslated, children }: Props = $props();
</script>

<div class="container pb-6">
	<div>
		<a data-sveltekit-reload class="inline-flex" href="/">
			<Logo class="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32" />
		</a>
	</div>
	<h1 class="mb-5 text-3xl font-extrabold md:text-6xl">{title}</h1>

	{#if lead}
		<p class="mb-10 text-xl leading-snug md:text-3xl">{lead}</p>
	{/if}

	{#if markNotTranslated && languageTag() !== 'en'}
		<Alert class="mb-5" title="Important" variant="info">
			<div>
				{m.grassy_due_crab_cook()}
			</div>
			<a href="mailto:{emailSupport}">{emailSupport}</a>
		</Alert>
	{/if}
	{@render children?.()}
</div>
