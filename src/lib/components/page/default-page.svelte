<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import Logo from '$lib/assets/images/logo.svg?component';
	import { cn } from '$lib/client/utils';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { Container } from '$lib/components/ui/container';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';

	import { emailSupport } from '../../data/app';
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
		markNotTranslated,
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
	class={cn('pb-16', rest.class)}
>
	<Container variant={wide ? 'wide' : 'default'}>
		<div>
			<a class="inline-flex" href={localizeHref('/')}>
				<Logo class="h-28 w-28 md:h-32 md:w-32" />
			</a>
		</div>

		<PageTitle {title} />

		{#if lead}
			<PageLead {lead} renderAsHtml />
		{/if}

		{#if markNotTranslated && getLocale() !== 'en'}
			<Alert class="mb-5" title={m.heroic_acidic_jurgen_dash()} variant="info">
				<div>
					{m.grassy_due_crab_cook()}
				</div>
				<a href="mailto:{emailSupport}">{emailSupport}</a>
			</Alert>
		{/if}
	</Container>
	{@render children?.()}
</PageWrapper>
