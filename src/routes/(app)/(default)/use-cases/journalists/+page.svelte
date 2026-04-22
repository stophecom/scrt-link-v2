<script lang="ts">
	import {
		AtSign,
		EyeOff,
		Flame,
		HardDrive,
		Inbox,
		KeyRound,
		Link2,
		Lock,
		MapPin,
		MessagesSquare,
		Paperclip,
		ShieldCheck,
		Smartphone,
		UserX
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
			icon: MessagesSquare,
			title: m.brave_calm_stoat_back(),
			description: m.fresh_wise_marten_sync()
		},
		{
			icon: AtSign,
			title: m.plain_keen_vole_tag(),
			description: m.tidy_firm_bison_trail()
		},
		{
			icon: HardDrive,
			title: m.sharp_crisp_otter_file(),
			description: m.kind_bright_puma_touch()
		},
		{
			icon: Smartphone,
			title: m.warm_tidy_lynx_seize(),
			description: m.terse_sharp_hare_reveal()
		}
	];

	const workflow = [
		{
			icon: Lock,
			title: m.plain_brisk_raven_type(),
			description: m.fresh_bold_wren_encode()
		},
		{
			icon: Link2,
			title: m.tidy_firm_moth_drop(),
			description: m.brave_calm_dove_pass()
		},
		{
			icon: Flame,
			title: m.crisp_ready_quail_fade(),
			description: m.steady_keen_ibis_wipe()
		}
	];

	const features = [
		{
			icon: UserX,
			title: m.silent_plain_mink_hide(),
			description: m.bright_calm_gecko_mask()
		},
		{
			icon: MapPin,
			title: m.stout_firm_koala_root(),
			description: m.wide_keen_sparrow_host()
		},
		{
			icon: EyeOff,
			title: m.kind_sharp_swan_dim(),
			description: m.mild_ready_deer_blind()
		},
		{
			icon: KeyRound,
			title: m.tight_brisk_crab_layer(),
			description: m.bright_tidy_shark_gate()
		},
		{
			icon: Inbox,
			title: m.bold_sharp_owl_invite(),
			description: m.plain_warm_pika_collect()
		},
		{
			icon: Paperclip,
			title: m.brisk_firm_duck_attach(),
			description: m.plain_keen_ibex_upload()
		}
	];
</script>

<Page
	title={m.brave_sharp_falcon_reach()}
	lead={m.proud_keen_eagle_guard()}
	metaTitle={m.grand_firm_puma_scribe()}
	metaDescription={m.terse_bold_hawk_protect()}
	metaKeywords={m.quick_bright_owl_press()}
>
	<Section
		wide
		variant="card"
		title={m.clear_keen_otter_expose()}
		lead={m.ready_firm_fox_whisper()}
	>
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

	<Section title={m.clear_swift_hare_relay()} lead={m.trim_ready_robin_vanish()}>
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

	<Section wide variant="muted" title={m.stout_keen_heron_veil()}>
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
		title={m.bold_crisp_heron_shelter()}
		lead={m.brisk_keen_finch_source()}
	>
		<div class="flex flex-wrap gap-2">
			<Button size="lg" href={localizeHref('/signup')}>{m.large_smart_badger_beam()}</Button>
			<Button variant="secondary" size="lg" href={localizeHref('/pricing')}>
				{m.moving_quaint_buzzard_trip()}
			</Button>
		</div>
	</Section>
</Page>
