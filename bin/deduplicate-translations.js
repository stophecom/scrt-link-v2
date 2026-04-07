import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Execute from the project root
const projectRoot = path.join(import.meta.dirname, '..');
const messagesDir = path.join(projectRoot, 'messages');
const dryRun = process.argv.includes('--dry-run');

if (dryRun) {
	console.log('[DRY RUN] No files will be modified.\n');
}

// 1. Read en.json and find duplicate values
const enPath = path.join(messagesDir, 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const keys = Object.keys(en).filter((k) => k !== '$schema');

const valueToKeys = new Map();
for (const key of keys) {
	const value = en[key];
	if (!valueToKeys.has(value)) {
		valueToKeys.set(value, []);
	}
	valueToKeys.get(value).push(key);
}

const duplicateGroups = [...valueToKeys.entries()]
	.filter(([, keys]) => keys.length > 1)
	.map(([value, keys]) => ({ value, keys }));

if (duplicateGroups.length === 0) {
	console.log('No duplicate translations found.');
	process.exit(0);
}

console.log(`Found ${duplicateGroups.length} duplicate translation groups.\n`);

// 2. Load all locale files for safety check
const localeFiles = fs.readdirSync(messagesDir).filter((f) => f.endsWith('.json'));
const locales = {};
for (const file of localeFiles) {
	locales[file] = JSON.parse(fs.readFileSync(path.join(messagesDir, file), 'utf-8'));
}

// 3. For each group, count usage and pick canonical key
function countUsage(key) {
	try {
		const output = execSync(`git grep -c '${key}' -- src/`, {
			cwd: projectRoot,
			encoding: 'utf-8'
		});
		// Sum counts across all files (output is "file:count" per line)
		return output
			.trim()
			.split('\n')
			.reduce((sum, line) => sum + parseInt(line.split(':').pop(), 10), 0);
	} catch {
		return 0;
	}
}

function checkLocaleConsistency(keys) {
	for (const file of localeFiles) {
		if (file === 'en.json') continue;
		const locale = locales[file];
		const values = keys.map((k) => locale[k]).filter((v) => v != null);
		// If some keys are missing in this locale, that's fine (they'll be cleaned up)
		if (values.length <= 1) continue;
		// Check all present values are identical
		if (new Set(values).size > 1) {
			return { consistent: false, file, values };
		}
	}
	return { consistent: true };
}

const replacements = []; // { canonical, duplicates, value }
let skipped = 0;

for (const group of duplicateGroups) {
	// Safety check: ensure all locales have consistent values for this group
	const consistency = checkLocaleConsistency(group.keys);
	if (!consistency.consistent) {
		console.log(
			`⚠ Skipping group "${group.value.substring(0, 50)}..." — translations differ in ${consistency.file}`
		);
		skipped++;
		continue;
	}

	// Count usage for each key
	const keysWithCount = group.keys.map((key) => ({
		key,
		count: countUsage(key)
	}));

	// Sort by count desc, then alphabetically for ties
	keysWithCount.sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

	const canonical = keysWithCount[0].key;
	const duplicates = keysWithCount.slice(1).map((k) => k.key);

	console.log(`"${group.value.substring(0, 60)}":`);
	console.log(`  Keep:   ${canonical} (${keysWithCount[0].count} refs)`);
	for (let i = 1; i < keysWithCount.length; i++) {
		console.log(`  Remove: ${keysWithCount[i].key} (${keysWithCount[i].count} refs)`);
	}
	console.log();

	replacements.push({ canonical, duplicates, value: group.value });
}

if (replacements.length === 0) {
	console.log('No safe replacements to make.');
	process.exit(0);
}

if (dryRun) {
	console.log(`\n[DRY RUN] Would process ${replacements.length} groups, skipped ${skipped}.`);
	process.exit(0);
}

// 4. Replace references in source files
let filesModified = 0;
let totalReplacements = 0;

for (const { canonical, duplicates } of replacements) {
	for (const dup of duplicates) {
		let files;
		try {
			files = execSync(`git grep -l '${dup}' -- src/`, {
				cwd: projectRoot,
				encoding: 'utf-8'
			})
				.trim()
				.split('\n')
				.filter(Boolean);
		} catch {
			// Key not found in source
			continue;
		}

		for (const file of files) {
			const filePath = path.join(projectRoot, file);
			const content = fs.readFileSync(filePath, 'utf-8');
			const updated = content.replaceAll(dup, canonical);
			if (content !== updated) {
				fs.writeFileSync(filePath, updated);
				const count = (content.match(new RegExp(dup, 'g')) || []).length;
				console.log(`Replaced ${count}x ${dup} → ${canonical} in ${file}`);
				totalReplacements += count;
				filesModified++;
			}
		}
	}
}

// 5. Remove duplicate keys from all locale files
const allDuplicateKeys = new Set(replacements.flatMap((r) => r.duplicates));
let keysRemoved = 0;

for (const file of localeFiles) {
	const filePath = path.join(messagesDir, file);
	const content = locales[file];
	let removed = 0;
	for (const key of allDuplicateKeys) {
		if (key in content) {
			delete content[key];
			removed++;
		}
	}
	if (removed > 0) {
		fs.writeFileSync(filePath, JSON.stringify(content, null, '\t') + '\n');
		console.log(`Removed ${removed} keys from ${file}`);
		keysRemoved += removed;
	}
}

// 6. Summary
console.log('\n--- Summary ---');
console.log(`Duplicate groups processed: ${replacements.length}`);
console.log(`Groups skipped (inconsistent): ${skipped}`);
console.log(`Source file replacements: ${totalReplacements} across ${filesModified} file edits`);
console.log(`Translation keys removed: ${keysRemoved}`);
