import { LAST_FM_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";

const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0";
const LAST_FM_USERNAME = "doceazedo911";

const getTopArtists = async (): Promise<
	{ name: string; playcount: string; url: string /* ... */ }[]
> => {
	try {
		const resp = await fetch(
			`${LAST_FM_BASE_URL}/?method=user.gettopartists&user=${LAST_FM_USERNAME}&period=3month&api_key=${LAST_FM_API_KEY}&format=json`,
		);
		const data = await resp.json();
		const artists = data?.topartists?.artist || [];
		return artists;
	} catch (_error) {
		return [];
	}
};

const DEEZER_API_BASE_URL = "https://api.deezer.com";

const getArtistImage = async (artist: string) => {
	try {
		const resp = await fetch(
			`${DEEZER_API_BASE_URL}/search/artist?q=${encodeURIComponent(artist)}`,
		);
		const data = await resp.json();
		const artists =
			data?.data?.find(
				(x: { name: string /* ... */ }) =>
					x?.name?.toLowerCase() === artist.toLowerCase(),
			)?.picture_medium ||
			data?.data?.[0]?.picture_medium ||
			"/img/now/lastfm-placeholder.webp";
		return artists;
	} catch (_error) {
		return [];
	}
};

export const GET = async () => {
	try {
		const artists = await getTopArtists();
		const artistsWithImage = await Promise.all(
			artists.slice(0, 9).map(async (artist) => {
				const image = await getArtistImage(artist.name);
				return {
					name: artist.name,
					image,
					plays: parseInt(artist.playcount),
					url: artist.url,
				};
			}),
		);
		return json(artistsWithImage);
	} catch (_error) {
		return json(null);
	}
};
