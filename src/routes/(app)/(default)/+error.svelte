<script lang="ts">
	import { page } from '$app/state';
	import Page from '$lib/components/page/page.svelte';
</script>

<Page title={`${page.status}`} lead={page.error?.message || 'Unexpted error.'}>
	<span class="text-9xl">😥</span>
</Page>
