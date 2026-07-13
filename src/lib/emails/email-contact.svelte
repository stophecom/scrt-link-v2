<script lang="ts">
	import EmailLayout from '$lib/components/emails/email-layout.svelte';

	import { styles } from './styles';

	type Props = {
		message: string;
		email: string;
	};

	let { message = 'Empty', email }: Props = $props();
</script>

<EmailLayout footer={false}>
	<h1 style={styles.heading}>Contact</h1>

	<p style={styles.lead}>Message from: {email}</p>
	<p style={styles.lead}>{message}</p>
</EmailLayout>
