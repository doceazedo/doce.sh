import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";

const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0";
const LAST_FM_USERNAME = "doceazedo911";

const getTopArtistIds = async () => {
	try {
		const resp = await fetch(
			`${LAST_FM_BASE_URL}/?method=user.gettopartists&user=${LAST_FM_USERNAME}&period=3month&api_key=${env.LAST_FM_API_KEY}&format=json`,
		);
		const data = await resp.json();
		const artists = data?.topartists?.artist || [];
		return artists.map((x) => x.mbid);
	} catch (_error) {
		return [];
	}
};

const getArtistTopTags = async (mbid: string) => {
	try {
		const resp = await fetch(
			`${LAST_FM_BASE_URL}/?method=artist.getTopTags&mbid=${mbid}&api_key=${env.LAST_FM_API_KEY}&format=json`,
		);
		const data = await resp.json();
		const tags = data?.toptags?.tag || [];
		return tags
			.map((x) => x.name.toLowerCase().replaceAll("-", " "))
			.slice(0, 10);
	} catch (_error) {
		return [];
	}
};

const sortByFrequency = (tags: string[]) => {
	const frequencyMap = new Map<string, number>();
	tags.forEach((str) => {
		frequencyMap.set(str, (frequencyMap.get(str) || 0) + 1);
	});
	return Array.from(frequencyMap.entries())
		.sort((a, b) => b[1] - a[1])
		.map((tag) => tag[0])
		.filter((tag) =>
			["female", "male", "seen live", "better"].every(
				(keyword) => !tag.includes(keyword),
			),
		);
};

export const GET = async () => {
	try {
		const artistIds = await getTopArtistIds();
		const tags = await Promise.all(artistIds.map((id) => getArtistTopTags(id)));
		const mostPopularTags = sortByFrequency(tags.flat()).slice(0, 25);
		return json(mostPopularTags);
	} catch (_error) {
		return json(null);
	}
};
