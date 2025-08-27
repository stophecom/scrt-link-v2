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
		token: string;
		name: string;
	};

	let { token = '123456', name = 'Unknown' }: Props = $props();
</script>

<Html lang={getLocale()} class="font-sans">
	<Head />
	<Body class="bg-background">
		<Container class="py-12">
			<Img src={`${getBaseUrl()}/logo.png`} alt="Logo" width="140" height="140" />

			<Heading class="text-primary text-4xl ">{m.calm_loose_midge_scold()}</Heading>

			<Text class="mb-10 text-xl leading-snug">{m.odd_tense_tuna_list({ name })}</Text>

			<Button
				class="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap "
				href={`${getBaseUrl()}/invite/${token}`}>{m.cool_solid_anaconda_fond()}</Button
			>

			<Text class="text-muted">{m.close_awful_snake_offer()}</Text>

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
