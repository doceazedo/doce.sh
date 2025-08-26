import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import rehypeSlug from "rehype-slug";
import pluginToc from "remark-table-of-content";
import codeTitle from "remark-code-title";
import rehypeExternalLinks from "rehype-external-links";

const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: [".md"],
			remarkPlugins: [
				[pluginToc, { property: ["metadata", "toc"] }],
				codeTitle,
			],
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeExternalLinks,
					{ target: "_blank", rel: ["noopener", "noreferrer"] },
				],
			],
		}),
	],
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: "ignore",
			handleMissingId: "ignore",
		},
	},
	extensions: [".svelte", ".md"],
};

export default config;
