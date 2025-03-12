<script lang="ts">
	import LockKeyhole from 'lucide-svelte/icons/lock-keyhole';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Link from '$lib/components/ui/link';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		user?: App.Locals['user'];
	};
	let { user, ...rest }: Props & SvelteHTMLElements['address'] = $props();

	const title = user ? m.fair_red_warbler_bake() : 'Please sign up';
</script>

<div {...rest}>
	<Alert Icon={LockKeyhole} variant="info" {title}>
		<p>
			{m.cool_spicy_gopher_earn()}
		</p>
		{#if user}
			<Link href="/pricing">{m.mild_tangy_elk_scoop()}</Link>
		{:else}
			<Link href="/signup">Sign up free</Link>
		{/if}
	</Alert>
</div>
