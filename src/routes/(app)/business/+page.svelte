<script lang="ts">
	import { Code } from 'lucide-svelte';

	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import FeatureCard from '$lib/components/elements/feature-card.svelte';
	import Hero from '$lib/components/elements/hero.svelte';
	import HowItWorks from '$lib/components/elements/how-it-works.svelte';
	import Section from '$lib/components/elements/section.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import Head from '$lib/components/page/head.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Container from '$lib/components/ui/container/container.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Markdown from '$lib/components/ui/markdown';
	import { businessFeatures } from '$lib/data/app';
	import clientModule from '$lib/data/docs/client-module.md?raw';
	import clientModuleResponse from '$lib/data/docs/client-module-response.md?raw';
	import { shortFaq } from '$lib/data/faq';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Head title={'foo'} metaDescription={'sdf'} metaKeywords={'sdf'} />
<Container variant={'wide'} class="min-h-screen pt-8 pb-16">
	<Hero
		title={'Secure sharing infrastructure for businesses'}
		lead={'Zero-trust architecture for sharing sensitive information with one-time links that self-destruct after viewing.'}
	>
		<div>
			<Button class="me-2" size="lg" variant="default" target="_blank" href="https://br3f.com"
				>Visit demo page</Button
			>
			<Button size="lg" variant="outline" href={localizeHref('/')}>Design yours</Button>
		</div>
	</Hero>

	<Section
		title="Business features"
		lead="Security and privacy for confidential data you share within your company."
	>
		<IntersectionObserver let:intersecting top={-50} once={true}>
			<div
				class="grid grid-rows-6 gap-4 sm:grid-cols-2 sm:grid-rows-3 md:grid-cols-3 md:grid-rows-2"
			>
				{#each businessFeatures() as step, i}
					<div
						style="transition-delay: {i * 100}ms;"
						class="flex transition-all {intersecting
							? 'translate-y-0 scale-100 opacity-100 duration-700'
							: 'translate-y-20 scale-90 opacity-0'}"
					>
						<FeatureCard Icon={step.icon} title={step.title} description={step.description} />
					</div>
				{/each}
			</div>
		</IntersectionObserver>
	</Section>

	<Section title="Integrate everywhere" lead="Developer first">
		<div class="mb-4 grid grid-cols-2 gap-4">
			<div>
				<h4 class="text-lg font-semibold">Usage</h4>
				<p>Client Module</p>
				<div class="border-border border p-2 text-sm">
					<Markdown markdown={clientModule} formatCode />
				</div>
			</div>
			<div>
				<h4 class="text-lg font-semibold">Response (JSON)</h4>
				<div class="border-border border p-2 text-sm">
					<Markdown markdown={clientModuleResponse} formatCode />
				</div>
			</div>
		</div>

		<Button href={localizeHref('/developers')}
			><Code class="me-2 h-4 w-4" /> View API-Documentation</Button
		>
	</Section>

	<div class="grid grid-cols-[1fr_400px]">
		<div>
			<Section title={'How it works'} lead={m.dirty_bright_robin_earn()}>
				<HowItWorks />
				<div class="pt-4">
					<Dialog.Root>
						<Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'lg' })}
							>Try yourself</Dialog.Trigger
						>
						<Dialog.Content class="">
							<Dialog.Header>
								<Dialog.Title>Create secret</Dialog.Title>
							</Dialog.Header>
							<CreateSecret form={data.secretForm} user={data.user} hideUsps />
						</Dialog.Content>
					</Dialog.Root>
				</div>
			</Section>

			<Section title={m.few_awful_chipmunk_trust()} lead={m.stock_keen_marten_commend()}>
				<Accordion items={shortFaq()} />

				<Button href={localizeHref('/faq')}>{m.white_top_warbler_buzz()}</Button>
			</Section>
		</div>
		<div>sdf</div>
	</div>
</Container>
