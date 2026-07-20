import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0";
const LAST_FM_USERNAME = "doceazedo911";

const getTopArtists = async (): Promise<
	{ name: string; playcount: string; url: string /* ... */ }[]
> => {
	try {
		const resp = await fetch(
			`${LAST_FM_BASE_URL}/?method=user.gettopartists&user=${LAST_FM_USERNAME}&period=3month&api_key=${env.LAST_FM_API_KEY}&format=json`,
		);
		const data = await resp.json();
		const artists = data?.topartists?.artist || [];
		return artists;
	} catch (_error) {
		return [];
	}
};

let spotify: SpotifyApi | null = null;

const getSpotify = () => {
	if (!spotify) {
		spotify = SpotifyApi.withClientCredentials(
			env.SPOTIFY_CLIENT_ID,
			env.SPOTIFY_CLIENT_SECRET,
		);
	}
	return spotify;
};

const getArtistImage = async (artist: string) => {
	try {
		const { artists } = await getSpotify().search(artist, ["artist"], undefined, 5);
		const match =
			artists.items.find(
				(x) => x.name.toLowerCase() === artist.toLowerCase(),
			) || artists.items[0];
		return (
			match?.images?.[1]?.url ||
			match?.images?.[0]?.url ||
			"/img/now/lastfm-placeholder.webp"
		);
	} catch (_error) {
		console.error("error fetching artist image:");
		console.error(_error);
		return "/img/now/lastfm-placeholder.webp";
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
