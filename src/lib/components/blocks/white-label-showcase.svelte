<script lang="ts">
	import {
		Building2,
		Globe,
		Image,
		Languages,
		Palette,
		SlidersHorizontal,
		Type,
		Users
	} from '@lucide/svelte';

	import FeatureCard from '$lib/components/blocks/feature-card.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import { m } from '$lib/paraglide/messages.js';

	const options = [
		{
			icon: Globe,
			title: m.business_customize_domain_title(),
			description: m.business_customize_domain_description()
		},
		{
			icon: Image,
			title: m.business_customize_logo_title(),
			description: m.business_customize_logo_description()
		},
		{
			icon: Palette,
			title: m.business_customize_colors_title(),
			description: m.business_customize_colors_description()
		},
		{
			icon: Type,
			title: m.business_customize_words_title(),
			description: m.business_customize_words_description()
		},
		{
			icon: SlidersHorizontal,
			title: m.business_customize_features_title(),
			description: m.business_customize_features_description()
		},
		{
			icon: Languages,
			title: m.business_customize_language_title(),
			description: m.business_customize_language_description()
		}
	];

	const audiences = [
		{
			icon: Users,
			title: m.business_audience_employees_title(),
			description: m.business_audience_employees_description()
		},
		{
			icon: Building2,
			title: m.business_audience_customers_title(),
			description: m.business_audience_customers_description()
		}
	];
</script>

<IntersectionObserver top={-50} once={true}>
	{#snippet children(intersecting: boolean)}
		<div
			class="mb-10 grid grid-rows-6 gap-4 sm:grid-cols-2 sm:grid-rows-3 md:grid-cols-3 md:grid-rows-2"
		>
			{#each options as option, i (i)}
				<div
					style="transition-delay: {i * 80}ms;"
					class="flex transition-all {intersecting
						? 'translate-y-0 scale-100 opacity-100 duration-700'
						: 'translate-y-20 scale-90 opacity-0'}"
				>
					<FeatureCard Icon={option.icon} title={option.title} description={option.description} />
				</div>
			{/each}
		</div>
	{/snippet}
</IntersectionObserver>

<div class="grid gap-4 sm:grid-cols-2">
	{#each audiences as audience (audience.title)}
		<div class="border-border bg-card flex flex-col gap-3 rounded-lg border p-6">
			<audience.icon class="h-8 w-8" strokeWidth="1.5px" />
			<h3 class="text-xl font-bold">{audience.title}</h3>
			<p class="text-muted-foreground text-pretty">{audience.description}</p>
		</div>
	{/each}
</div>
