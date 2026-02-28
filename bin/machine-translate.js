#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

// Using Gemini API (currently used AI model)
// User must export GEMINI_API_KEY
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
	console.error('Error: Please provide GEMINI_API_KEY in your environment to run translation.');
	console.error('Example: GEMINI_API_KEY=your_key npm run machine-translate');
	process.exit(1);
}

const localesDir = path.join(process.cwd(), 'messages');

async function translateKeys(missingKeys, targetLanguage) {
	const prompt = `You are a professional translator. Translate the following JSON values from English to ${targetLanguage}. 
Keep the exact same JSON keys. Return ONLY valid JSON, no markdown formatting.

JSON to translate:
${JSON.stringify(missingKeys, null, 2)}`;

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				systemInstruction: {
					parts: [
						{
							text: 'Output ONLY valid JSON containing the translated values for the given keys. Do not include markdown blocks like ```json.'
						}
					]
				},
				contents: [
					{
						parts: [{ text: prompt }]
					}
				],
				generationConfig: {
					responseMimeType: 'application/json'
				}
			})
		}
	);

	if (!response.ok) {
		const errText = await response.text();
		throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errText}`);
	}

	const data = await response.json();

	try {
		const textContent = data.candidates[0].content.parts[0].text;
		return JSON.parse(textContent);
	} catch (e) {
		console.error('Failed to parse Gemini response as JSON. Raw response:');
		console.error(JSON.stringify(data, null, 2));
		throw e;
	}
}

async function main() {
	try {
		const files = await fs.readdir(localesDir);
		const jsonFiles = files.filter((f) => f.endsWith('.json'));

		if (!jsonFiles.includes('en.json')) {
			console.error('en.json not found in messages directory!');
			process.exit(1);
		}

		const enRaw = await fs.readFile(path.join(localesDir, 'en.json'), 'utf-8');
		const enData = JSON.parse(enRaw);
		const enKeys = Object.keys(enData);

		for (const file of jsonFiles) {
			if (file === 'en.json') continue;

			const lang = file.replace('.json', '');
			const targetPath = path.join(localesDir, file);
			const targetRaw = await fs.readFile(targetPath, 'utf-8');
			const targetData = JSON.parse(targetRaw);

			const missingKeys = {};
			for (const key of enKeys) {
				if (targetData[key] === undefined || targetData[key] === null || targetData[key] === '') {
					missingKeys[key] = enData[key];
				}
			}

			const missingCount = Object.keys(missingKeys).length;
			if (missingCount > 0) {
				console.log(`\nFound ${missingCount} missing keys for ${lang} (${file}). Translating...`);

				const translated = await translateKeys(missingKeys, lang);

				// Merge taking care of keeping the en.json sort order
				const finalData = {};
				for (const key of enKeys) {
					if (targetData[key] !== undefined && targetData[key] !== null && targetData[key] !== '') {
						finalData[key] = targetData[key];
					} else if (translated[key]) {
						finalData[key] = translated[key];
					} else {
						// Fallback to english if translation failed for a specific key unexpectedly
						finalData[key] = enData[key];
					}
				}

				await fs.writeFile(targetPath, JSON.stringify(finalData, null, '\t') + '\n', 'utf-8');
				console.log(`✅ Successfully updated ${file}`);
			} else {
				console.log(`\n✅ ${lang} (${file}) is up to date.`);
			}
		}

		console.log('\nAll languages checked and updated!');
	} catch (error) {
		console.error('An error occurred during translation:', error);
		process.exit(1);
	}
}

main();
