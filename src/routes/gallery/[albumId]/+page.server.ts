import { error } from "@sveltejs/kit";
import type { GalleryAlbumWithItems } from "$lib/immich-types";

export const load = async ({ params, fetch }) => {
	try {
		const data = await fetch(`/api/gallery/album/${params.albumId}`);
		if (data.status >= 400) {
			throw error(404);
		}
		const album = (await data.json()) as GalleryAlbumWithItems;
		return { album };
	} catch (_) {
		console.log(_);
		throw error(500);
	}
};
