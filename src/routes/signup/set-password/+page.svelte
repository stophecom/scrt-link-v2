<script lang="ts">
	import Page from '$lib/components/layout/page.svelte';
	import * as m from '$lib/paraglide/messages.js';
	// import type { PageData } from './$types';

	// let { data }: { data: PageData } = $props();
</script>

<Page title={m.tough_jumpy_anteater_taste()} lead={m.teary_brief_robin_scoop()}>
	<div class="container justify-center">
		<div class="max-w-lg rounded border bg-slate-100 p-3 dark:bg-slate-900">Todo</div>
	</div>
</Page>
