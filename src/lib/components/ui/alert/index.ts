import { tv, type VariantProps } from 'tailwind-variants';

import Root from './alert.svelte';
import Description from './alert-description.svelte';
import Title from './alert-title.svelte';

export const alertVariants = tv({
	base: '[&>svg]:text-foreground relative w-full rounded-lg border p-4 [&:has(svg)]:pl-11 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',

	variants: {
		variant: {
			default: 'bg-background text-foreground',
			info: 'bg-info/5 border-info/50 text-forground-foreground [&>svg]:text-info',
			success: 'bg-success/5 border-success/50 text-success-foreground [&>svg]:text-success',
			destructive:
				'bg-destructive/5 border-destructive/50 text-destructive-foreground [&>svg]:text-destructive'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});

export type Variant = VariantProps<typeof alertVariants>['variant'];
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export {
	//
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle,
	Description,
	Root,
	Title
};
