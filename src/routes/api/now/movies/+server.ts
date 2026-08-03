import { pbAdmin } from "$lib/pocketbase.js";
import { json } from "@sveltejs/kit";

const LIMIT = 6;

export const GET = async () => {
	try {
		const movies = await pbAdmin.collection("movies").getList(1, LIMIT, {
			sort: "-watched",
		});
		return json(movies.items);
	} catch (_error) {
		console.log(_error);
		return json([]);
	}
};
