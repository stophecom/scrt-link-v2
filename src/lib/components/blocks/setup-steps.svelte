<script lang="ts">
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import { m } from '$lib/paraglide/messages.js';

	const steps = () => [
		{
			title: m.business_setup_step_signup_title(),
			description: m.business_setup_step_signup_description(),
			duration: m.business_setup_step_signup_duration()
		},
		{
			title: m.business_setup_step_domain_title(),
			description: m.business_setup_step_domain_description(),
			duration: m.business_setup_step_domain_duration()
		},
		{
			title: m.business_setup_step_publish_title(),
			description: m.business_setup_step_publish_description(),
			duration: m.business_setup_step_publish_duration()
		}
	];
</script>

<IntersectionObserver top={-50} once={true}>
	{#snippet children(intersecting: boolean)}
		<div class="grid gap-4 md:grid-cols-3">
			{#each steps() as step, i (step.title)}
				<div
					style="transition-delay: {i * 100}ms;"
					class="border-border bg-card flex flex-col rounded-lg border p-6 transition-all {intersecting
						? 'translate-y-0 scale-100 opacity-100 duration-700'
						: 'translate-y-10 scale-95 opacity-0'}"
				>
					<div class="mb-4 flex items-start justify-between gap-2">
						<span class="text-muted-foreground text-6xl font-medium tracking-wider uppercase">
							{String(i + 1).padStart(1, '0')}
						</span>
						<span class="bg-muted rounded px-2 py-1 text-xs font-semibold">
							{step.duration}
						</span>
					</div>

					<h3 class="mb-2 text-xl font-semibold">{step.title}</h3>
					<p class="text-muted-foreground text-pretty">{step.description}</p>
				</div>
			{/each}
		</div>
	{/snippet}
</IntersectionObserver>
