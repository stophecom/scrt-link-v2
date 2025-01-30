const MIN = 1000 * 60;
const DAY = 24 * 60 * MIN;

export const getExpiresAtOptions = () => [
	{
		value: '10m',
		label: '10 minutes',
		ms: 10 * MIN
	},
	{
		value: '1h',
		label: '1 hour',
		ms: 60 * MIN
	},
	{
		value: '24h',
		label: '24 hours',
		ms: DAY
	},
	{
		value: '7d',
		label: '7 days',
		ms: 7 * DAY
	},
	{
		value: '30d',
		label: '30 days',
		ms: 30 * DAY
	}
];

export const getReadReceiptOptions = () => [
	{
		value: 'none',
		label: 'None'
	},
	{
		value: 'email',
		label: 'Email'
	},
	{
		value: 'ntfy',
		label: 'Ntfy*'
	}
];
