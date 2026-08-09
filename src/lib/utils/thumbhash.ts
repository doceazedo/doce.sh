import { rgbaToDataURL, thumbHashToRGBA } from "thumbhash";

const PLACEHOLDER_WIDTH = 32;

export const thumbhashToDataUrl = (
	hash: string | null,
	width: number | null,
	height: number | null,
) => {
	if (!hash) return null;

	try {
		const bytes = Uint8Array.from(atob(hash), (char) => char.charCodeAt(0));
		const source = thumbHashToRGBA(bytes);

		if (!width || !height) {
			return rgbaToDataURL(source.w, source.h, source.rgba);
		}

		const targetHeight = Math.max(
			1,
			Math.round((PLACEHOLDER_WIDTH * height) / width),
		);
		const target = new Uint8Array(PLACEHOLDER_WIDTH * targetHeight * 4);

		for (let y = 0; y < targetHeight; y++) {
			const sourceY = Math.min(
				source.h - 1,
				Math.floor((y * source.h) / targetHeight),
			);
			for (let x = 0; x < PLACEHOLDER_WIDTH; x++) {
				const sourceX = Math.min(
					source.w - 1,
					Math.floor((x * source.w) / PLACEHOLDER_WIDTH),
				);
				const from = (sourceY * source.w + sourceX) * 4;
				target.set(
					source.rgba.subarray(from, from + 4),
					(y * PLACEHOLDER_WIDTH + x) * 4,
				);
			}
		}

		return rgbaToDataURL(PLACEHOLDER_WIDTH, targetHeight, target);
	} catch (_error) {
		return null;
	}
};
