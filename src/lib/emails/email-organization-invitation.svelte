<script lang="ts">
	import EmailLayout from '$lib/components/emails/email-layout.svelte';
	import { getBaseUrl } from '$lib/constants';
	import { m } from '$lib/paraglide/messages.js';

	import { styles } from './styles';

	type Props = {
		token: string;
		name: string;
	};

	let { token = '123456', name = 'Unknown' }: Props = $props();
</script>

<EmailLayout>
	<h1 style={styles.heading}>{m.calm_loose_midge_scold()}</h1>

	<p style={styles.lead}>{m.odd_tense_tuna_list({ name })}</p>

	<p>
		<a style={styles.buttonPrimary} href={`${getBaseUrl()}/invite/${token}`}
			>{m.cool_solid_anaconda_fond()}</a
		>
	</p>

	<p style={styles.muted}>{m.close_awful_snake_offer()}</p>
</EmailLayout>
