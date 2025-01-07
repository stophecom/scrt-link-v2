<script lang="ts">
	import type { Snippet } from 'svelte';

	import Logo from '$lib/assets/images/logo.svg?component';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { emailSupport } from '$lib/data/constants';
	import * as m from '$lib/paraglide/messages.js';

	type Props = { title: string; lead?: string; markNotTranslated?: boolean; children: Snippet };
	let { title, lead, markNotTranslated, children }: Props = $props();
</script>

<div class="container py-12">
	<a class="p-2" href="/">
		<Logo class="h-40 w-40" />
	</a>
	<h1 class="mb-5 text-4xl font-extrabold md:text-7xl">{title}</h1>

	{#if lead}
		<p class="mb-10 text-xl leading-normal md:text-4xl">{lead}</p>
	{/if}
	{#if markNotTranslated}
		<Alert class="mb-5" title="Important" variant="info">
			<div>
				{m.grassy_due_crab_cook()}
			</div>
			<a href="mailto:{emailSupport}">emailSupport</a>
		</Alert>
	{/if}
	{@render children?.()}
</div>
