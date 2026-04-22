<script lang="ts">
	import {
		BellRing,
		Clock,
		Code2,
		Flame,
		Inbox,
		KeyRound,
		Link2,
		Lock,
		MessageSquare,
		ShieldCheck,
		Ticket,
		UserPlus
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
			icon: MessageSquare,
			title: m.vivid_gentle_mole_warn(),
			description: m.brave_rough_seal_keep()
		},
		{
			icon: Inbox,
			title: m.tidy_wise_dove_send(),
			description: m.keen_smart_wolf_search()
		},
		{
			icon: Ticket,
			title: m.warm_brisk_finch_log(),
			description: m.fresh_keen_bear_linger()
		},
		{
			icon: UserPlus,
			title: m.firm_kind_stork_onboard(),
			description: m.plain_steady_lark_rotate()
		}
	];

	const workflow = [
		{
			icon: Lock,
			title: m.crisp_bold_raven_lock(),
			description: m.fresh_deft_wren_seal()
		},
		{
			icon: Link2,
			title: m.plain_firm_moth_share(),
			description: m.brave_nimble_stoat_send()
		},
		{
			icon: Flame,
			title: m.tidy_brisk_quail_burn(),
			description: m.steady_plain_ibis_vanish()
		}
	];

	const features = [
		{
			icon: KeyRound,
			title: m.tight_keen_mink_lock(),
			description: m.bright_firm_gecko_guard()
		},
		{
			icon: ShieldCheck,
			title: m.silent_stark_koala_blind(),
			description: m.wide_deft_sparrow_trust()
		},
		{
			icon: BellRing,
			title: m.kind_sharp_owl_record(),
			description: m.mild_keen_deer_note()
		},
		{
			icon: ShieldCheck,
			title: m.calm_proud_swan_host(),
			description: m.tidy_warm_pika_protect()
		},
		{
			icon: Code2,
			title: m.crisp_apt_crab_wire(),
			description: m.bright_deft_shark_stitch()
		},
		{
			icon: Clock,
			title: m.brisk_soft_duck_tick(),
			description: m.plain_ready_ibex_expire()
		}
	];
</script>

<Page
	title={m.bold_clean_badger_guard()}
	lead={m.brisk_firm_lynx_defend()}
	metaTitle={m.grand_sharp_puma_rank()}
	metaDescription={m.terse_sharp_hawk_watch()}
	metaKeywords={m.quick_stark_owl_spot()}
>
	<Section wide variant="card" title={m.clear_sharp_otter_notice()} lead={m.ready_calm_fox_close()}>
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

	<Section title={m.clear_steady_hare_hand()} lead={m.trim_brisk_swift_reach()}>
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

	<Section wide variant="muted" title={m.stout_calm_heron_shield()}>
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
		title={m.bold_crisp_heron_stop()}
		lead={m.brisk_terse_finch_link()}
	>
		<div class="flex flex-wrap gap-2">
			<Button size="lg" href={localizeHref('/signup')}>{m.large_smart_badger_beam()}</Button>
			<Button variant="secondary" size="lg" href={localizeHref('/pricing')}>
				{m.moving_quaint_buzzard_trip()}
			</Button>
		</div>
	</Section>
</Page>
