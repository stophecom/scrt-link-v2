<script lang="ts">
	import Download from '@lucide/svelte/icons/download';

	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import Markdown from '$lib/components/ui/markdown';
	import { dpaPrintStyles } from '$lib/dpa/print-styles';
	import { type DpaValues, formatDpaDate, mergeDpaTemplate } from '$lib/dpa/template';
	import { m } from '$lib/paraglide/messages.js';

	const CONTACT_EMAIL = 'info@scrt.link';

	let { defaults = {} }: { defaults?: Partial<DpaValues> } = $props();

	let companyName = $state(defaults.companyName ?? '');
	let companyAddress = $state(defaults.companyAddress ?? '');
	let signerEmail = $state(defaults.signerEmail ?? '');
	const effectiveDate = formatDpaDate(new Date());

	const mergedMarkdown = $derived(
		mergeDpaTemplate({ companyName, companyAddress, signerEmail, effectiveDate })
	);

	// Split the step around the address so it can be rendered as a real link element.
	const howtoStep4Parts = $derived(
		m.dpa_howto_step_4({ email: CONTACT_EMAIL }).split(CONTACT_EMAIL)
	);

	// The rendered document (brand header + markdown); its HTML is copied into a print iframe.
	let documentEl = $state<HTMLElement>();

	function downloadPdf() {
		if (!documentEl) return;

		const iframe = document.createElement('iframe');
		iframe.setAttribute('aria-hidden', 'true');
		iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
		document.body.appendChild(iframe);

		const frameDoc = iframe.contentDocument;
		const frameWin = iframe.contentWindow;
		if (!frameDoc || !frameWin) {
			iframe.remove();
			return;
		}

		// Build the print document via DOM (avoids embedding a literal style tag in source,
		// which the Svelte preprocessor would otherwise try to parse as CSS).
		frameDoc.title = m.dpa_title();
		const styleEl = frameDoc.createElement('style');
		styleEl.textContent = dpaPrintStyles;
		frameDoc.head.appendChild(styleEl);
		frameDoc.body.innerHTML = documentEl.innerHTML;

		const cleanup = () => setTimeout(() => iframe.remove(), 500);
		frameWin.onafterprint = cleanup;
		// Give the iframe a tick to lay out before invoking the print dialog.
		setTimeout(() => {
			frameWin.focus();
			frameWin.print();
		}, 200);
	}
</script>

<div class="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
	<!-- Form + instructions -->
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-4">
			<h2 class="text-lg font-semibold">{m.dpa_your_details()}</h2>

			<div class="flex flex-col gap-1.5">
				<Label for="dpa-company-name">{m.dpa_field_company_name()}</Label>
				<Input id="dpa-company-name" bind:value={companyName} placeholder="Acme, Inc." />
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="dpa-company-address">{m.dpa_field_company_address()}</Label>
				<Input
					id="dpa-company-address"
					bind:value={companyAddress}
					placeholder="1 Example Street, City, Country"
				/>
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="dpa-signer-email">{m.dpa_field_signer_email()}</Label>
				<Input
					id="dpa-signer-email"
					type="email"
					bind:value={signerEmail}
					placeholder="jane@example.com"
				/>
			</div>

			<Button type="button" onclick={downloadPdf} class="mt-1 w-full">
				<Download class="mr-2 size-4" />
				{m.dpa_download_cta()}
			</Button>
		</div>

		<div class="bg-info/5 border-info/50 text-info rounded-lg border p-4">
			<h3 class="mb-2 font-semibold">{m.dpa_howto_title()}</h3>
			<ol class="text-foreground list-decimal space-y-1.5 pl-5 text-sm">
				<li>{m.dpa_howto_step_1()}</li>
				<li>{m.dpa_howto_step_2()}</li>
				<li>{m.dpa_howto_step_3()}</li>
				<li>
					{howtoStep4Parts[0]}<a class="underline" href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a
					>{howtoStep4Parts[1] ?? ''}
				</li>
				<li>{m.dpa_howto_step_5()}</li>
			</ol>
		</div>
	</div>

	<!-- Live preview -->
	<div class="flex min-w-0 flex-col gap-2">
		<span class="text-muted-foreground text-sm font-medium">{m.dpa_preview_label()}</span>
		<div class=" bg-card max-h-[70vh] overflow-y-auto rounded-lg border p-8 text-black shadow-sm">
			<div class="dpa-document" bind:this={documentEl}>
				<header class="dpa-brand mb-6 flex items-baseline gap-2 border-b-2 border-black pb-2.5">
					<span class="dpa-brand__mark text-lg font-bold tracking-tight">scrt.link</span>
					<span class="dpa-brand__tag text-xs text-neutral-500">Share a Secret</span>
				</header>
				<Markdown markdown={mergedMarkdown} format />
			</div>
		</div>
	</div>
</div>

<style>
	/* On-screen preview: keep body text reflowing, but let wide tables scroll
	   inside the preview instead of pushing the page wider on small screens. */
	.dpa-document :global(table) {
		display: block;
		max-width: 100%;
		overflow-x: auto;
	}
</style>
