<script lang="ts">
	import SecretTextForm from '$lib/components/forms/secret-text-form.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import Usps from '$lib/components/ui/usps';
	import { shortFaq } from '$lib/data/faq';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title="Share a secret" lead="…with a link that only works one time and then self-destructs.">
	<Card>
		<Tabs.Root value="text">
			<Tabs.List>
				<Tabs.Trigger value="text">{m.happy_dizzy_angelfish_stir()}</Tabs.Trigger>
				<Tabs.Trigger value="file">{m.nice_male_zebra_stop()}</Tabs.Trigger>
				<Tabs.Trigger value="redirect">{m.bad_royal_kudu_nudge()}</Tabs.Trigger>
				<Tabs.Trigger value="love-letter">Love Letter</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="text">
				<SecretTextForm form={data.form} baseUrl={data.baseUrl} user={data.user} />
			</Tabs.Content>
			<Tabs.Content value="file">File</Tabs.Content>
			<Tabs.Content value="redirect">Redirect</Tabs.Content>
			<Tabs.Content value="love-letter">Something else</Tabs.Content>
		</Tabs.Root>
	</Card>
	<Usps />

	<Section title="FAQ" lead={m.stock_keen_marten_commend()}>
		<Accordion items={shortFaq()} />

		<Button href="/faq">{m.white_top_warbler_buzz()}</Button>
	</Section>
</Page>
