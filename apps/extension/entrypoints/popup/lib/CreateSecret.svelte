<script lang="ts">
	import scrtLink, { type Options } from '@scrt-link/client';

	import { ACCOUNT_API_URL, DEFAULT_EXPIRY, EXPIRY_OPTIONS } from './constants';
	import Logo from './Logo.svelte';

	type Props = {
		apiKey: string;
		onManageKey: () => void;
	};

	let { apiKey, onManageKey }: Props = $props();

	let secret = $state('');
	let password = $state('');
	let publicNote = $state('');
	let expiresIn = $state(DEFAULT_EXPIRY);
	let viewLimit = $state(1);
	let showOptions = $state(false);

	let loading = $state(false);
	let resultLink = $state('');
	let error = $state('');
	let copied = $state(false);

	// Auth/plan failures should point the user at their account, not just show a raw error.
	const isAuthError = $derived(/api key|api access|premium|bearer token/i.test(error));

	async function create() {
		error = '';
		if (!secret.trim()) {
			error = 'Please enter a secret to share.';
			return;
		}

		loading = true;
		try {
			const options: Partial<Options> = {
				expiresIn,
				viewLimit,
				...(password ? { password } : {}),
				...(publicNote ? { publicNote } : {})
			};
			const result = await scrtLink(apiKey).createSecret(secret, options);

			if (result && 'secretLink' in result && result.secretLink) {
				resultLink = result.secretLink;
			} else {
				error = result?.error || 'Something went wrong. Please try again.';
			}
		} catch {
			error = 'Network error — could not reach scrt.link. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function copy() {
		await navigator.clipboard.writeText(resultLink);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	function reset() {
		resultLink = '';
		secret = '';
		password = '';
		publicNote = '';
		error = '';
	}
</script>

<div class="screen">
	<header class="row">
		<div class="brand">
			<Logo />
			<h1>Share a secret</h1>
		</div>
		<button class="icon" type="button" title="API key settings" onclick={onManageKey}>⚙</button>
	</header>

	{#if resultLink}
		<div class="result">
			<p class="muted">Your one-time secret link is ready:</p>
			<div class="link-box">
				<input type="text" readonly value={resultLink} />
				<button class="primary" type="button" onclick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
			</div>

			<button class="ghost" type="button" onclick={reset}>Create another</button>
		</div>
	{:else}
		<label class="field">
			<span>Secret</span>
			<textarea
				rows="4"
				placeholder="Type or paste the secret you want to share…"
				bind:value={secret}
				oninput={() => (error = '')}
			></textarea>
		</label>

		<button class="link-button" type="button" onclick={() => (showOptions = !showOptions)}>
			{showOptions ? '− Fewer options' : '+ More options'}
		</button>

		{#if showOptions}
			<div class="options">
				<div class="options-grid">
					<label class="field">
						<span>Expires after</span>
						<select bind:value={expiresIn}>
							{#each EXPIRY_OPTIONS as opt (opt.value)}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
					</label>

					<label class="field">
						<span>View limit</span>
						<input type="number" min="1" max="10" bind:value={viewLimit} />
					</label>
				</div>
				<label class="field">
					<span>Password (optional)</span>
					<input
						type="password"
						placeholder="Extra protection"
						bind:value={password}
						autocomplete="off"
					/>
				</label>

				<label class="field">
					<span>Public note (optional)</span>
					<input
						type="text"
						placeholder="Shown before the secret is revealed"
						bind:value={publicNote}
					/>
				</label>
			</div>
		{/if}

		{#if error}
			<p class="error">
				{error}
				{#if isAuthError}
					<br />
					<a href={ACCOUNT_API_URL} target="_blank" rel="noreferrer">Check your API key →</a>
				{/if}
			</p>
		{/if}

		<button class="primary block" type="button" onclick={create} disabled={loading}>
			{loading ? 'Encrypting…' : 'Create secret link'}
		</button>
	{/if}
</div>
