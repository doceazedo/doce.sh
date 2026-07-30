import {
	getFavoritePhotos,
	getPublicAlbums,
	toFavoritesAlbum,
	toGalleryAlbum,
} from "$lib/immich";
import { json } from "@sveltejs/kit";

export const GET = async () => {
	try {
		const publicAlbums = await getPublicAlbums();
		const favorites = toFavoritesAlbum(await getFavoritePhotos(publicAlbums));

		return json({
			albums: [
				...(favorites ? [favorites] : []),
				...publicAlbums.map(toGalleryAlbum),
			],
		});
	} catch (_error) {
		return json({ albums: [] });
	}
};
