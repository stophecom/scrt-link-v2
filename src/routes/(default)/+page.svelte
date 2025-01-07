<script lang="ts">
	import { slide } from 'svelte/transition';

	import Page from '$lib/components/layout/page/page.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button } from '$lib/components/ui/button';
	import { generateBase64Token } from '$lib/crypo';
	import { generateUuid } from '$lib/web-crypto';

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

	let otp = $state('');
	let randomOtp = $state('');

	let uuid = $state('');
	let customToken = $state('');

	let updateOtp = () => {
		uuid = generateUuid();
		customToken = generateBase64Token();
	};
</script>

<Page title="Welcome">
	<div class="border p-3">
		<div>otp 6: {otp}</div>
		<div>random otp {randomOtp}</div>

		<div>UUID {uuid}</div>
		<div>Custom Token {customToken}</div>
		<div class="p-2">
			<Button onclick={() => updateOtp()}>Generate random OTP</Button>
		</div>
	</div>

	<Button variant="secondary" href="/account">Account</Button>

	<Accordion.Root class="w-full sm:max-w-[70%]" multiple>
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
</Page>
