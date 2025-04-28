<script lang="ts">
	import {
		Body,
		Button,
		Container,
		Head,
		Heading,
		Hr,
		Html,
		Img,
		Link,
		Text
	} from 'svelte-email-tailwind';

	import { getBaseUrl } from '$lib/constants';
	import { appName } from '$lib/data/app';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	type Props = {
		name?: string;
	};

	let { name = '' }: Props = $props();
</script>

<Html lang={getLocale()} class="font-sans">
	<Head />
	<Body class="bg-background ">
		<Container class="py-12">
			<Img src={`${getBaseUrl()}/logo.png`} alt="Logo" width="140" height="140" />

			<Heading class="text-primary text-4xl ">{name ? 'Hi {name}' : 'Hi'}</Heading>

			<Text class="mb-4 text-xl leading-snug"
				>Welcome aboard! We're here to help you share confidential information in the most secure
				way possible: <strong>End-to-end encrypted. Ephemeral. Without a trace.</strong>
			</Text>

			<Text class="mb-10 text-lg">
				Stop worrying about leaks or breaches. Whether it's passwords, access tokens, sensitive
				notes or documents, we've got you covered. Need extra security? Explore our premium plans
				for advanced protection.</Text
			>

			<Button
				class="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap "
				href={`${getBaseUrl()}?`}>Share a secret</Button
			>

			<Button
				class="bg-background text-foreground border-foreground inline-flex items-center justify-center rounded-md border  px-4 py-2 text-sm font-medium whitespace-nowrap "
				href={`${getBaseUrl()}?`}>See plans</Button
			>

			<Hr class="border-border mt-8" />

			<Text class="text-muted text-xs">
				©{new Date().getFullYear()}
				{appName} -
				<Link class="text-muted" href="{getBaseUrl()}/privacy-policy"
					>{m.crazy_jumpy_mouse_hush()}</Link
				>
			</Text>
		</Container>
	</Body>
</Html>
