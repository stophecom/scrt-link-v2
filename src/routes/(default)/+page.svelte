<script lang="ts">
	import { slide } from 'svelte/transition';

	import SecretTextForm from '$lib/components/forms/secret-text-form.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';

	const items = [
		{
			title: 'What is the meaning of life?',
			content:
				'To become a better person, to help others, and to leave the world a better place than you found it.'
		},
		{
			title: 'How do I become a better person?',
			content: 'Read books, listen to podcasts, and surround yourself with people who inspire you.'
		},
		{
			title: 'What is the best way to help others?',
			content: 'Give them your time, attention, and love.'
		}
	];

	import Usps from '$lib/components/ui/usps';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title="Share a secret" lead="…with a link that only works one time and then self-destructs.">
	<div class="w-full rounded border bg-card px-4 pb-8 pt-4 shadow-lg md:px-8">
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
	</div>
	<Usps />

	<Section title="FAQ" lead="Frequently asked questions.">
		<Accordion.Root class="mb-4 w-full" multiple>
			{#each items as item, i}
				<Accordion.Item value="${i}" class="border-dark-10 group border-b px-1.5">
					<Accordion.Trigger
						class="flex w-full flex-1 items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180 "
					>
						{item.title}
					</Accordion.Trigger>

					<Accordion.Content
						transition={slide}
						transitionConfig={{ duration: 200 }}
						class="pb-[25px] text-sm tracking-[-0.01em]"
					>
						{item.content}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
		<Button href="/faq">Read more</Button>
	</Section>
</Page>
