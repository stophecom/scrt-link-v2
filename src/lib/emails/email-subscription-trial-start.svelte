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

	import { TRIAL_PERIOD_DAYS } from '$lib/client/constants';
	import { getBaseUrl } from '$lib/constants';
	import { appName } from '$lib/data/app';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	type Props = {
		name?: string;
		planName: string;
	};

	let { name = '', planName = 'TEST' }: Props = $props();
</script>

<Html lang={getLocale()} class="font-sans">
	<Head />
	<Body class="bg-background ">
		<Container class="py-12">
			<Img src={`${getBaseUrl()}/logo.png`} alt="Logo" width="140" height="140" />

			<Heading class="text-primary text-4xl ">{name ? 'Hi {name}' : 'Hi there'}</Heading>

			<Text class="mb-4 text-xl leading-snug">{m.pretty_aloof_owl_yell()}</Text>

			<Text class="text-lg">{m.dull_flat_loris_bless({ trialPeriod: TRIAL_PERIOD_DAYS })}</Text>
			<Text class="mb-10  text-lg">{m.still_icy_donkey_fold()} <strong>{planName}</strong></Text>

			<Button
				class="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap "
				href={`${getBaseUrl()}?utm_source=email&utm_medium=subscription&utm_campaign=new_subscription`}
				>My account</Button
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
