import type { Organization } from './db/schema';

export type OwnedOrganizationState = {
	id: Organization['id'];
	name: Organization['name'];
	stripeCustomerId: Organization['stripeCustomerId'];
	ownerCount: number;
	memberCount: number;
};

export type AccountDeletionOrganizationPlan = {
	/**
	 * Organizations solely owned by the user that still have other members.
	 * Nobody left could cancel billing or delete the org, so account deletion
	 * must be blocked until ownership is transferred or the org is deleted.
	 */
	blocked: OwnedOrganizationState[];
	/**
	 * Organizations solely owned by the user where they are also the only
	 * member. These can be canceled and deleted along with the account.
	 */
	orphaned: OwnedOrganizationState[];
};

/**
 * Decides what happens to the organizations a user owns when they delete their
 * account. Organizations are not owned by the user record — deleting the
 * account only cascades the membership — so an organization's own Stripe
 * subscription would otherwise keep renewing with nobody left to cancel it.
 */
export const planOwnedOrganizationsForAccountDeletion = (
	ownedOrganizations: OwnedOrganizationState[]
): AccountDeletionOrganizationPlan => {
	const soleOwned = ownedOrganizations.filter((org) => org.ownerCount <= 1);

	return {
		blocked: soleOwned.filter((org) => org.memberCount > 1),
		orphaned: soleOwned.filter((org) => org.memberCount <= 1)
	};
};
