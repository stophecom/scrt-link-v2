<script lang="ts">
	import {
		BellRing,
		Clock,
		Code2,
		Flame,
		Globe,
		Image,
		Inbox,
		Link2,
		Lock,
		MessageCircle,
		ShieldAlert,
		ShieldCheck,
		Ticket
	} from '@lucide/svelte';

	import FeatureCard from '$lib/components/blocks/feature-card.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Section } from '$lib/components/ui/section';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	const painPoints = [
		{
			icon: Ticket,
			title: m.warm_firm_beetle_paste(),
			description: m.brave_plain_raccoon_index()
		},
		{
			icon: Image,
			title: m.tidy_crisp_mole_frame(),
			description: m.sharp_keen_stoat_peek()
		},
		{
			icon: MessageCircle,
			title: m.plain_bold_bison_chat(),
			description: m.fresh_warm_beaver_drop()
		},
		{
			icon: ShieldAlert,
			title: m.firm_calm_gopher_audit(),
			description: m.keen_sharp_ferret_flag()
		}
	];

	const workflow = [
		{
			icon: Lock,
			title: m.crisp_tidy_wren_craft(),
			description: m.fresh_firm_marten_sign()
		},
		{
			icon: Link2,
			title: m.plain_brisk_robin_forward(),
			description: m.brave_keen_crane_separate()
		},
		{
			icon: Flame,
			title: m.tidy_bold_stoat_destroy(),
			description: m.steady_firm_kite_erase()
		}
	];

	const features = [
		{
			icon: ShieldCheck,
			title: m.tight_warm_badger_certify(),
			description: m.bright_ready_gecko_scope()
		},
		{
			icon: Inbox,
			title: m.silent_keen_puma_receive(),
			description: m.wide_firm_sparrow_accept()
		},
		{
			icon: Globe,
			title: m.kind_sharp_ibis_brand(),
			description: m.mild_crisp_deer_domain()
		},
		{
			icon: Code2,
			title: m.calm_tidy_otter_integrate(),
			description: m.plain_warm_ibex_connect()
		},
		{
			icon: BellRing,
			title: m.crisp_bold_heron_notify(),
			description: m.bright_tidy_shark_close()
		},
		{
			icon: Clock,
			title: m.brisk_plain_duck_expire(),
			description: m.plain_ready_kite_limit()
		}
	];
</script>

<Page
	title={m.kind_firm_bear_share()}
	lead={m.proud_warm_seal_assist()}
	metaTitle={m.grand_keen_puma_support()}
	metaDescription={m.terse_bright_hawk_help()}
	metaKeywords={m.quick_tidy_owl_desk()}
>
	<Section wide variant="card" title={m.clear_warm_otter_leak()} lead={m.ready_firm_fox_tools()}>
		<IntersectionObserver top={-50} once={true}>
			{#snippet children(intersecting)}
				<div class="grid gap-4 md:grid-cols-2">
					{#each painPoints as item, i (item.title)}
						<div
							style="transition-delay: {i * 80}ms;"
							class="flex transition-all {intersecting
								? 'translate-y-0 scale-100 opacity-100 duration-700'
								: 'translate-y-10 scale-95 opacity-0'}"
						>
							<FeatureCard Icon={item.icon} title={item.title} description={item.description} />
						</div>
					{/each}
				</div>
			{/snippet}
		</IntersectionObserver>
	</Section>

	<Section title={m.clear_tidy_hare_deliver()} lead={m.trim_keen_swift_ship()}>
		<div class="grid gap-4 md:grid-cols-3">
			{#each workflow as step, i (step.title)}
				<div class="bg-muted/30 rounded-lg p-6">
					<div class="text-muted-foreground mb-3 text-sm font-medium tracking-wider uppercase">
						{String(i + 1).padStart(2, '0')}
					</div>
					<div class="bg-muted mb-4 inline-flex rounded p-2">
						<step.icon class="h-5 w-5" />
					</div>
					<h3 class="mb-2 text-xl font-semibold">{step.title}</h3>
					<p class="text-muted-foreground">{step.description}</p>
				</div>
			{/each}
		</div>
	</Section>

	<Section wide variant="muted" title={m.stout_bold_heron_equip()}>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each features as feat (feat.title)}
				<FeatureCard Icon={feat.icon} title={feat.title} description={feat.description} />
			{/each}
		</div>
	</Section>

	<Section
		wide
		Icon={ShieldCheck}
		variant="contrast"
		title={m.bold_firm_heron_solve()}
		lead={m.brisk_bright_finch_ship()}
	>
		<div class="flex flex-wrap gap-2">
			<Button size="lg" href={localizeHref('/signup')}>{m.large_smart_badger_beam()}</Button>
			<Button variant="secondary" size="lg" href={localizeHref('/pricing')}>
				{m.moving_quaint_buzzard_trip()}
			</Button>
		</div>
	</Section>
</Page>
