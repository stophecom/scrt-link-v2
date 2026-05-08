<script lang="ts">
	import type { Snippet } from 'svelte';

	import AndroidFrame from '$lib/components/blocks/android-frame.svelte';
	import Hero from '$lib/components/blocks/hero.svelte';
	import PageWrapper from '$lib/components/blocks/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Props = {
		title: string;
		lead?: string;
		metaTitle?: string;
		metaDescription?: string;
		metaKeywords?: string;
		children: Snippet;
	};

	let { title, lead, metaTitle, metaDescription, metaKeywords, children }: Props = $props();
</script>

<PageWrapper metaTitle={metaTitle || title} {metaDescription} {metaKeywords}>
	<Hero {title} {lead} class="pt-12">
		{#snippet cta()}
			<Button size="lg" href={localizeHref('/pricing')}>{m.early_keen_eagle_trial()}</Button>
		{/snippet}
		<AndroidFrame class="origin-top max-sm:scale-50">
			<video autoplay loop muted playsinline>
				<source src="/videos/br3f-demo.mp4" type="video/mp4" />
			</video>
		</AndroidFrame>
	</Hero>

	{@render children()}
</PageWrapper>
