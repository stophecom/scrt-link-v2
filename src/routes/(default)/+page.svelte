<script lang="ts">
	import SecretForm, { type SecretType } from '$lib/components/forms/secret-form.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import Usps from '$lib/components/ui/usps';
	import { shortFaq } from '$lib/data/faq';
	import { privacyUsps } from '$lib/data/usps';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.lucky_warm_mayfly_engage()} lead={m.aloof_quaint_snail_pave()}>
	<Card>
		<Tabs.Root value="text" let:value>
			{@const secretType = value as SecretType}
			<Tabs.List>
				<Tabs.Trigger value="text">{m.happy_dizzy_angelfish_stir()}</Tabs.Trigger>
				<Tabs.Trigger value="file">{m.nice_male_zebra_stop()}</Tabs.Trigger>
				<Tabs.Trigger value="redirect">{m.bad_royal_kudu_nudge()}</Tabs.Trigger>
				<Tabs.Trigger value="love-letter">Love Letter</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value={secretType}>
				<SecretForm form={data.form} baseUrl={data.baseUrl} user={data.user} {secretType} />
			</Tabs.Content>
		</Tabs.Root>
	</Card>
	<Usps items={privacyUsps} />

	<Section title="FAQ" lead={m.stock_keen_marten_commend()}>
		<Accordion items={shortFaq()} />

		<Button href="/faq">{m.white_top_warbler_buzz()}</Button>
	</Section>
</Page>
