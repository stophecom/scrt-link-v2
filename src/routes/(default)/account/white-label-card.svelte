<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';

	import WhiteLabelForm from '$lib/components/forms/white-label-form.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import type { WhiteLabelSiteSchema } from '$lib/validators/formSchemas';

	let { user, form }: { user: App.Locals['user']; form: SuperValidated<WhiteLabelSiteSchema> } =
		$props();
</script>

{user?.subscriptionTier}
<Card
	class="mb-6"
	title="White-Label"
	description="Setup your own custom-branded secret-sharing website."
>
	<WhiteLabelForm {form} />
</Card>
