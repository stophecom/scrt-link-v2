<script lang="ts">
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import Hero from '$lib/components/elements/hero.svelte';
	import HowItWorks from '$lib/components/elements/how-it-works.svelte';
	import Section from '$lib/components/elements/section.svelte';
	import Head from '$lib/components/page/head.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Container from '$lib/components/ui/container/container.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
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
