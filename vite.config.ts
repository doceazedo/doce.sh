import tailwindcss from "@tailwindcss/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import svg from "@poppanator/sveltekit-svg";
import { threlteStudio } from "@threlte/studio/vite";
import arraybuffer from "vite-plugin-arraybuffer";

export default defineConfig({
	plugins: [
		threlteStudio(),
		tailwindcss(),
		sveltekit(),
		svg(),
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide",
		}),
		arraybuffer(),
	],
});
