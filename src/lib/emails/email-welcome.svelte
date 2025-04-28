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

			<Heading class="text-primary text-4xl ">{name ? 'Hi {name}' : 'Hi there'}</Heading>

			<Text class="mb-4 text-xl leading-snug"
				>{m.royal_watery_lionfish_glow()}
				<strong>{m.stock_round_finch_support()}</strong>
			</Text>

			<Text class="mb-10 text-lg">
				{m.curly_aqua_carp_arrive()}</Text
			>

			<Button
				class="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap "
				href={`${getBaseUrl()}?utm_source=email&utm_medium=welcome&utm_campaign=new_signup`}
				>{m.royal_lofty_ocelot_cuddle()}</Button
			>

			<Button
				class="bg-background text-foreground border-foreground inline-flex items-center justify-center rounded-md border  px-4 py-2 text-sm font-medium whitespace-nowrap "
				href={`${getBaseUrl()}/pricing?utm_source=email&utm_medium=welcome&utm_campaign=new_signup`}
				>{m.antsy_moving_hare_bloom()}</Button
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
