<script lang="ts">
	import { page } from '$app/state';
	import Page from '$lib/components/page/page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
</script>

<Page title={`${page.status}`} lead={page.error?.message || 'Unexpected error.'}>
	<Container>
		<span class="text-9xl">😥</span>
	</Container>
</Page>
