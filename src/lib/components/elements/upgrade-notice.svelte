<script lang="ts">
	import LockKeyhole from 'lucide-svelte/icons/lock-keyhole';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Link from '$lib/components/ui/link';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Props = {
		user?: App.Locals['user'];
	};
	let { user, ...rest }: Props & SvelteHTMLElements['address'] = $props();

	const title = user ? m.fair_red_warbler_bake() : m.acidic_aqua_octopus_revive();
</script>

<div {...rest}>
	<Alert Icon={LockKeyhole} variant="info" {title}>
		<p>
			{m.cool_spicy_gopher_earn()}
		</p>
		{#if user}
			<Link href={localizeHref('/pricing')}>{m.mild_tangy_elk_scoop()}</Link>
		{:else}
			<Link href={localizeHref('/signup')}>{m.loved_legal_clownfish_kiss()}</Link>
		{/if}
	</Alert>
</div>
