<script lang="ts">
	import { EncryptionFormPage } from '$lib/components/page';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<EncryptionFormPage
	passwordForm={data.passwordForm}
	encryptionEnabled={data.encryptionEnabled}
	keyStore={data.keyStore}
/>
