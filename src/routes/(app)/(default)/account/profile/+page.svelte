<script lang="ts">
	import AccountCard from '../account-card.svelte';
	import EncryptionRecoveryCard from '../encryption-recovery-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { user } = data;
</script>

<AccountCard {user} form={data.userForm} />

{#if data.encryptionEnabled && data.keyStore}
	<EncryptionRecoveryCard
		hasRecoveryKey={data.hasRecoveryKey}
		keyStore={data.keyStore}
		passwordForm={data.recoveryPasswordForm}
		recoveryForm={data.recoveryForm}
	/>
{/if}
