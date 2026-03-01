<script lang="ts">
	import SecretsCard from '../secrets-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SecretsCard secrets={data.secrets} secretForm={data.secretForm} user={data.user} />
