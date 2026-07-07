<script lang="ts">
	import { ACCOUNT_API_URL } from './constants';
	import Logo from './Logo.svelte';
	import { clearApiKey, setApiKey } from './storage';

	type Props = {
		mode: 'onboard' | 'edit';
		currentKey?: string | null;
		onSaved: (key: string) => void;
		onCleared?: () => void;
		onCancel?: () => void;
	};

	let { mode, currentKey = null, onSaved, onCleared, onCancel }: Props = $props();

	let value = $state('');
	let error = $state('');
	let saving = $state(false);

	const maskedCurrent = $derived(
		currentKey ? `${currentKey.slice(0, 6)}…${currentKey.slice(-4)}` : ''
	);

	async function save() {
		const trimmed = value.trim();
		if (!trimmed) {
			error = 'Please paste your API key.';
			return;
		}
		saving = true;
		await setApiKey(trimmed);
		saving = false;
		onSaved(trimmed);
	}

	async function clear() {
		saving = true;
		await clearApiKey();
		saving = false;
		onCleared?.();
	}
</script>

<div class="screen">
	<header>
		<div class="brand">
			<Logo />
			<h1>{mode === 'onboard' ? 'Connect your account' : 'API key'}</h1>
		</div>
		<p class="muted">
			{#if mode === 'onboard'}
				Paste a scrt.link API key to start sharing secrets from your browser.
			{:else}
				Current key: <code>{maskedCurrent}</code>
			{/if}
		</p>
	</header>

	<label class="field">
		<span>{mode === 'onboard' ? 'API key' : 'Replace with a new key'}</span>
		<input
			type="password"
			placeholder="ak_…"
			bind:value
			autocomplete="off"
			spellcheck="false"
			oninput={() => (error = '')}
		/>
	</label>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<p class="muted small">
		Don't have a key? <a href={ACCOUNT_API_URL} target="_blank" rel="noreferrer">
			Create one in your account →
		</a>
	</p>

	<div class="actions">
		{#if mode === 'edit' && onCancel}
			<button class="ghost" type="button" onclick={onCancel} disabled={saving}>Cancel</button>
		{/if}
		{#if mode === 'edit' && currentKey}
			<button class="danger" type="button" onclick={clear} disabled={saving}>Clear key</button>
		{/if}
		<button class="primary" type="button" onclick={save} disabled={saving}>
			{saving ? 'Saving…' : 'Save key'}
		</button>
	</div>
</div>
