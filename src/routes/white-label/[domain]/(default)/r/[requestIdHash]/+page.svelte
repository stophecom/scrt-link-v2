<script lang="ts">
	import SecretResponse from '$lib/components/blocks/secret-response.svelte';
	import { WhiteLabelPage } from '$lib/components/page';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();

	let successMessage = $state('');
</script>

<WhiteLabelPage
	metaTitle={m.brave_kind_lamb_give()}
	title={m.brave_kind_lamb_give()}
	lead={m.warm_safe_dove_tell()}
>
	<SecretResponse {data} bind:successMessage />
</WhiteLabelPage>
