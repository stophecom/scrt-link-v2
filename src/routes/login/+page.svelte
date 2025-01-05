<script lang="ts">
	import SigninForm from '$lib/components/forms/signin-form.svelte';
	import Page from '$lib/components/layout/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.game_light_toucan_care()} lead="Welcome back">
	<Section>
		<SigninForm data={data.form} />
	</Section>
</Page>
