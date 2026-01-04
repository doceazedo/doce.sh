import { FORTNITE_API_KEY, STEAM_API_KEY } from "$env/static/private";
import { authSuperUser, pbAdmin } from "$lib/pocketbase";
import type {
	LastPlayedGamesRecord,
	LastPlayedGamesResponse,
} from "$lib/pocketbase-types";
import { json } from "@sveltejs/kit";
import SteamUser from "steam-user";

const GAME_COVER_OVERRIDES = {
	fortnite: "/img/now/games/fortnite.webp",
	minecraft: "/img/now/games/minecraft.webp",
	480: "/img/now/games/spacewar.webp",
} as { [appid: number | string]: string };
const STEAM_BASE_URL = "http://api.steampowered.com";
const STEAM_ID = "76561198111145117";
const STEAM_BLOCKLIST = [
	404790, // Godot
];
const FORTNITE_API_BASE_URL = "https://fortnite-api.com/v2";
const FORTNITE_USERNAME = "DoceAzedo911";

let steam: SteamUser | null = null;

export const GET = async () => {
	let lastUpdated = new Date(0);
	try {
		const lastUpdatedGame = await pbAdmin
			.collection("last_played_games")
			.getFirstListItem("", {
				sort: "-updated",
			});
		lastUpdated = new Date(lastUpdatedGame.updated);
	} catch (_error) {
		/* empty */
	}
	const isOlderThan1Day =
		lastUpdated.getTime() <= new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
	if (isOlderThan1Day) {
		await updateLastPlayedGames();
		lastUpdated = new Date();
	}

	const games = await pbAdmin.collection("last_played_games").getList(1, 5, {
		sort: "-playtime_2weeks,-last_played",
	});

	return json({
		games: games.items,
		updatedAt: lastUpdated,
	});
};

const updateLastPlayedGames = async () => {
	if (!steam) {
		steam = new SteamUser();
		steam.logOn({ anonymous: true });
		await new Promise<void>((resolve, reject) => {
			if (!steam) return reject();
			steam.on("loggedOn", () => resolve());
		});
	}

	let cachedGames: LastPlayedGamesResponse[] = [];
	try {
		cachedGames = await pbAdmin.collection("last_played_games").getFullList();
	} catch (_error) {
		/* empty */
	}

	const [steamGames, lastPlayedFortniteAt] = await Promise.all([
		getSteamGames(cachedGames),
		getFortniteLastPlayedAt(),
	]);
	const games: LastPlayedGamesRecord[] = [
		...steamGames.slice(0, 4),
		{
			id: "fortnite",
			name: "Fortnite",
			cover_url: (await getGameCover("fortnite")) || "",
			store_url: "https://www.fortnite.com",
			last_played: lastPlayedFortniteAt,
		},
	];

	await authSuperUser();

	try {
		const batch = pbAdmin.createBatch();
		games.forEach(async (game) => {
			batch.collection("last_played_games").upsert(game);
		});
		const unplayedGames = cachedGames.filter(
			(cached) => !games.find((game) => game.id === cached.id),
		);
		unplayedGames.forEach((game) => {
			batch
				.collection("last_played_games")
				.update(game.id, { playtime_2weeks: 0 });
		});
		await batch.send();
	} catch (_error) {
		console.log(_error);
	}
};

const getSteamGames = async (
	cachedGames: LastPlayedGamesRecord[],
): Promise<Required<LastPlayedGamesRecord>[]> => {
	try {
		const resp = await fetch(
			`${STEAM_BASE_URL}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json`,
		);
		const data = await resp.json();
		if (!data?.response?.games) return [];

		return await Promise.all(
			data.response.games
				.filter((x: { appid: number }) => !STEAM_BLOCKLIST.includes(x.appid))
				.map(
					async (x: {
						name: string;
						appid: number;
						playtime_2weeks: number;
					}) => {
						let lastPlayed = new Date().toISOString();

						const id = x.appid.toString();
						const cachedGame = cachedGames.find((cached) => cached.id === id);

						const cachedPlaytime = cachedGame?.playtime_2weeks || 0;
						// haven't played more, so we can keep the previous date
						if (x.playtime_2weeks === cachedPlaytime) {
							lastPlayed = cachedGame?.last_played || lastPlayed;
						}

						const hasPlayedWithin2Weeks =
							new Date(cachedGame?.last_played || 0).getTime() >=
							new Date().getTime() - 14 * 24 * 60 * 60 * 1000;
						if (cachedGame && !hasPlayedWithin2Weeks) {
							const twoWeeksAgo = new Date();
							twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
							lastPlayed = twoWeeksAgo.toISOString();
						}
						return {
							id,
							name: x.name,
							cover_url: await getGameCover(x.appid),
							store_url: `https://store.steampowered.com/app/${x.appid}`,
							playtime_2weeks: x.playtime_2weeks,
							last_played: lastPlayed,
						};
					},
				),
		);
	} catch (_error) {
		return [];
	}
};

const _gameSteamAppCover = async (appid: number) => {
	if (!steam) return null;

	const app = await steam.getProductInfo([appid], [], true);
	const appInfo = app.apps[appid].appinfo;
	const libraryCapsule = appInfo?.common?.library_assets_full?.library_capsule;
	const cover =
		libraryCapsule?.image2x?.english || libraryCapsule?.image?.english;
	return cover
		? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/${cover}`
		: `https://placehold.co/600x900?text=${encodeURIComponent(appInfo.common.name)}`;
};

const getGameCover = async (appid: number | string) => {
	const overrideCover = GAME_COVER_OVERRIDES?.[appid];
	if (overrideCover) return overrideCover;
	if (typeof appid !== "number") return null;
	return await _gameSteamAppCover(appid);
};

const getFortniteLastPlayedAt = async (): Promise<string | undefined> => {
	try {
		const resp = await fetch(
			`${FORTNITE_API_BASE_URL}/stats/br/v2?name=${FORTNITE_USERNAME}`,
			{
				headers: {
					Authorization: FORTNITE_API_KEY,
				},
			},
		);
		const data = await resp.json();
		return data?.data?.stats?.all?.overall?.lastModified || undefined;
	} catch (_error) {
		return undefined;
	}
};
