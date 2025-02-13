<script lang="ts">
	import Page from '$lib/components/layout/page/page.svelte';
	import { emailSupport } from '$lib/data/app';
</script>

<Page title="Contact" lead="Do you have a question or need support? Get in touch!">
	<div class="prose">
		<a href="mailto:{emailSupport}">{emailSupport}</a>
	</div>
</Page>
