<script lang="ts">
	import ContactForm from '$lib/components/forms/contact-form.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Card from '$lib/components/ui/card';
	import Container from '$lib/components/ui/container/container.svelte';
	import { emailSupport } from '$lib/data/app';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.sour_caring_panda_dazzle()} lead={m.alert_sound_hornet_adapt()}>
	<Container>
		<Card class="mb-6" title={m.royal_cuddly_kitten_tickle()}>
			<ContactForm data={data.form} />
		</Card>
		<div class="prose">
			<a href="mailto:{emailSupport}">{emailSupport}</a>
		</div>
	</Container>
</Page>
