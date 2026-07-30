import { getPublicAlbums, toGalleryAlbum } from "$lib/immich";
import { json } from "@sveltejs/kit";

export const GET = async () => {
	try {
		const albums = await getPublicAlbums();
		return json({ albums: albums.map(toGalleryAlbum) });
	} catch (_error) {
		return json({ albums: [] });
	}
};
