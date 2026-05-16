<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import { Container } from '$lib/components/ui/container';
	import { m } from '$lib/paraglide/messages.js';

	import PageLead from '../blocks/page-lead.svelte';
	import PageTitle from '../blocks/page-title.svelte';
	import PageWrapper from '../blocks/page-wrapper.svelte';

	type Props = {
		title: string;
		lead?: string | Snippet;
		metaTitle?: string;
		metaDescription?: string;
		metaKeywords?: string;
		markNotTranslated?: boolean;
		children: Snippet;
		wide?: boolean;
	};

	let {
		title,
		lead,
		metaTitle,
		metaDescription = m.elegant_muddy_wren_value(),
		metaKeywords = m.wise_honest_otter_jump(),
		children,
		wide,
		...rest
	}: Props & SvelteHTMLElements['div'] = $props();
</script>

<PageWrapper
	metaTitle={metaTitle || title}
	{metaDescription}
	{metaKeywords}
	{...rest}
	class={cn('pt-12 pb-16', rest.class)}
>
	<Container variant={wide ? 'wide' : 'default'}>
		<PageTitle {title} class="text-center" />

		{#if lead}
			<PageLead {lead} renderAsHtml class="text-center" />
		{/if}
	</Container>
	{@render children?.()}
</PageWrapper>
