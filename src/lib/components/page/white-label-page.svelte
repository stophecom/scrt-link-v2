<script lang="ts">
	import type { Snippet } from 'svelte';

	import PageLead from '../blocks/page-lead.svelte';
	import PageTitle from '../blocks/page-title.svelte';
	import PageWrapper from '../blocks/page-wrapper.svelte';
	import Container from '../ui/container/container.svelte';

	type Props = {
		metaTitle: string;
		title: string;
		lead?: string | null;
		children: Snippet;
	};

	let { metaTitle, title, lead, children }: Props = $props();
</script>

<PageWrapper class="pt-24 pb-16 sm:pt-32" {metaTitle}>
	<Container>
		<PageTitle {title} />

		{#if lead}
			<PageLead {lead} />
		{/if}

		{@render children?.()}
	</Container>
</PageWrapper>
