import { json } from "@sveltejs/kit";
import { SOCIALS } from "$lib/constants";
import type { Movie, MoviesApiResponse } from "$lib/types";

const LIMIT = 6;

type DiaryEntry = {
	id: string;
	film: {
		slug: string;
		title: string;
		year: number;
		url: string;
		poster: string;
	};
	watchedAt: string;
	rating: number | null;
	liked: boolean;
	rewatched: boolean;
	reviewed: boolean;
	url: string;
};

type DiaryResponse = {
	entries: DiaryEntry[];
	updatedAt?: string;
};

export const GET = async ({ fetch }) => {
	try {
		const resp = await fetch(
			`https://wyd.doce.sh/api/letterboxd/${SOCIALS.letterboxd.handle}/diary`,
		);
		if (!resp.ok) throw new Error(`wyd responded with ${resp.status}`);
		const data = (await resp.json()) as DiaryResponse;
		const movies: Movie[] = data.entries.slice(0, LIMIT).map((entry) => ({
			id: entry.film.slug,
			title: entry.film.title,
			year: entry.film.year,
			url: entry.url,
			poster: entry.film.poster,
			watched: entry.watchedAt,
			rating: entry.rating,
			liked: entry.liked,
			rewatched: entry.rewatched,
			reviewed: entry.reviewed,
		}));
		return json({
			updatedAt: data.updatedAt ?? null,
			movies,
		} satisfies MoviesApiResponse);
	} catch (_error) {
		console.log(_error);
		return json({ updatedAt: null, movies: [] } satisfies MoviesApiResponse);
	}
};
