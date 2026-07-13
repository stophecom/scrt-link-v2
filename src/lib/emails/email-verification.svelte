<script lang="ts">
	import EmailLayout from '$lib/components/emails/email-layout.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import { styles } from './styles';

	type Props = {
		code: string;
	};

	let { code = '123456' }: Props = $props();
</script>

<EmailLayout>
	<h1 style={styles.heading}>{m.watery_awful_puffin_nourish()}</h1>

	<p style={styles.code}>{code}</p>

	<p style={styles.muted}>{m.trite_only_bee_love()}</p>
</EmailLayout>
