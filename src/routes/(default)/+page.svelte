<script lang="ts">
	import { slide } from 'svelte/transition';

	import SecretTextForm from '$lib/components/forms/secret-text-form.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card';
	import Markdown from '$lib/components/ui/markdown';
	import * as Tabs from '$lib/components/ui/tabs';
	import Usps from '$lib/components/ui/usps';
	import { shortFaq } from '$lib/data/faq';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title="Share a secret" lead="…with a link that only works one time and then self-destructs.">
	<Card>
		<Tabs.Root value="text">
			<Tabs.List>
				<Tabs.Trigger value="text">Text</Tabs.Trigger>
				<Tabs.Trigger value="file">File</Tabs.Trigger>
				<Tabs.Trigger value="redirect">Redirect</Tabs.Trigger>
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

	<Section title="FAQ" lead="Frequently asked questions.">
		<Accordion.Root class="mb-4 w-full" multiple>
			{#each shortFaq() as item, i}
				<Accordion.Item value="${i}" class="border-dark-10 group border-b px-1.5">
					<Accordion.Trigger
						class="flex w-full flex-1 items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180 "
					>
						{item.heading}
					</Accordion.Trigger>

					<Accordion.Content
						transition={slide}
						transitionConfig={{ duration: 200 }}
						class="pb-[25px] text-sm tracking-[-0.01em]"
					>
						<Markdown markdown={item.body} />
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
		<Button href="/faq">Read more</Button>
	</Section>
</Page>
