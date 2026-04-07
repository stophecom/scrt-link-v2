<script lang="ts">
	import { SingleFormPage } from '$lib/components/page';
	import { Alert } from '$lib/components/ui/alert';
	import Markdown from '$lib/components/ui/markdown/markdown.svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<SingleFormPage title={m.tough_jumpy_anteater_taste()}>
	<p class="mb-2">{m.stock_neat_carp_pout()}</p>

	<Alert>
		<Markdown markdown={m.dim_warm_puma_gaze({ scrtLink: '[scrt.link](https://scrt.link)' })} />
	</Alert>
</SingleFormPage>
