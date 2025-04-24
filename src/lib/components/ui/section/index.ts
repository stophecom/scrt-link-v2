import { tv, type VariantProps } from 'tailwind-variants';

import Root from './section.svelte';

export const sectionVariants = tv({
	base: 'py-16',
	variants: {
		variant: {
			default: '', // Transparent
			contrast: 'bg-foreground text-background',
			muted: 'bg-muted',
			neutral: 'bg-background',
			card: 'bg-card'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});

export type Variant = VariantProps<typeof sectionVariants>['variant'];

export { Root as Section };
