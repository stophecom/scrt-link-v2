<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { browser } from '$app/environment';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/index.js';

	import { type FormSchema, formSchema } from './schema';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),

		onUpdated: ({ form: f }) => {
			if (f.valid) {
				console.log(`You submitted ${JSON.stringify(f.data, null, 2)}`);
			} else {
				console.log('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, message, errors, enhance } = form;
</script>

<div class="rounded border bg-slate-100 p-3 dark:bg-slate-900">
	<form action="?/signup" method="POST" use:enhance>
		<Form.Field {form} name="email" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.Description>This is your public display name.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input {...attrs} bind:value={$formData.password} />
				{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
			</Form.Control>
			<Form.Description>Choose a strong password</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="hasTermsAccepted" class="py-4">
			<div class="items-top flex space-x-2">
				<Form.Control let:attrs>
					<Label class="flex">
						<Checkbox {...attrs} bind:checked={$formData.hasTermsAccepted} />
						<span class="grid gap-1.5 ps-3 leading-none">
							<span
								class="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Accept terms and conditions
							</span>
							<p class="text-sm text-muted-foreground">
								You agree to our Terms of Service and Privacy Policy.
							</p>
						</span>
					</Label>
				</Form.Control>
			</div>
		</Form.Field>

		<div class="py-4">
			<Form.Button size="lg">Sign up</Form.Button>
		</div>

		{#if $message}
			<div class="message text-green-700">{$message}</div>
		{/if}

		{#if browser}
			<div class="py-3">
				<SuperDebug data={$formData} />
			</div>
		{/if}
	</form>
</div>
