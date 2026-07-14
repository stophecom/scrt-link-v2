<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	import { page } from '$app/state';
	import DpaGenerator from '$lib/components/dpa/dpa-generator.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.dpa_title()} lead={m.dpa_lead()} markNotTranslated={true} wide>
	<Container variant="wide">
		<a
			href={localizeHref(`/account/org/${page.params.orgId}`)}
			class="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
		>
			<ArrowLeft class="size-4" />
			{data.defaults.companyName}
		</a>
		<DpaGenerator defaults={data.defaults} />
	</Container>
</Page>
