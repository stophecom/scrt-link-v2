<script lang="ts">
	import {
		Clock,
		Eye,
		Flame,
		FolderArchive,
		KeyRound,
		Link2,
		Lock,
		Mail,
		MessageSquare,
		Scale,
		ShieldCheck,
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
			icon: Mail,
			title: m.warm_steady_crane_thread(),
			description: m.brave_tidy_kiwi_archive()
		},
		{
			icon: FolderArchive,
			title: m.firm_calm_raven_store(),
			description: m.keen_wise_kite_trace()
		},
		{
			icon: KeyRound,
			title: m.plain_sharp_swan_hand(),
			description: m.wide_bright_falcon_leak()
		},
		{
			icon: MessageSquare,
			title: m.tidy_crisp_dove_draft(),
			description: m.brisk_plain_finch_copy()
		}
	];

	const workflow = [
		{
			icon: Lock,
			title: m.crisp_tidy_raven_seal(),
			description: m.fresh_firm_dove_wrap()
		},
		{
			icon: Link2,
			title: m.plain_calm_moth_link(),
			description: m.brave_keen_stoat_relay()
		},
		{
			icon: Flame,
			title: m.tidy_sharp_quail_burn(),
			description: m.steady_wise_ibis_clear()
		}
	];

	const features = [
		{
			icon: Scale,
			title: m.tight_bold_mink_bind(),
			description: m.bright_keen_gecko_keep()
		},
		{
			icon: ShieldCheck,
			title: m.silent_wide_koala_fold(),
			description: m.wide_plain_sparrow_stand()
		},
		{
			icon: Eye,
			title: m.kind_calm_owl_mark(),
			description: m.mild_sharp_deer_prove()
		},
		{
			icon: Clock,
			title: m.calm_firm_swan_set(),
			description: m.tidy_keen_pika_hold()
		},
		{
			icon: KeyRound,
			title: m.crisp_ready_crab_pair(),
			description: m.bright_plain_shark_cover()
		},
		{
			icon: UserPlus,
			title: m.brisk_tidy_duck_open(),
			description: m.plain_bright_ibex_join()
		}
	];
</script>

<Page
	title={m.firm_sharp_owl_serve()}
	lead={m.proud_swift_crane_hold()}
	metaTitle={m.grand_bold_falcon_cite()}
	metaDescription={m.terse_crisp_heron_carry()}
	metaKeywords={m.quick_sharp_swan_track()}
>
	<Section wide variant="card" title={m.clear_firm_stork_flag()} lead={m.ready_plain_swan_map()}>
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

	<Section title={m.clear_bold_hare_pass()} lead={m.trim_ready_swift_deliver()}>
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

	<Section wide variant="muted" title={m.stout_firm_heron_wall()}>
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
		title={m.bold_keen_heron_stop()}
		lead={m.brisk_firm_finch_start()}
	>
		<div class="flex flex-wrap gap-2">
			<Button size="lg" href={localizeHref('/signup')}>{m.large_smart_badger_beam()}</Button>
			<Button variant="secondary" size="lg" href={localizeHref('/pricing')}>
				{m.moving_quaint_buzzard_trip()}
			</Button>
		</div>
	</Section>
</Page>
