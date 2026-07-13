<script lang="ts">
	import EmailLayout from '$lib/components/emails/email-layout.svelte';
	import { getBaseUrl } from '$lib/constants';
	import { m } from '$lib/paraglide/messages.js';

	import { styles } from './styles';

	type Props = {
		name?: string;
	};

	let { name = '' }: Props = $props();

	// Same promo code offered in the in-app welcome wizard.
	const PROMO_CODE = 'WELCOMEPROMOTION';
</script>

<EmailLayout>
	<h1 style={styles.heading}>{name ? `Hi ${name}` : 'Hi there'}</h1>

	<p style={styles.lead}>
		{m.royal_watery_lionfish_glow()}
		<strong>{m.stock_round_finch_support()}</strong>
	</p>

	<p style={styles.text}>{m.welcome_email_promo()}</p>
	<p style={styles.tag}>{PROMO_CODE}</p>

	<p>
		<a
			style={styles.buttonOutline}
			href={`${getBaseUrl()}/pricing?utm_source=email&utm_medium=welcome&utm_campaign=new_signup`}
			>{m.antsy_moving_hare_bloom()}</a
		>
	</p>
</EmailLayout>
