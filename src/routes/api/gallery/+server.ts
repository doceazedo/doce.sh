import {
	getAlbumsPhotos,
	getFavoritePhotos,
	getPublicAlbums,
	toFavoritesAlbum,
	toGalleryAlbum,
} from "$lib/immich";
import { json } from "@sveltejs/kit";

export const GET = async () => {
	try {
		const publicAlbums = await getPublicAlbums();
		const albumsPhotos = await getAlbumsPhotos(publicAlbums);
		const favorites = toFavoritesAlbum(await getFavoritePhotos(albumsPhotos));

		return json({
			albums: [
				...(favorites ? [favorites] : []),
				...publicAlbums.map((publicAlbum) =>
					toGalleryAlbum(publicAlbum, albumsPhotos.get(publicAlbum.album.id)),
				),
			],
		});
	} catch (_error) {
		return json({ albums: [] });
	}
};
