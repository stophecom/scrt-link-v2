<script lang="ts">
	import {
		Check,
		CodeXml,
		EyeOff,
		Lock,
		Minimize2,
		SquareArrowOutUpRight,
		Timer,
		VenetianMask
	} from '@lucide/svelte';

	import FaqSection from '$lib/components/blocks/faq-section.svelte';
	import FeatureCard from '$lib/components/blocks/feature-card.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import { Button } from '$lib/components/ui/button';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { Section } from '$lib/components/ui/section';
	import privacy from '$lib/data/faq/privacy';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	const principleCards = () => [
		{
			Icon: Minimize2,
			title: m.privacy_principle_minimal_title(),
			description: m.privacy_principle_minimal_desc()
		},
		{
			Icon: Lock,
			title: m.privacy_principle_encryption_title(),
			description: m.privacy_principle_encryption_desc()
		},
		{
			Icon: EyeOff,
			title: m.privacy_principle_tracking_title(),
			description: m.privacy_principle_tracking_desc()
		},
		{
			Icon: VenetianMask,
			title: m.privacy_principle_anonymous_title(),
			description: m.privacy_principle_anonymous_desc()
		},
		{
			Icon: Timer,
			title: m.privacy_principle_ephemeral_title(),
			description: m.privacy_principle_ephemeral_desc()
		},
		{
			Icon: CodeXml,
			title: m.privacy_principle_opensource_title(),
			description: m.privacy_principle_opensource_desc()
		}
	];

	const processors = () => [
		{
			name: 'Flow Swiss',
			href: 'https://flow.swiss',
			purpose: m.real_safe_crow_storage(),
			region: 'CH',
			gdpr: true
		},
		{
			name: 'Neon',
			href: 'https://neon.tech/privacy-policy',
			purpose: m.real_safe_crow_database(),
			region: 'US',
			gdpr: true
		},
		{
			name: 'Brevo',
			href: 'https://www.brevo.com/legal/privacypolicy/',
			purpose: m.privacy_processor_brevo(),
			region: 'EU',
			gdpr: true
		},
		{
			name: 'Plausible',
			href: 'https://plausible.io',
			purpose: m.privacy_processor_plausible(),
			region: 'EU',
			gdpr: true
		},
		{
			name: 'Vercel',
			href: 'https://vercel.com/legal/privacy-policy',
			purpose: m.real_safe_crow_host(),
			region: 'Global',
			gdpr: true
		},
		{
			name: 'Stripe',
			href: 'https://stripe.com/privacy',
			purpose: m.privacy_processor_stripe(),
			region: 'Global',
			gdpr: true
		},

		{
			name: 'Google',
			href: 'https://policies.google.com/privacy',
			purpose: m.privacy_processor_google(),
			region: 'Global',
			gdpr: true
		}
	];
</script>

<Page
	title={m.awake_frail_kitten_hush()}
	lead={m.privacy_lead()}
	metaDescription={m.privacy_meta_description()}
	metaKeywords={m.quick_sunny_ocelot_roam()}
	class="pb-0"
	wide
>
	<Container variant="wide">
		<Markdown markdown={m.privacy_intro()} format={true} />
		<img
			src="/images/alps.svg"
			alt=""
			aria-hidden="true"
			width="1700"
			height="450"
			class="mt-12 h-auto w-full"
		/>
	</Container>

	<Section variant="card" wide title={m.privacy_principles_title()}>
		<div class="grid gap-6 pt-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
			{#each principleCards() as card, i (i)}
				<FeatureCard Icon={card.Icon} title={card.title} description={card.description} />
			{/each}
		</div>
	</Section>

	<Section
		wide
		variant="default"
		title={m.privacy_processors_title()}
		lead={m.privacy_processors_lead()}
	>
		<div class="max-w-200 overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-border border-b">
						<th class="py-3 pr-6 text-left font-semibold">{m.privacy_processors_col_service()}</th>
						<th class="px-4 py-3 text-left font-semibold">{m.privacy_processors_col_purpose()}</th>
						<th class="px-4 py-3 text-center font-semibold">{m.privacy_processors_col_region()}</th>
						<th class="px-4 py-3 text-center font-semibold">GDPR</th>
					</tr>
				</thead>
				<tbody>
					{#each processors() as p, i (i)}
						<tr class="border-border border-b last:border-0">
							<td class="py-3 pr-6 font-medium">
								<a
									href={p.href}
									target="_blank"
									rel="noopener noreferrer"
									class="group hover:text-primary inline-flex items-center"
									><span class="underline">{p.name}</span><SquareArrowOutUpRight
										class="text-muted-foreground ms-2 h-4 w-4"
									/>
								</a>
							</td>
							<td class="text-muted-foreground px-4 py-3">{p.purpose}</td>
							<td class="px-4 py-3 text-center">{p.region}</td>
							<td class="px-4 py-3 text-center">
								{#if p.gdpr}
									<Check class="text-success mx-auto h-4 w-4" />
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="text-muted-foreground mt-3 max-w-200 text-sm">{m.privacy_processors_note()}</p>
	</Section>

	<FaqSection items={privacy()} variant="card" />

	<Section wide title={m.privacy_policy_cta_title()} lead={m.privacy_policy_cta_lead()}>
		<Button href={localizeHref('/privacy-policy')}>{m.calm_brave_otter_read()}</Button>
	</Section>
</Page>
