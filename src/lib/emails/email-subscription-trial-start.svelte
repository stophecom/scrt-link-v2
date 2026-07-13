<script lang="ts">
	import { TRIAL_PERIOD_DAYS } from '$lib/client/constants';
	import EmailLayout from '$lib/components/emails/email-layout.svelte';
	import { getBaseUrl } from '$lib/constants';
	import { m } from '$lib/paraglide/messages.js';

	import { styles } from './styles';

	type Props = {
		name?: string;
		planName: string;
	};

	let { name = '', planName = 'TEST' }: Props = $props();
</script>

<EmailLayout>
	<h1 style={styles.heading}>{name ? m.honest_quiet_millipede_loop({ name }) : 'Hi there'}</h1>

	<p style={styles.lead}>{m.pretty_aloof_owl_yell()}</p>

	<p style={styles.text}>{m.dull_flat_loris_bless({ trialPeriod: TRIAL_PERIOD_DAYS })}</p>
	<p style={styles.text}>{m.still_icy_donkey_fold()} <strong>{planName}</strong></p>

	<p>
		<a
			style={styles.buttonPrimary}
			href={`${getBaseUrl()}?utm_source=email&utm_medium=subscription&utm_campaign=new_subscription`}
			>{m.watery_caring_crab_trim()}</a
		>
	</p>
</EmailLayout>
