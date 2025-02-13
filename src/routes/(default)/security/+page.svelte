<script lang="ts">
	import Page from '$lib/components/layout/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import * as m from '$lib/paraglide/messages.js';
</script>

<Page title="Security" lead="Best practices, no extras.">
	<Markdown markdown={m.actual_patient_giraffe_rest()} format={true} />
</Page>
