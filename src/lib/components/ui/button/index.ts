import type { Button as ButtonPrimitive } from 'bits-ui';
import { tv, type VariantProps } from 'tailwind-variants';

import Root from './button.svelte';

const buttonVariants = tv({
	base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline: 'border-border bg-background hover:bg-muted border',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-muted',
			link: 'text-primary underline-offset-4 hover:underline'
		},
		size: {
			default: 'h-12 px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-14 rounded-md px-6',
			icon: 'h-12 w-12'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});

type Variant = VariantProps<typeof buttonVariants>['variant'];
type Size = VariantProps<typeof buttonVariants>['size'];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
	delayed?: boolean;
};

type Events = ButtonPrimitive.Events;

export {
	//
	Root as Button,
	type Events as ButtonEvents,
	type Props as ButtonProps,
	buttonVariants,
	type Events,
	type Props,
	Root
};
