import { getLocale } from "$lib/paraglide/runtime";

export const getLocalizedTextLine = (text: string) => {
	const tag = `[${getLocale()}]`;
	return (
		text
			.split("\n")
			.find((line) => line.startsWith(tag))
			?.replace(tag, "")
			.trim() || ""
	);
};
