import { tv, type VariantProps } from 'tailwind-variants';

import Root from './container.svelte';

export const containerVariants = tv({
	base: 'container',
	variants: {
		variant: {
			default: 'max-w-[var(--breakpoint-md)]',
			wide: 'max-w-[var(--breakpoint-lg)]'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});

export type Variant = VariantProps<typeof containerVariants>['variant'];

export { Root as Container };
