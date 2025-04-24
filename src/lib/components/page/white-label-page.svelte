<script lang="ts">
	import type { Snippet } from 'svelte';

	import { localizeHref } from '$lib/paraglide/runtime';

	import Container from '../ui/container/container.svelte';
	import PageLead from './page-lead.svelte';
	import PageTitle from './page-title.svelte';
	import PageWrapper from './page-wrapper.svelte';

	type Props = {
		name?: string | null;
		title: string;
		lead?: string | null;
		logo?: string | null;
		children: Snippet;
	};

	let { name, title, lead, logo, children }: Props = $props();
</script>

<PageWrapper>
	<Container>
		<div>
			<a
				class="xs:mb-6 mb-4 inline-flex h-28 w-44 items-center sm:mb-12 sm:h-32 sm:w-56"
				href={localizeHref('/')}
			>
				{#if logo}
					<img src={logo} alt={title} class="max-h-full max-w-full object-contain" />
				{:else}
					<div class="py-2 text-2xl font-bold sm:text-4xl">
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
	</Container>
</PageWrapper>
