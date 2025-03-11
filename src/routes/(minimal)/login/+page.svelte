<script lang="ts">
	import Google from '$lib/assets/images/Google.svg?component';
	import EmailForm from '$lib/components/forms/email-form.svelte';
	import SingleFormPage from '$lib/components/page/single-form-page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Link from '$lib/components/ui/link';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage title={m.legal_weak_jay_bless()} description={m.ago_crazy_pelican_pray()}>
	<EmailForm data={data.form} />
	<div class="px-5 text-center text-sm">
		{m.warm_ideal_butterfly_radiate()}
		<Link href="/signup">{m.grassy_sea_pug_gasp()}</Link>
	</div>
	<div class="py-5">
		<Separator />
	</div>

	<Button class="w-full" variant="outline" size="lg" href="/login/google"
		><Google class="mr-3" />{m.major_noble_snake_drop()}</Button
	>
</SingleFormPage>
