<script lang="ts">
	import { WhiteLabelPage } from '$lib/components/page';
	import Card from '$lib/components/ui/card';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<WhiteLabelPage
	metaTitle={data.title || m.brave_kind_lamb_give()}
	title={data.title || m.brave_kind_lamb_give()}
	lead={data.lead || m.warm_safe_dove_tell()}
>
	<Card>
		<p class="text-muted-foreground py-8 text-center">
			{m.white_label_request_preview_placeholder()}
		</p>
	</Card>
</WhiteLabelPage>
