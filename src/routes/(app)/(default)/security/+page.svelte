<script lang="ts">
	import {
		Check,
		CodeXml,
		Layers,
		Lock,
		Minus,
		Radar,
		RefreshCw,
		ScanSearch,
		ShieldAlert,
		ShieldCheck,
		SquareArrowOutUpRight
	} from '@lucide/svelte';

	import FaqSection from '$lib/components/blocks/faq-section.svelte';
	import FeatureCard from '$lib/components/blocks/feature-card.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { Section } from '$lib/components/ui/section';
	import securityAndPrivacy from '$lib/data/faq/securityAndPrivacy';
	import { m } from '$lib/paraglide/messages.js';

	const badges = [
		{
			label: 'Security Headers',
			href: 'https://securityheaders.com/?q=scrt.link&followRedirects=on',
			grade: 'A+'
		},
		{
			label: 'Mozilla Observatory',
			href: 'https://developer.mozilla.org/en-US/observatory/analyze?host=scrt.link',
			grade: 'A+'
		},
		{
			label: 'SSL Labs',
			href: 'https://www.ssllabs.com/ssltest/analyze.html?d=scrt.link',
			grade: 'A+'
		}
	];

	const riskScans = [
		{
			label: 'Sucuri',
			href: 'https://sitecheck.sucuri.net/results/scrt.link',
			grade: 'Low'
		},
		{
			label: 'Pentest Tools',
			href: 'https://pentest-tools.com/website-vulnerability-scanning/website-scanner',
			grade: 'Low'
		}
	];

	const securityCards = () => [
		{
			Icon: ShieldAlert,
			title: m.bold_safe_wolf_trust(),
			description: m.bold_safe_wolf_describe()
		},
		{ Icon: Lock, title: m.firm_clear_lock_secure(), description: m.firm_clear_lock_describe() },
		{ Icon: Layers, title: m.small_keen_fox_shrink(), description: m.small_keen_fox_describe() },
		{
			Icon: RefreshCw,
			title: m.fresh_brisk_heron_update(),
			description: m.fresh_brisk_heron_describe()
		},
		{
			Icon: CodeXml,
			title: m.open_clear_crane_share(),
			description: m.open_clear_crane_describe()
		},
		{ Icon: ScanSearch, title: m.smart_safe_hawk_scan(), description: m.smart_safe_hawk_describe() }
	];

	const providers = () => [
		{
			name: 'Vercel Inc.',
			href: 'https://vercel.com',
			role: m.real_safe_crow_host(),
			iso27001: true,
			gdpr: true,
			soc2: true
		},
		{
			name: 'Neon Inc.',
			href: 'https://neon.tech',
			role: m.real_safe_crow_database(),
			iso27001: true,
			gdpr: true,
			soc2: true
		},
		{
			name: 'Flow Swiss AG',
			href: 'https://flow.swiss',
			role: m.real_safe_crow_storage(),
			iso27001: true,
			gdpr: true,
			soc2: false
		}
	];
</script>

<Page
	title={m.nice_last_quail_pop()}
	lead={m.day_green_skunk_renew()}
	metaDescription={m.alert_royal_coyote_aid()}
	metaKeywords={m.awful_ideal_monkey_stab()}
	class="pb-0"
	wide
>
	<Container variant="wide">
		<Markdown markdown={m.actual_patient_giraffe_rest()} format={true} />
	</Container>

	<Section wide>
		<h3 class="mb-2 font-semibold">{m.clean_live_bear_verify()}</h3>
		<div class="mb-8 grid max-w-200 grid-cols-2 gap-3 sm:grid-cols-3">
			{#each badges as badge, i (i)}
				<a
					href={badge.href}
					target="_blank"
					rel="noopener noreferrer"
					class="border-success bg-success/5 hover:bg-success/10 grid shrink-0 grid-cols-[1fr_min-content_min-content] items-center gap-4 rounded border p-2 transition-colors duration-300"
				>
					<div class="flex items-center gap-3">
						<ShieldCheck class="text-success h-5 w-5 shrink-0" />
						<span class="inline-flex items-center text-sm font-medium">{badge.label}</span>
					</div>
					<SquareArrowOutUpRight class="text-muted-foreground ms-2 h-4 w-4" />
					<div class="bg-success/20 text-success rounded p-2 text-xl font-bold">{badge.grade}</div>
				</a>
			{/each}
		</div>
		<h3 class="mb-2 font-semibold">{m.early_mad_mole_assess()}</h3>
		<div class="grid max-w-200 grid-cols-2 gap-3 sm:grid-cols-3">
			{#each riskScans as scan, i (i)}
				<a
					href={scan.href}
					target="_blank"
					rel="noopener noreferrer"
					class="border-info bg-info/5 hover:bg-info/10 grid shrink-0 grid-cols-[1fr_min-content_min-content] items-center gap-4 rounded border p-2 transition-colors duration-300"
				>
					<div class="flex items-center gap-3">
						<Radar class="text-info ms-2 h-4 w-4" />

						<span class="inline-flex items-center text-sm font-medium">{scan.label}</span>
					</div>

					<SquareArrowOutUpRight class="text-muted-foreground ms-2 h-4 w-4" />
					<div class="bg-info/20 text-info rounded p-2 text-lg font-bold">{scan.grade}</div>
				</a>
			{/each}
		</div>
		<p class="text-muted-foreground mt-3 text-sm">{m.tired_just_wolf_audit()}</p>
	</Section>

	<Section variant="card" wide title={m.keen_safe_hawk_guard()}>
		<div class="grid gap-6 pt-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
			{#each securityCards() as card, i (i)}
				<FeatureCard Icon={card.Icon} title={card.title} description={card.description} />
			{/each}
		</div>
	</Section>

	<Section
		wide
		variant="default"
		title={m.plain_safe_bear_host()}
		lead={m.plain_safe_bear_describe()}
	>
		<div class="max-w-200 overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-border border-b">
						<th class="py-3 pr-6 text-left font-semibold">{m.real_safe_crow_name()}</th>
						<th class="px-4 py-3 text-left font-semibold">{m.real_safe_crow_role()}</th>
						<th class="px-4 py-3 text-center font-semibold">ISO 27001</th>
						<th class="px-4 py-3 text-center font-semibold">GDPR</th>
						<th class="px-4 py-3 text-center font-semibold">SOC 2 Type II</th>
					</tr>
				</thead>
				<tbody>
					{#each providers() as p, i (i)}
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
							<td class="text-muted-foreground px-4 py-3">{p.role}</td>
							<td class="px-4 py-3 text-center">
								{#if p.iso27001}
									<Check class="text-success mx-auto h-4 w-4" />
								{:else}
									<Minus class="text-muted-foreground mx-auto h-4 w-4" />
								{/if}
							</td>
							<td class="px-4 py-3 text-center">
								{#if p.gdpr}
									<Check class="text-success mx-auto h-4 w-4" />
								{:else}
									<Minus class="text-muted-foreground mx-auto h-4 w-4" />
								{/if}
							</td>
							<td class="px-4 py-3 text-center">
								{#if p.soc2}
									<Check class="text-success mx-auto h-4 w-4" />
								{:else}
									<Minus class="text-muted-foreground mx-auto h-4 w-4" />
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Section>

	<FaqSection items={securityAndPrivacy()} variant="card" />
	<Section wide title={m.civil_safe_hawk_report()}>
		<Markdown markdown={m.civil_safe_hawk_body()} />
	</Section>
</Page>
