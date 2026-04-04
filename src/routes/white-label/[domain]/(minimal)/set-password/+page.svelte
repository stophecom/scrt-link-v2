<script lang="ts">
	import { SetPasswordPage } from '$lib/components/page';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SetPasswordPage
	encryptionEnabled={data.encryptionEnabled}
	keyStore={data.keyStore}
	form={data.form}
	encryptionForm={data.encryptionForm}
/>
