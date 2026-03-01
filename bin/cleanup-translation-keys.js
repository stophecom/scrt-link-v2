import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Execute from the project root
const projectRoot = path.join(import.meta.dirname, '..');

// 1. Find unused keys
const enString = fs.readFileSync(path.join(projectRoot, 'messages/en.json'), 'utf-8');
const en = JSON.parse(enString);
const keys = Object.keys(en).filter((k) => k !== '$schema');
const unusedKeys = new Set();

for (const key of keys) {
	try {
		execSync(`git grep -q '${key}' src/`, { cwd: projectRoot });
	} catch {
		unusedKeys.add(key);
	}
}

console.log('Found ' + unusedKeys.size + ' unused keys.');

if (unusedKeys.size === 0) {
	console.log('Nothing to do.');
	process.exit(0);
}

// 2. Remove them from all json files in messages/
const messagesDir = path.join(projectRoot, 'messages');
const files = fs.readdirSync(messagesDir).filter((f) => f.endsWith('.json'));

for (const file of files) {
	const filePath = path.join(messagesDir, file);
	const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	let removed = 0;
	for (const key of unusedKeys) {
		if (key in content) {
			delete content[key];
			removed++;
		}
	}
	fs.writeFileSync(filePath, JSON.stringify(content, null, '\t') + '\n');
	console.log('Removed ' + removed + ' keys from ' + file);
}
