import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { MAX_ORGANIZATIONS_PER_USER } from '$lib/constants';
import { MembershipRole } from '$lib/data/enums';
import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { membership, organization } from '$lib/server/db/schema';
import { getOrganizationsByUserId } from '$lib/server/organization';
import { organizationFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const organizationForm = await superValidate(zod4(organizationFormSchema()), { errors: false });

	return { organizationForm };
};

export const actions: Actions = {
	createOrganization: async (event) => {
		const form = await superValidate(event.request, zod4(organizationFormSchema()));
		const user = event.locals.user;

		if (!form.valid) return fail(400, { form });
		if (!user) return redirectLocalized(307, '/signup');

		const userOrganizations = await getOrganizationsByUserId(user.id);

		if (userOrganizations.length >= MAX_ORGANIZATIONS_PER_USER) {
			return fail(400, {
				form: {
					...form,
					message: {
						status: 'error' as const,
						title: m.plane_solid_shrike_coax(),
						description: m.merry_suave_bullock_race({ amount: MAX_ORGANIZATIONS_PER_USER })
					}
				}
			});
		}

		const [org] = await db
			.insert(organization)
			.values({ createdBy: user.id, name: form.data.name })
			.returning();

		await db.insert(membership).values({
			userId: user.id,
			organizationId: org.id,
			role: MembershipRole.OWNER
		});

		return redirectLocalized(303, `/account/org/${org.id}`);
	}
};
