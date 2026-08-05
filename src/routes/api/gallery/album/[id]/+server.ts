import {
	getAlbumAssets,
	getPublicAlbums,
	toGalleryAlbum,
	toGalleryPhoto,
} from "$lib/immich";
import type { GalleryAlbumWithItems } from "$lib/immich-types";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
	const albums = await getPublicAlbums();
	const publicAlbum = albums.find(({ album }) => album.id === params.id);
	if (!publicAlbum) error(404, "Album not found");

	let items: GalleryAlbumWithItems["items"] = [];
	try {
		const assets = await getAlbumAssets(publicAlbum.album.id);
		items = assets.map((asset) => toGalleryPhoto(asset, publicAlbum.key));
	} catch (_error) {
		/* empty */
	}

	return json({
		...toGalleryAlbum(publicAlbum, items),
		items,
	} satisfies GalleryAlbumWithItems);
};
