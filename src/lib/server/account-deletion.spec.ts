import { describe, expect, test } from 'vitest';

import {
	type OwnedOrganizationState,
	planOwnedOrganizationsForAccountDeletion
} from './account-deletion';

const org = (overrides: Partial<OwnedOrganizationState> = {}): OwnedOrganizationState => ({
	id: 'org-1',
	name: 'Acme',
	stripeCustomerId: 'cus_1',
	ownerCount: 1,
	memberCount: 1,
	...overrides
});

describe('planOwnedOrganizationsForAccountDeletion', () => {
	test('an org with another owner is neither blocked nor orphaned', () => {
		const result = planOwnedOrganizationsForAccountDeletion([
			org({ ownerCount: 2, memberCount: 5 })
		]);

		expect(result.blocked).toEqual([]);
		expect(result.orphaned).toEqual([]);
	});

	test('a sole-owned org with other members blocks account deletion', () => {
		const target = org({ ownerCount: 1, memberCount: 3 });
		const result = planOwnedOrganizationsForAccountDeletion([target]);

		expect(result.blocked).toEqual([target]);
		expect(result.orphaned).toEqual([]);
	});

	test('a sole-owned org without other members is orphaned', () => {
		const target = org({ ownerCount: 1, memberCount: 1 });
		const result = planOwnedOrganizationsForAccountDeletion([target]);

		expect(result.blocked).toEqual([]);
		expect(result.orphaned).toEqual([target]);
	});

	test('orgs are classified independently', () => {
		const shared = org({ id: 'shared', ownerCount: 2, memberCount: 4 });
		const stranded = org({ id: 'stranded', ownerCount: 1, memberCount: 2 });
		const solo = org({ id: 'solo', ownerCount: 1, memberCount: 1 });

		const result = planOwnedOrganizationsForAccountDeletion([shared, stranded, solo]);

		expect(result.blocked).toEqual([stranded]);
		expect(result.orphaned).toEqual([solo]);
	});

	test('no owned orgs means nothing to do', () => {
		expect(planOwnedOrganizationsForAccountDeletion([])).toEqual({ blocked: [], orphaned: [] });
	});
});
