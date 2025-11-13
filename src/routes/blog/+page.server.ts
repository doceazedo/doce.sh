import { getAllBlogPosts } from "$lib/utils/blog-posts";
import type { Post } from "$lib/types";

const groupPostsByYear = (posts: Post[]) => {
	const yearMap: Record<string, Post[]> = {};

	posts.forEach((post) => {
		const year = new Date(post.date).getFullYear().toString();
		if (!yearMap[year]) {
			yearMap[year] = [];
		}
		yearMap[year].push(post);
	});

	return Object.keys(yearMap)
		.sort((a, b) => Number(b) - Number(a))
		.map((year) => yearMap[year]);
};

export const load = async () => {
	const posts = getAllBlogPosts();
	const postsByYear = groupPostsByYear(posts);
	return { postsByYear };
};
