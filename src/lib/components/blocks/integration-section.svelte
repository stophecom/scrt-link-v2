<script lang="ts">
	import { Code } from '@lucide/svelte';

	import ApiPreview from '$lib/components/blocks/api-preview.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Section } from '$lib/components/ui/section';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<Section
	wide
	variant="card"
	title={m.aloof_minor_flamingo_nourish()}
	lead={m.mellow_lost_dragonfly_dance()}
>
	<ApiPreview />
	<Button variant="outline" href={localizeHref('/api-documentation')}>
		<Code class="me-2 h-4 w-4" />
		{m.this_sleek_toucan_radiate()}
	</Button>
</Section>
