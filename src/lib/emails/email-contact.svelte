<script lang="ts">
	import { Body, Container, Head, Heading, Html, Img, Text } from 'svelte-email-tailwind';

	import { getBaseUrl } from '$lib/constants';
	import { getLocale } from '$lib/paraglide/runtime.js';

	type Props = {
		message: string;
		email: string;
	};

	let { message = 'Empty', email }: Props = $props();
</script>

<Html lang={getLocale()} class="font-sans">
	<Head />
	<Body class="bg-background ">
		<Container class="py-12">
			<Img src={`${getBaseUrl()}/logo.png`} alt="Logo" width="140" height="140" />

			<Heading class="text-primary text-4xl ">Contact</Heading>

			<Text class="mb-10 leading-snug">Message from: {email}</Text>
			<Text class="mb-10 leading-snug">{message}</Text>
		</Container>
	</Body>
</Html>
