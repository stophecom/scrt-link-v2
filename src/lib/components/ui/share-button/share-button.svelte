<script lang="ts">
	import Share from '@lucide/svelte/icons/share-2';

	import { appName } from '$lib/data/app';
	import { m } from '$lib/paraglide/messages.js';

	import type { ButtonProps } from '../button';
	import Button from '../button/button.svelte';

	interface ShareData {
		title?: string;
		text?: string;
		url?: string;
		files?: File[];
	}

	const webShare = async ({ title = appName, text, url }: ShareData) => {
		const shareData = {
			title,
			text,
			url
		};
		await navigator.share(shareData);
	};

	let {
		title,
		text,
		url,
		label = m.careful_bald_frog_harbor(),
		...rest
	}: ShareData & ButtonProps & { label?: string } = $props();
</script>

<Button variant="ghost" {...rest} on:click={() => webShare({ title, text, url })}
	><Share class="mr-2 h-4 w-4" />{label}</Button
>
