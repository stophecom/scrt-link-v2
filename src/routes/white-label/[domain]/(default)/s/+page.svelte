<script lang="ts">
	import { WhiteLabelPage } from '$lib/components/page';
	import { SPage } from '$lib/components/pages';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<WhiteLabelPage metaTitle={m.fine_aloof_skate_ascend()} title={m.warm_clean_horse_seek()}>
	<SPage form={data.form} />
</WhiteLabelPage>
