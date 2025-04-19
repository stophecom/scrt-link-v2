<script lang="ts">
	import type { Snippet } from 'svelte';

	import { localizeHref } from '$lib/paraglide/runtime';

	import PageLead from './page-lead.svelte';
	import PageTitle from './page-title.svelte';

	type Props = {
		name?: string | null;
		title: string;
		lead?: string | null;
		logo?: string | null;
		children: Snippet;
	};

	let { name, title, lead, logo, children }: Props = $props();
</script>

<div class="container min-h-screen pt-8 pb-16">
	<div>
		<a class="mb-12 inline-flex h-32 w-56 items-center" href={localizeHref('/')}>
			{#if logo}
				<img src={logo} alt={title} class="max-h-full max-w-full object-contain" />
			{:else}
				<div class="py-2 text-4xl font-bold">
					{name}
				</div>
			{/if}
		</a>
	</div>

	<PageTitle {title} />

	{#if lead}
		<PageLead {lead} />
	{/if}

	{@render children?.()}
</div>
