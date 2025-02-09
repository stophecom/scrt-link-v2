import { type ClassValue, clsx } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

// Shadcn utils
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export function styleToString(style: Record<string, number | string | undefined>): string {
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
