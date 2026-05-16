import { type ClassValue, clsx } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

// Shadcn utils
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Utility type for bits-ui component wrappers (used by shadcn-svelte)
export type WithElementRef<T> = T & { ref?: HTMLElement | null };

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

function styleToString(style: Record<string, number | string | undefined>): string {
	return Object.keys(style).reduce((str, key) => {
		if (style[key] === undefined) return str;
		return `${str}${key}:${style[key]};`;
	}, '');
}

export function flyAndScale(
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
}

// Custom
export const copyText = (text: string) => navigator.clipboard.writeText(text);

export const createDownloadLinkAndClick = (url: string, fileName?: string) => {
	const a = document.createElement('a');
	a.href = url;

	if (fileName) {
		a.download = fileName;
	}
	document.body.appendChild(a);
	a.click();
};

export const sendMessageToServiceWorker = <T>(msg: Record<string, unknown>): Promise<T> => {
	return new Promise((resolve, reject) => {
		const channel = new MessageChannel();

		channel.port1.onmessage = (event) => {
			if (event.data === undefined) {
				reject('bad response from serviceWorker');
			} else if (event.data.error !== undefined) {
				reject(event.data.error);
			} else {
				resolve(event.data);
			}
		};

		navigator?.serviceWorker?.controller?.postMessage(msg, [channel.port2]);
	});
};

export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// RFC 3492 punycode decode (single label, without the "xn--" prefix).
function punycodeDecodeLabel(input: string): string {
	const base = 36;
	const tMin = 1;
	const tMax = 26;
	const skew = 38;
	const damp = 700;
	const baseMinusTMin = base - tMin;

	const adapt = (delta: number, numPoints: number, firstTime: boolean) => {
		delta = firstTime ? Math.floor(delta / damp) : delta >> 1;
		delta += Math.floor(delta / numPoints);
		let k = 0;
		for (; delta > (baseMinusTMin * tMax) >> 1; k += base) {
			delta = Math.floor(delta / baseMinusTMin);
		}
		return Math.floor(k + ((baseMinusTMin + 1) * delta) / (delta + skew));
	};

	const decodeDigit = (cp: number) => {
		if (cp - 48 < 10) return cp - 22;
		if (cp - 65 < 26) return cp - 65;
		if (cp - 97 < 26) return cp - 97;
		return base;
	};

	const output: number[] = [];
	let i = 0;
	let n = 128;
	let bias = 72;

	const delimiter = input.lastIndexOf('-');
	const basic = delimiter < 0 ? 0 : delimiter;
	for (let j = 0; j < basic; j++) {
		output.push(input.charCodeAt(j));
	}

	for (let index = basic > 0 ? basic + 1 : 0; index < input.length; ) {
		const oldi = i;
		for (let w = 1, k = base; ; k += base) {
			const digit = decodeDigit(input.charCodeAt(index++));
			i += digit * w;
			const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
			if (digit < t) break;
			w *= base - t;
		}
		const out = output.length + 1;
		bias = adapt(i - oldi, out, oldi === 0);
		n += Math.floor(i / out);
		i %= out;
		output.splice(i++, 0, n);
	}

	return String.fromCodePoint(...output);
}

// Converts a punycode/IDN host (e.g. "xn--kq9h.st") to its Unicode form
// (e.g. "🤫.st"). No-op string check for non-IDN hosts, so it's effectively
// free for normal domains.
export function hostToUnicode(host: string): string {
	if (!host.includes('xn--')) return host;
	return host
		.split('.')
		.map((label) =>
			label.toLowerCase().startsWith('xn--') ? punycodeDecodeLabel(label.slice(4)) : label
		)
		.join('.');
}

// Converts the punycode host within an origin/URL to Unicode, leaving the
// protocol, port, path and hash untouched.
export function originToUnicode(origin: string): string {
	if (!origin.includes('xn--')) return origin;
	try {
		const url = new URL(origin);
		const unicodeHost = hostToUnicode(url.hostname);
		if (unicodeHost === url.hostname) return origin;
		const port = url.port ? `:${url.port}` : '';
		return `${url.protocol}//${unicodeHost}${port}${url.pathname === '/' ? '' : url.pathname}${url.search}${url.hash}`;
	} catch {
		return origin;
	}
}
