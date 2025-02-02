<script lang="ts">
	import { Body, Container, Head, Heading, Hr, Html, Img, Link, Text } from 'svelte-email-tailwind';

	import { getBaseUrl } from '$lib/constants';
	import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime.js';

	type Props = {
		receiptId: string;
	};

	let { receiptId = 'ABC123' }: Props = $props();
</script>

<Html lang={languageTag()} class="font-sans">
	<Head />
	<Body class="bg-background ">
		<Container class="py-12">
			<Img src={`${getBaseUrl()}/logo.png`} alt="Logo" width="140" height="140" />

			<Heading class="text-4xl text-primary ">{m.novel_cool_moth_dazzle()} 🔥</Heading>

			<Text class="mb-4 text-xl leading-snug ">T{m.soft_frail_wolf_fear()}</Text>
			<Text class="mb-10 text-xl leading-snug"><code>{receiptId}</code></Text>

			<Text class="text-muted">{m.ideal_aloof_mayfly_thrive()}</Text>

			<Hr class="mt-8 border-border" />

			<Text class="text-xs text-muted">
				©{new Date().getFullYear()} scrt.link -
				<Link class="text-muted" href="{getBaseUrl()}/privacy-policy">Privacy Policy</Link>
			</Text>
		</Container>
	</Body>
</Html>
