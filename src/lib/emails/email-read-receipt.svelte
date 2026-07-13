<script lang="ts">
	import EmailLayout from '$lib/components/emails/email-layout.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import { styles } from './styles';

	type Props = {
		receiptId: string;
		viewCount?: number;
		viewLimit?: number;
		isLastView?: boolean;
	};

	let { receiptId = 'ABC123', viewCount = 1, viewLimit = 1, isLastView = true }: Props = $props();
</script>

<EmailLayout>
	<h1 style={styles.heading}>{m.slimy_broad_dachshund_lock()} 🔥</h1>

	<p style={styles.lead}>{m.soft_frail_wolf_fear()}</p>
	<p style={styles.code}>{receiptId}</p>

	{#if isLastView}
		<p style={styles.muted}>{m.ideal_aloof_mayfly_thrive()}</p>
	{:else}
		<p style={styles.muted}>{m.aware_neat_moth_count({ viewCount, viewLimit })}</p>
	{/if}
</EmailLayout>
