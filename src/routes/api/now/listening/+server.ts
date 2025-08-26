import { LAST_FM_API_KEY } from "$env/static/private";
import type { LastPlayedTracksRecord } from "$lib/pocketbase-types.js";
import { authSuperUser, pbAdmin } from "$lib/pocketbase.js";
import { json } from "@sveltejs/kit";

const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0";
const LAST_FM_USERNAME = "doceazedo911";

export const GET = async ({ url }) => {
	const limit = parseInt(url.searchParams.get("limit") || "1");
	try {
		const cachedTracks = await pbAdmin
			.collection("last_played_tracks")
			.getList(1, limit, {
				sort: "-played",
			});
		let tracks: LastPlayedTracksRecord[] = cachedTracks.items;

		const lastUpdated = new Date(cachedTracks.items?.[0]?.updated || 0);
		const isOlderThan90Seconds =
			lastUpdated.getTime() <= new Date().getTime() - 90 * 1000;
		if (isOlderThan90Seconds) {
			tracks = await updateLastPlayedTracks();
		}

		if (limit === 1 && tracks.length) return json(tracks[0]);
		return json(tracks.slice(0, limit));
	} catch (_error) {
		return json(null);
	}
};

const updateLastPlayedTracks = async (): Promise<LastPlayedTracksRecord[]> => {
	try {
		const resp = await fetch(
			`${LAST_FM_BASE_URL}/?method=user.getrecenttracks&user=${LAST_FM_USERNAME}&limit=20&api_key=${LAST_FM_API_KEY}&format=json`,
		);
		const data = await resp.json();

		const tracks = data?.recenttracks?.track?.map((track, i) => ({
			id: i.toString(),
			artist: track.artist["#text"],
			track: track.name,
			cover_url:
				track?.image?.[2]?.["#text"] || "/img/album-cover-fallback.webp",
			now_playing: track?.["@attr"]?.nowplaying === "true",
			played: track?.date?.uts
				? new Date(parseInt(track?.date?.uts) * 1000).toISOString()
				: new Date().toISOString(),
		}));

		await authSuperUser();
		const batch = pbAdmin.createBatch();
		tracks.forEach((track) => {
			batch.collection("last_played_tracks").upsert(track);
		});
		await batch.send();

		return tracks;
	} catch (_error) {
		return [];
	}
};
