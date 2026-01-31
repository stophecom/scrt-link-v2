<script lang="ts">
	import LockKeyhole from '@lucide/svelte/icons/lock-keyhole';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Link from '$lib/components/ui/link';
	import { TierOptions } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Props = {
		user?: App.Locals['user'];
		upgradeDescription?: string;
	};
	let { user, upgradeDescription, ...rest }: Props & SvelteHTMLElements['div'] = $props();

	// Defaults
	let description = $derived(upgradeDescription || m.cool_spicy_gopher_earn());

	let tierInfo = $derived.by(() => {
		switch (user?.subscriptionTier) {
			case TierOptions.CONFIDENTIAL:
				return {
					title: m.fair_red_warbler_bake(),
					link: m.mild_tangy_elk_scoop()
				};
			case TierOptions.SECRET:
			case TierOptions.TOP_SECRET:
				return {
					title: m.blue_inclusive_sloth_flow(),
					link: m.cute_witty_puffin_grow()
				};
			default:
				return {
					title: m.acidic_aqua_octopus_revive(),
					link: m.loved_legal_clownfish_kiss()
				};
		}
	});
</script>

<div {...rest}>
	<Alert Icon={LockKeyhole} variant="info" title={tierInfo.title}>
		<p>
			{description}
		</p>
		{#if user}
			<Link href={localizeHref('/pricing')}>{tierInfo.link}</Link>
		{:else}
			<Link href={localizeHref('/signup')}>{m.loved_legal_clownfish_kiss()}</Link>
		{/if}
	</Alert>
</div>
