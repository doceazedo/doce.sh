import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { html } from "satori-html";
import GabaritoRegular from "$lib/fonts/Gabarito-Regular.ttf?arraybuffer";
import GabaritoBold from "$lib/fonts/Gabarito-Bold.ttf?arraybuffer";
import GabaritoMedium from "$lib/fonts/Gabarito-Medium.ttf?arraybuffer";
import type { Post } from "$lib/types.js";
import { error } from "@sveltejs/kit";
import type { EntryGenerator } from "./$types";
import { getAllBlogPosts } from "$lib/utils/blog-posts";
import { DOMAIN } from "$lib/constants";

export const GET = async ({ params }) => {
	let post: Post;
	try {
		const { metadata } = await import(`../(posts)/${params.slug}/+page.md`);
		post = metadata;
	} catch (_error) {
		return error(404);
	}

	const BASE_URL = `https://${DOMAIN}`;
	const publishedAt = new Date(post.date).toLocaleDateString("en", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const reactLike = html(`
    <div tw="text-white flex flex-col w-[1200px] h-[630px] p-12 pr-48" style="background-image:url(${BASE_URL}/img/thumbnail-background.jpg)">
      <h1 tw="text-primary m-0 text-7xl leading-tight">${post.title}</h1>
      <div class="flex items-center mt-auto">
        <img src="${BASE_URL}/img/avatar.jpg" width="112" height="112" class="rounded-full mr-6" />
        <div class="flex flex-col">
          <p class="text-4xl m-0 font-medium">Doce Fernandes</p>
          <p class="text-3xl opacity-70 m-0">${publishedAt}</p>
        </div>
      </div>
    </div>
		<img src="${BASE_URL}/img/thumbnail-foreground.png" width="1200" height="630" class="absolute top-0 left-0" />
  `);

	const svg = await satori(reactLike, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "Gabarito",
				data: GabaritoRegular,
				weight: 400,
			},
			{
				name: "Gabarito",
				data: GabaritoMedium,
				weight: 500,
			},
			{
				name: "Gabarito",
				data: GabaritoBold,
				weight: 700,
			},
		],
	});

	const png = new Resvg(svg, {
		fitTo: { mode: "original" },
	})
		.render()
		.asPng();

	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
		},
	});
};

export const entries: EntryGenerator = () => {
	return getAllBlogPosts().map((x) => ({ slug: x.slug }));
};
