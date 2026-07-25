<script lang="ts">
	import { ArrowRight, LifeBuoy, Newspaper, Scale, ShieldCheck } from '@lucide/svelte';

	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import { Section } from '$lib/components/ui/section';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	const useCases = () => [
		{
			icon: ShieldCheck,
			title: m.business_use_case_it_security_title(),
			description: m.business_use_case_it_security_description(),
			href: localizeHref('/use-cases/it-security')
		},
		{
			icon: LifeBuoy,
			title: m.business_use_case_customer_support_title(),
			description: m.business_use_case_customer_support_description(),
			href: localizeHref('/use-cases/customer-support')
		},
		{
			icon: Scale,
			title: m.business_use_case_legal_title(),
			description: m.business_use_case_legal_description(),
			href: localizeHref('/use-cases/legal-compliance')
		},
		{
			icon: Newspaper,
			title: m.business_use_case_journalists_title(),
			description: m.business_use_case_journalists_description(),
			href: localizeHref('/use-cases/journalists')
		}
	];
</script>

<Section wide title={m.business_use_cases_title()} lead={m.business_use_cases_lead()}>
	<IntersectionObserver top={-50} once={true}>
		{#snippet children(intersecting: boolean)}
			<div class="grid gap-4 sm:grid-cols-2">
				{#each useCases() as useCase, i (useCase.title)}
					<a
						href={useCase.href}
						style="transition-delay: {i * 80}ms;"
						class="border-border bg-card hover:border-foreground/30 group flex flex-col gap-3 rounded-lg border p-6 transition-all {intersecting
							? 'translate-y-0 scale-100 opacity-100 duration-700'
							: 'translate-y-10 scale-95 opacity-0'}"
					>
						<useCase.icon class="h-8 w-8" strokeWidth="1.5px" />
						<h3 class="text-xl font-bold">{useCase.title}</h3>
						<p class="text-muted-foreground text-pretty">{useCase.description}</p>
						<span class="mt-auto inline-flex items-center pt-2 text-sm font-semibold">
							{m.business_use_cases_link()}
							<ArrowRight class="ms-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</span>
					</a>
				{/each}
			</div>
		{/snippet}
	</IntersectionObserver>
</Section>
