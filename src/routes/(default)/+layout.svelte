<script lang="ts">
	import type { Snippet } from 'svelte';

	import Footer from '$lib/components/elements/footer.svelte';
	import Header from '$lib/components/elements/header.svelte';
	import { secretMenu } from '$lib/data/menu';

	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// Hide the "Create secret" button on specific routes.
	const paths = secretMenu().map((item) => item.href);
	let isCreateSecretButtonHidden = $state(false);

	$effect(() => {
		isCreateSecretButtonHidden = ['/', '/pricing', ...paths].includes(data.pathname);
	});
</script>

<Header user={data.user} hideCreateSecretButton={isCreateSecretButtonHidden} />
<main>
	{@render children()}
</main>
<Footer />
