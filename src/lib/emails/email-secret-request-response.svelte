<script lang="ts">
	import { SECRET_REQUEST_RETENTION_PERIOD_IN_DAYS } from '$lib/client/constants';
	import EmailLayout from '$lib/components/emails/email-layout.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import { styles } from './styles';

	type Props = {
		receiptId: string;
	};

	let { receiptId = 'ABC123' }: Props = $props();
</script>

<EmailLayout>
	<h1 style={styles.heading}>{m.gold_tidy_crane_heading()}</h1>

	<p style={styles.lead}>{m.gold_tidy_crane_body()}</p>
	<p style={styles.code}>{receiptId}</p>

	<p style={styles.muted}>
		{m.gold_tidy_crane_expiry({ retentionPeriod: SECRET_REQUEST_RETENTION_PERIOD_IN_DAYS })}
	</p>
</EmailLayout>
