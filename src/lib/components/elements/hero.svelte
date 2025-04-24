<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import { Container } from '$lib/components/ui/container';

	import PageLead from '../page/page-lead.svelte';
	import PageTitle from '../page/page-title.svelte';

	type Props = {
		title: string;
		lead?: string | Snippet;
		cta: Snippet;
		children: Snippet;
	};

	let { title, lead, children, cta, ...rest }: Props & SvelteHTMLElements['div'] = $props();
</script>

<Container variant="wide">
	<div {...rest} class={cn('grid grid-cols-[65%_1fr] gap-6 pt-20 pb-16', rest.class)}>
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
