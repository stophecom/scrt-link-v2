<script lang="ts">
	import CreateSecret from './lib/CreateSecret.svelte';
	import KeyEntry from './lib/KeyEntry.svelte';
	import { getApiKey } from './lib/storage';

	let apiKey = $state<string | null>(null);
	let loading = $state(true);
	let managingKey = $state(false);

	$effect(() => {
		getApiKey().then((key) => {
			apiKey = key;
			loading = false;
		});
	});

	function onKeySaved(key: string) {
		apiKey = key;
		managingKey = false;
	}

	function onKeyCleared() {
		apiKey = null;
		managingKey = false;
	}
</script>

<main>
	{#if loading}
		<div class="screen center">
			<p class="muted">Loading…</p>
		</div>
	{:else if !apiKey}
		<KeyEntry mode="onboard" onSaved={onKeySaved} />
	{:else if managingKey}
		<KeyEntry
			mode="edit"
			currentKey={apiKey}
			onSaved={onKeySaved}
			onCleared={onKeyCleared}
			onCancel={() => (managingKey = false)}
		/>
	{:else}
		<CreateSecret {apiKey} onManageKey={() => (managingKey = true)} />
	{/if}
</main>
