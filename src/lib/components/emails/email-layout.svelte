<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getBaseUrl } from '$lib/constants';
	import { appName } from '$lib/data/app';
	import { styles } from '$lib/emails/styles';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		/** Renders the © / privacy-policy footer. Disable for internal emails. */
		footer?: boolean;
		children: Snippet;
	};

	let { footer = true, children }: Props = $props();
</script>

<!--
	Inner email content only. The surrounding <html>/<head>/<body> document shell
	is added by wrapEmailDocument() in $lib/emails/document.ts — email components
	can't cleanly emit literal <head>/<body> tags (Svelte reserves those for
	<svelte:head>/<svelte:body>, which have different semantics).
-->
<div style={styles.container}>
	<img
		src={`${getBaseUrl()}/logo.png`}
		alt={appName}
		width="140"
		height="140"
		style={styles.logo}
	/>

	{@render children()}

	{#if footer}
		<hr style={styles.hr} />
		<p style={styles.footer}>
			©{new Date().getFullYear()}
			{appName} -
			<a style={styles.footerLink} href="{getBaseUrl()}/privacy-policy"
				>{m.crazy_jumpy_mouse_hush()}</a
			>
		</p>
	{/if}
</div>
