import { DOMAIN, EMAIL } from "$lib/constants.js";
import { getLatestBlogPosts } from "$lib/utils/blog-posts";
import { Feed } from "feed";

const author = {
	name: "Doce Fernandes",
	email: EMAIL.replaceAll("doce", "[name]"),
	link: `https://${DOMAIN}/me`,
};

export const GET = async () => {
	const posts = getLatestBlogPosts();

	const feed = new Feed({
		title: "Doce's Blog",
		description:
			"Articles on software engineering, guides, tutorials, and personal notes all mixed together.",
		id: `https://${DOMAIN}`,
		link: `https://${DOMAIN}`,
		language: "en",
		image: `https://${DOMAIN}/favicon.png`,
		favicon: `https://${DOMAIN}/favicon.png`,
		copyright: `Copyleft ${new Date().getFullYear()} Doce Fernandes`,
		updated: new Date(posts[0].date),
		feedLinks: {
			rss: `https://${DOMAIN}/feed`,
		},
		author,
	});

	posts.forEach((post) => {
		feed.addItem({
			title: post.title,
			id: post.slug,
			link: `https://${DOMAIN}/blog/${post.slug}`,
			// description: post.description,
			author: [author],
			date: new Date(post.date),
			image: `https://${DOMAIN}/blog/${post.slug}.png`,
		});
	});

	return new Response(feed.rss2(), {
		headers: {
			"Content-Type": "text/xml",
		},
	});
};
