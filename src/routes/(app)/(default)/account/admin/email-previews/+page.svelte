<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selected = $state('');
	let sending = $state(false);

	// Falls back to the first template until one is explicitly selected.
	const current = $derived(
		data.previews.find((preview) => preview.name === selected) ?? data.previews[0]
	);
</script>

<div class="mb-6">
	<Button variant="outline" href={localizeHref('/account/admin')}>← Back to admin</Button>
</div>

<h1 class="mb-4 text-2xl font-bold">Email previews</h1>

{#if data.previews.length === 0}
	<p class="text-muted-foreground">No email templates found in <code>$lib/emails</code>.</p>
{:else}
	<div class="grid gap-6 md:grid-cols-[220px_1fr]">
		<nav class="flex flex-col gap-1">
			{#each data.previews as preview (preview.name)}
				<button
					type="button"
					class="rounded-md px-3 py-2 text-left text-sm transition-colors {current?.name ===
					preview.name
						? 'bg-primary text-primary-foreground'
						: 'hover:bg-muted'}"
					onclick={() => (selected = preview.name)}
				>
					{preview.name}
				</button>
			{/each}
		</nav>

		<div>
			{#if current}
				<div class="mb-4 overflow-hidden rounded-lg border">
					<iframe title={current.name} srcdoc={current.html} class="h-[640px] w-full bg-white"
					></iframe>
				</div>

				<form
					method="POST"
					action="?/send"
					class="flex flex-wrap items-center gap-2"
					use:enhance={() => {
						sending = true;
						return async ({ update }) => {
							await update();
							sending = false;
						};
					}}
				>
					<input type="hidden" name="name" value={current.name} />
					<Input
						type="email"
						name="to"
						placeholder="recipient@example.com"
						required
						class="max-w-xs"
					/>
					<Button type="submit" disabled={sending}>
						{sending ? 'Sending…' : 'Send test'}
					</Button>
				</form>

				{#if form?.success}
					<p class="text-success mt-2 text-sm">Sent “{form.name}” to {form.to}.</p>
				{:else if form?.error}
					<p class="text-destructive mt-2 text-sm">{form.error}</p>
				{/if}
			{/if}
		</div>
	</div>
{/if}
