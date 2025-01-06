<script lang="ts">
	import { page } from '$app/state';
	import Page from '$lib/components/layout/page.svelte';
</script>

<Page title={`${page.status}`} lead={page.error?.message || 'Unexpted error.'}>
	<div class="container">
		<span class="text-9xl">😥</span>
	</div>
</Page>
