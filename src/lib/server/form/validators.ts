import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { ReadReceiptOptions, ThemeOptions } from '$lib/data/enums';
import { db } from '$lib/server/db';
import { userSettings } from '$lib/server/db/schema';
import { secretFormSchema, settingsFormSchema, themeFormSchema } from '$lib/validators/formSchemas';

export const secretFormValidator = async () => await superValidate(zod(secretFormSchema()));

export const themeFormValidator = async (user: App.Locals['user']) =>
	await superValidate(
		{
			themeOption: user?.preferences?.themeColor || ThemeOptions.PINK
		},
		zod(themeFormSchema())
	);

export const settingsFormValidator = async (user: App.Locals['user']) => {
	if (!user) {
		throw new Error('User is undefined.');
	}
	const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));

	return await superValidate(
		{
			readReceiptOption: settings.readReceipt || ReadReceiptOptions.NONE,
			email: settings.email || user.email || '',
			ntfyEndpoint: settings.ntfyEndpoint || ''
		},
		zod(settingsFormSchema())
	);
};
