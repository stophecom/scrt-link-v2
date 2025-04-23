<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';

	import WhiteLabelForm from '$lib/components/forms/white-label-form.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import type { WhiteLabelMetaSchema } from '$lib/validators/formSchemas';

	let { form }: { form: SuperValidated<WhiteLabelMetaSchema> } = $props();
</script>

<Card class="mb-6" title={m.big_next_tortoise_ascend()} description={m.solid_north_ostrich_cheer()}>
	<WhiteLabelForm {form} />
</Card>
