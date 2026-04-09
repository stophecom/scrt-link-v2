import Root from './stepper.svelte';

export type Step = {
	label: string;
	completed: boolean;
};

export { Root, Root as Stepper };
export default Root;
