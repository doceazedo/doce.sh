import { getAlbumAssets, getPublicAlbums, toGalleryPhoto } from "$lib/immich";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
	const albums = await getPublicAlbums();
	const publicAlbum = albums.find(({ album }) => album.id === params.id);
	if (!publicAlbum) error(404, "Album not found");

	try {
		const assets = await getAlbumAssets(publicAlbum.album.id);
		return json(assets.map((asset) => toGalleryPhoto(asset, publicAlbum.key)));
	} catch (_error) {
		return json([]);
	}
};
