<script lang="ts">
	import { SquareArrowOutUpRight } from '@lucide/svelte';

	import ContactCta from '$lib/components/blocks/contact-cta.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import { Button } from '$lib/components/ui/button';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { Section } from '$lib/components/ui/section';
	import { blueskyUrl, linkedinUrl, santihansUrl } from '$lib/data/app';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	const companyLinks = [
		{ label: 'santihans.com', href: santihansUrl },
		{ label: 'LinkedIn', href: linkedinUrl },
		{ label: 'Bluesky', href: blueskyUrl }
	];
</script>

<Page
	title={m.polite_misty_jan_hint()}
	lead={m.such_bright_panther_rush()}
	metaDescription={m.safe_main_okapi_smile()}
	metaKeywords={m.topical_lost_beaver_bump()}
	class="pb-0"
	wide
>
	<Container variant="wide">
		<Markdown markdown={m.about_intro_body()} format={true} />
		<img
			src="/images/home.svg"
			alt=""
			aria-hidden="true"
			width="1700"
			height="450"
			class="mt-12 h-auto w-full"
		/>
	</Container>

	<Section variant="card" wide title={m.about_philosophy_title()}>
		<Markdown markdown={m.about_philosophy_body()} format={true} />
		<Button class="mt-6" href={localizeHref('/privacy')}>
			{m.about_privacy_cta()}
		</Button>
	</Section>

	<Section wide title={m.about_company_title()}>
		<Markdown markdown={m.about_company_body()} format={true} />

		<div class="mt-6 flex flex-wrap gap-x-6 gap-y-2">
			{#each companyLinks as link, i (i)}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="group hover:text-primary inline-flex items-center"
				>
					<span class="underline">{link.label}</span>
					<SquareArrowOutUpRight class="text-muted-foreground ms-2 h-4 w-4" />
				</a>
			{/each}
		</div>
	</Section>

	<ContactCta />
</Page>
