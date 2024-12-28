<script lang="ts">
	import Mail from 'lucide-svelte/icons/mail';
	import { slide } from 'svelte/transition';

	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button } from '$lib/components/ui/button';

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
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button variant="outline" href="/signup">Signup</Button>
<Button variant="secondary" href="/account">Account</Button>

<Button>
	<Mail class="mr-2 h-4 w-4" />
	Login with Email
</Button>

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
