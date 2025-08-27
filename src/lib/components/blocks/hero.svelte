<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import { Container } from '$lib/components/ui/container';

	import PageLead from './page-lead.svelte';
	import PageTitle from './page-title.svelte';

	type Props = {
		title: string;
		lead?: string | Snippet;
		cta: Snippet;
		children: Snippet;
	};

	let { title, lead, children, cta, ...rest }: Props & SvelteHTMLElements['div'] = $props();
</script>

<Container variant="wide">
	<div
		{...rest}
		class={cn(
			'grid grid-rows-[min-content_250px] gap-6 overflow-hidden pt-20 pb-16 sm:grid-cols-[65%_1fr]  sm:grid-rows-none',
			rest.class
		)}
	>
		<div class="self-center">
			<PageTitle {title} />

			{#if lead}
				<PageLead {lead} renderAsHtml />
			{/if}

			{@render cta?.()}
		</div>
		<div>
			{@render children?.()}
		</div>
	</div>
</Container>
