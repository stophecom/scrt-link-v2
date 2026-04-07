<script lang="ts">
	import { RecoverEncryptionPage } from '$lib/components/page';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RecoverEncryptionPage form={data.form} hasRecoveryKey={data.hasRecoveryKey} />
