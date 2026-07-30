import { getFavoritePhotos, toFavoritesAlbum } from "$lib/immich";
import type { GalleryAlbum, GalleryAlbumWithItems } from "$lib/immich-types";
import { json } from "@sveltejs/kit";

export const GET = async () => {
	const items = await getFavoritePhotos();
	return json({
		...(toFavoritesAlbum(items) as GalleryAlbum),
		items,
	} satisfies GalleryAlbumWithItems);
};
