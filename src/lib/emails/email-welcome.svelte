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

	// Same promo code offered in the in-app welcome wizard.
	const PROMO_CODE = 'WELCOMEPROMOTION';
</script>

<Html lang={getLocale()} class="font-sans">
	<Head />
	<Body class="bg-background ">
		<Container class="py-12">
			<Img src={`${getBaseUrl()}/logo.png`} alt="Logo" width="140" height="140" />

			<Heading class="text-primary text-4xl ">{name ? `Hi ${name}` : 'Hi there'}</Heading>

			<Text class="mb-4 text-xl leading-snug"
				>{m.royal_watery_lionfish_glow()}
				<strong>{m.stock_round_finch_support()}</strong>
			</Text>

			<Text class="mb-2 text-lg">{m.welcome_email_promo()}</Text>
			<Text
				class="border-border text-foreground mb-10 inline-block rounded-md border px-4 py-2 text-lg font-bold tracking-widest"
				>{PROMO_CODE}</Text
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
