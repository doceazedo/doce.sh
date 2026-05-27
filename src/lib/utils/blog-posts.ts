import type { Post } from "$lib/types";

export const getAllBlogPosts = () => {
	let posts: Post[] = [];
	const paths = import.meta.glob("/src/routes/blog/**/+page.md", {
		eager: true,
	});
	for (const path in paths) {
		const file = paths[path] as Post;
		const slug = path.split("/")[5];

		const metadata = file.metadata;
		const post = { ...metadata, slug } as unknown as Post;
		posts.push(post);

		posts = posts.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
	}
	return posts;
};

export const getLatestBlogPosts = () => {
	let posts = getAllBlogPosts();
	const pinnedPosts = posts.filter((post) => post.pinned);
	if (pinnedPosts) {
		posts = [...pinnedPosts, ...posts.filter((post) => !post.pinned)];
	}

	return posts.slice(0, 6);
};
