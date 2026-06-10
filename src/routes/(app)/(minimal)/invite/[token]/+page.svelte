<script lang="ts">
	import { enhance } from '$app/forms';
	import { SingleFormPage } from '$lib/components/page';
	import Button from '$lib/components/ui/button/button.svelte';
	import Link from '$lib/components/ui/link';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage
	title={m.white_long_parakeet_buy()}
	description={data.organizationName
		? m.tough_keen_bee_pause({ organizationName: data.organizationName })
		: m.simple_last_slug_lend()}
>
	<form method="POST" action="?/acceptInvitation" use:enhance class="mt-12">
		<Button type="submit" class="w-full">{m.glad_loud_crab_accept()}</Button>
	</form>
	<div class="py-5">
		<Separator />
	</div>
	<div class="muted px-5 text-center text-xs">
		{m.ornate_main_beaver_snip()}
		<Link href={localizeHref('/terms-of-service')}>{m.green_sharp_parrot_smile()}</Link>
	</div>
</SingleFormPage>
