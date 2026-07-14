// Self-contained stylesheet for the printed / PDF version of the DPA.
// The iframe used for printing has none of the app's CSS, so everything the
// document needs is defined here against plain HTML tags.
export const dpaPrintStyles = `
	/* Per-page margins so every page (incl. continuation pages) has consistent
	   spacing. The browser's own header/footer (URL, date, page numbers) can't be
	   removed via CSS while keeping page margins — turn it off in the print dialog
	   ("More settings" → uncheck "Headers and footers"); the setting persists. */
	@page { margin: 16mm 18mm; }
	* { box-sizing: border-box; }
	body {
		font-family: 'Helvetica Neue', Arial, system-ui, sans-serif;
		color: #18181b;
		font-size: 10.5pt;
		line-height: 1.55;
		margin: 0;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
	.dpa-brand {
		display: flex;
		align-items: baseline;
		gap: 8px;
		border-bottom: 2px solid #18181b;
		padding-bottom: 10px;
		margin-bottom: 24px;
	}
	.dpa-brand__mark { font-size: 15pt; font-weight: 700; letter-spacing: -0.02em; }
	.dpa-brand__tag { font-size: 8.5pt; color: #71717a; }
	h1 { font-size: 18pt; margin: 0 0 4px; }
	h2 {
		font-size: 12pt;
		margin: 22px 0 6px;
		padding-top: 4px;
		break-after: avoid;
		border-top: 1px solid #e4e4e7;
		padding-top: 14px;
	}
	h3 { font-size: 10.5pt; margin: 14px 0 4px; }
	p { margin: 0 0 8px; }
	ul, ol { margin: 0 0 8px; padding-left: 20px; }
	li { margin: 0 0 3px; }
	strong { font-weight: 700; }
	hr { border: none; border-top: 1px solid #d4d4d8; margin: 20px 0; }
	a { color: inherit; text-decoration: underline; }
	table {
		width: 100%;
		border-collapse: collapse;
		margin: 10px 0 14px;
		font-size: 9pt;
		break-inside: avoid;
	}
	th, td {
		border: 1px solid #d4d4d8;
		padding: 5px 7px;
		text-align: left;
		vertical-align: top;
	}
	th { background: #f4f4f5; font-weight: 600; }
	h2, h3 { break-inside: avoid; }
`;
