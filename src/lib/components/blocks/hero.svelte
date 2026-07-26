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
		overline?: string;
		cta: Snippet;
		children: Snippet;
	};

	let { title, lead, overline, children, cta, ...rest }: Props & SvelteHTMLElements['div'] =
		$props();
</script>

<Container variant="wide">
	<div
		{...rest}
		class={cn(
			' grid grid-rows-[min-content_250px_min-content] gap-1 overflow-hidden pt-20 pb-16 sm:grid-cols-[65%_1fr] sm:grid-rows-none  sm:gap-6',
			rest.class
		)}
	>
		<div class="self-center">
			{#if overline}
				<div class="mb-1 text-lg font-medium">{overline}</div>
			{/if}
			<PageTitle {title} />

			{#if lead}
				<PageLead {lead} renderAsHtml />
			{/if}

			<div class="hidden sm:block">
				{@render cta?.()}
			</div>
		</div>
		<div class="overflow-clip">
			{@render children?.()}
		</div>
		<div class=" sm:hidden">
			{@render cta?.()}
		</div>
	</div>
</Container>
