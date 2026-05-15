<script lang="ts">
	import { Body, Container, Head, Heading, Hr, Html, Img, Link, Text } from 'svelte-email-tailwind';

	import { getBaseUrl } from '$lib/constants';
	import { appName } from '$lib/data/app';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	type Props = {
		receiptId: string;
		viewCount?: number;
		viewLimit?: number;
		isLastView?: boolean;
	};

	let { receiptId = 'ABC123', viewCount = 1, viewLimit = 1, isLastView = true }: Props = $props();
</script>

<Html lang={getLocale()} class="font-sans">
	<Head />
	<Body class="bg-background ">
		<Container class="py-12">
			<Img src={`${getBaseUrl()}/logo.png`} alt="Logo" width="140" height="140" />

			<Heading class="text-primary text-4xl ">{m.slimy_broad_dachshund_lock()} 🔥</Heading>

			<Text class="mb-4 text-xl leading-snug ">{m.soft_frail_wolf_fear()}</Text>
			<Text class="mb-10 text-xl leading-snug"><code>{receiptId}</code></Text>

			{#if isLastView}
				<Text class="text-muted">{m.ideal_aloof_mayfly_thrive()}</Text>
			{:else}
				<Text class="text-muted">{m.aware_neat_moth_count({ viewCount, viewLimit })}</Text>
			{/if}

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
