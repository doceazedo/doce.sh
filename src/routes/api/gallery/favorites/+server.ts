import { getFavoritePhotos } from "$lib/immich";
import { json } from "@sveltejs/kit";

export const GET = async () => {
	try {
		return json(await getFavoritePhotos());
	} catch (_error) {
		return json([]);
	}
};
