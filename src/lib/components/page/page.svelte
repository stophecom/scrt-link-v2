<script lang="ts">
	import type { Snippet } from 'svelte';

	import Logo from '$lib/assets/images/logo.svg?component';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime';

	import { appName, emailSupport } from '../../data/app';

	type Props = {
		title: string;
		lead?: string | Snippet;
		metaTitle?: string;
		metaDescription?: string;
		metaKeywords?: string;
		markNotTranslated?: boolean;
		children: Snippet;
	};

	let {
		title,
		lead,
		metaTitle,
		metaDescription = m.elegant_muddy_wren_value(),
		metaKeywords = m.wise_honest_otter_jump(),
		markNotTranslated,
		children
	}: Props = $props();
</script>

<svelte:head>
	<title>{metaTitle || title} - {appName}</title>
	<meta property="og:title" content="{title} - {appName}" />
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={metaKeywords} />
</svelte:head>

<div class="container min-h-screen pt-8 pb-16">
	<div>
		<a class="inline-flex" href="/">
			<Logo class="h-28 w-28 md:h-32 md:w-32" />
		</a>
	</div>

	<h1
		class="gradient-text font-display mb-1 text-5xl leading-tight font-extrabold text-pretty md:text-6xl"
	>
		{title}
	</h1>

	{#if lead}
		<p class="mb-10 text-2xl leading-snug text-pretty md:text-3xl">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html lead}
		</p>
	{/if}

	{#if markNotTranslated && languageTag() !== 'en'}
		<Alert class="mb-5" title={m.heroic_acidic_jurgen_dash()} variant="info">
			<div>
				{m.grassy_due_crab_cook()}
			</div>
			<a href="mailto:{emailSupport}">{emailSupport}</a>
		</Alert>
	{/if}
	{@render children?.()}
</div>

<style>
	/* https://nerdy.dev/6-css-snippets-every-front-end-developer-should-know-in-2025#animated-adaptive-gradient-text */
	@property --color-1 {
		syntax: '<color>';
		inherits: false;
		initial-value: #000000;
	}

	@property --color-2 {
		syntax: '<color>';
		inherits: false;
		initial-value: #000000;
	}

	@keyframes color-change {
		50% {
			--color-1: var(--_color-1-to);
			--color-2: var(--_color-2-to);
		}
		100% {
			--color-1: var(--color-foreground);
			--color-2: var(--color-foreground);
		}
	}

	:global(.gradient-text) {
		--_space: ;

		--_color-1-from: var(--color-foreground);
		--_color-1-to: var(--color-primary);
		--_color-2-from: var(--color-primary);
		--_color-2-to: var(--color-foreground);

		--color-1: var(--_color-1-from);
		--color-2: var(--_color-2-from);

		animation: color-change 4s linear forwards alternate;

		background: linear-gradient(to right var(--_space), var(--color-1), var(--color-2));

		/* old browser support */
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;

		/* modern browser version */
		background-clip: text;
		color: transparent;
	}
</style>
