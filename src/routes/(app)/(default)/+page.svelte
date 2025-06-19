<script lang="ts">
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	import UrlExplained from '$lib/assets/images/illustrations/url-explained.svg?component';
	import CreateSecret from '$lib/components/blocks/create-secret.svelte';
	import HowItWorks from '$lib/components/blocks/how-it-works.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { Section } from '$lib/components/ui/section';
	import { shortFaq } from '$lib/data/faq';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.lucky_warm_mayfly_engage()} lead={m.aloof_quaint_snail_pave()}>
	<Container class="mb-12">
		<CreateSecret form={data.secretForm} user={data.user} />
	</Container>
	<Section title={m.full_minor_fireant_accept()} lead={m.dirty_bright_robin_earn()}>
		<HowItWorks />
	</Section>

	<Section title={m.flat_zany_baboon_adapt()} lead={m.royal_odd_ox_read()}>
		<IntersectionObserver let:intersecting top={-100} once={true}>
			<div
				class="flex transition-all {intersecting
					? 'translate-y-0 opacity-100 duration-500'
					: 'translate-y-10 opacity-0'}"
			>
				<Card class="mb-2">
					<UrlExplained />
					{m.equal_elegant_herring_yell()}
				</Card>
			</div>
		</IntersectionObserver>
		<Button variant="ghost" href={localizeHref('/security')}
			>{m.happy_plain_panther_fry()}<ArrowRight class="ms-2 h-4 w-4" /></Button
		>
	</Section>

	<Section title={m.few_awful_chipmunk_trust()} lead={m.stock_keen_marten_commend()}>
		<Accordion items={shortFaq()} />

		<Button href={localizeHref('/faq')}>{m.white_top_warbler_buzz()}</Button>
	</Section>
</Page>
