<script lang="ts">
	import { Body, Container, Head, Heading, Hr, Html, Img, Link, Text } from 'svelte-email-tailwind';

	import { getBaseUrl } from '$lib/constants';
	import { languageTag } from '$lib/paraglide/runtime.js';

	type Props = {
		message: string;
		email: string;
	};

	let { message = 'Empty', email }: Props = $props();
</script>

<Html lang={languageTag()} class="font-sans">
	<Head />
	<Body class="bg-background ">
		<Container class="py-12">
			<Img src={`${getBaseUrl()}/logo.png`} alt="Logo" width="140" height="140" />

			<Heading class="text-primary text-4xl ">Contact</Heading>

			<Text class="mb-10 leading-snug">Message from: {email}</Text>
			<Text class="mb-10 leading-snug">{message}</Text>

			<Hr class="border-border mt-8" />

			<Text class="text-muted text-xs">
				©{new Date().getFullYear()} scrt.link -
				<Link class="text-muted" href="{getBaseUrl()}/privacy-policy">Privacy Policy</Link>
			</Text>
		</Container>
	</Body>
</Html>
