import { tv, type VariantProps } from 'tailwind-variants';

import Root from './container.svelte';

export const containerVariants = tv({
	base: 'container',
	variants: {
		variant: {
			default: '',
			wide: 'max-w-[1100px]'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});

export type Variant = VariantProps<typeof containerVariants>['variant'];

export { Root as Container };
