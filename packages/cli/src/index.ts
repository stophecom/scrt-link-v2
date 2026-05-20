import scrtLink, { SecretType } from '@scrt-link/client';
import { program } from 'commander';

const EXPIRES_MAP: Record<string, number> = {
	'10m': 10 * 60 * 1000,
	'1h': 60 * 60 * 1000,
	'1d': 24 * 60 * 60 * 1000,
	'1w': 7 * 24 * 60 * 60 * 1000,
	'1m': 30 * 24 * 60 * 60 * 1000
};

const TYPE_MAP: Record<string, SecretType> = {
	text: SecretType.TEXT,
	redirect: SecretType.REDIRECT,
	neogram: SecretType.NEOGRAM
};

program
	.name('scrtlink')
	.description('Create end-to-end encrypted secrets from the command line')
	.version('0.0.1')
	.argument('<secret>', 'The secret content to encrypt and share')
	.option('--type <type>', 'Secret type: text | redirect | neogram (default: text)')
	.option('--expires <duration>', 'Expiration: 10m | 1h | 1d | 1w | 1m (default: 1w)')
	.option('--views <n>', 'View limit 1–1000 (default: 1)')
	.option('--note <text>', 'Public note visible to the recipient before revealing')
	.option('--password <pass>', 'Password-protect the secret')
	.option('--host <host>', 'API host for self-hosted instances (default: scrt.link)')
	.option('--api-key <key>', 'API key (or set SCRT_LINK_API_KEY env var)')
	.action(async (secret: string, opts) => {
		const apiKey: string = opts.apiKey ?? process.env.SCRT_LINK_API_KEY ?? '';
		if (!apiKey) {
			console.error('Error: API key required. Use --api-key or set SCRT_LINK_API_KEY.');
			process.exit(1);
		}

		const expiresIn = EXPIRES_MAP[opts.expires ?? '1w'] ?? EXPIRES_MAP['1w'];
		const viewLimit = opts.views !== undefined ? parseInt(opts.views, 10) : 1;
		const secretType = TYPE_MAP[opts.type ?? 'text'] ?? SecretType.TEXT;

		try {
			const client = scrtLink(apiKey);
			const result = await client.createSecret(secret, {
				secretType,
				expiresIn,
				viewLimit,
				publicNote: opts.note,
				password: opts.password,
				host: opts.host
			});

			if ('secretLink' in result && result.secretLink) {
				process.stdout.write(result.secretLink + '\n');
			} else {
				console.error('Error:', (result as { message?: string }).message ?? 'Unknown error');
				process.exit(1);
			}
		} catch (err) {
			console.error('Error:', err instanceof Error ? err.message : String(err));
			process.exit(1);
		}
	});

program.parse();
