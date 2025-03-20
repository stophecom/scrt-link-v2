<script lang="ts">
	import { Container, Head, Heading, Hr, Html, Img, Link, Text } from 'svelte-email-tailwind';

	import { getBaseUrl } from '$lib/constants';
	import { appName } from '$lib/data/app';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	type Props = {
		code: string;
	};

	let { code = '123456' }: Props = $props();
</script>

<Html lang={getLocale()} class="bg-background font-sans">
	<Head />
	<Container class="bg-background py-12">
		<Img src={`${getBaseUrl()}/logo.png`} alt="Logo" width="140" height="140" />

		<Heading class="text-primary text-4xl ">{m.watery_awful_puffin_nourish()}</Heading>

		<Text class="mb-10 text-xl leading-snug"><code>{code}</code></Text>

		<Text class="text-muted text-lg">{m.trite_only_bee_love()}</Text>

		<Hr class="border-border mt-8" />

		<Text class="text text-muted">
			©{new Date().getFullYear()}
			{appName} -
			<Link class="text-muted" href="{getBaseUrl()}/privacy-policy"
				>{m.crazy_jumpy_mouse_hush()}</Link
			>
		</Text>
	</Container>
</Html>
