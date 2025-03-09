<script lang="ts">
	import ContactForm from '$lib/components/forms/contact-form.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Card from '$lib/components/ui/card';
	import * as m from '$lib/paraglide/messages.js';

	import { emailSupport } from '../../../lib/data/app';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.sour_caring_panda_dazzle()} lead={m.alert_sound_hornet_adapt()}>
	<Card class="mb-6" title={m.royal_cuddly_kitten_tickle()}>
		<ContactForm data={data.form} />
	</Card>
	<div class="prose">
		<a href="mailto:{emailSupport}">{emailSupport}</a>
	</div>
</Page>
