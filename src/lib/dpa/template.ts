import dpaMarkdownRaw from '$lib/assets/terms/DPA.md?raw';

export type DpaValues = {
	companyName: string;
	companyAddress: string;
	signerEmail: string;
	effectiveDate: string;
};

// Shown in the preview/document when a field is left empty, so the doc stays readable.
const PLACEHOLDERS: Record<keyof DpaValues, string> = {
	companyName: '[Company name]',
	companyAddress: '[Company address]',
	signerEmail: '[Signer email]',
	effectiveDate: '[Date]'
};

// The template starts with an HTML comment holding drafting instructions — strip it so it never renders.
const stripLeadingComment = (markdown: string) => markdown.replace(/^\s*<!--[\s\S]*?-->\s*/, '');

export const dpaTemplate = stripLeadingComment(dpaMarkdownRaw);

export const formatDpaDate = (date: Date) =>
	date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

/** Fill the `{{token}}` merge fields in the DPA template with the provided values. */
export const mergeDpaTemplate = (values: Partial<DpaValues>): string => {
	let output = dpaTemplate;
	for (const key of Object.keys(PLACEHOLDERS) as (keyof DpaValues)[]) {
		const value = values[key]?.trim() || PLACEHOLDERS[key];
		output = output.replaceAll(`{{${key}}}`, value);
	}
	return output;
};
