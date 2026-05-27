import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

const GITHUB_BASE_URL = "https://api.github.com";

export const GET = async ({ url }) => {
	const repo = url.searchParams.get("repo");
	if (!repo) return error(400, "Missing ?repo=");

	try {
		const resp = await fetch(`${GITHUB_BASE_URL}/repos/${repo}/commits`, {
			headers: {
				Authorization: `Bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
			},
		});
		const data = await resp.json();
		return json({
			date: data?.[0]?.commit?.author?.date,
		});
	} catch (_error) {
		return json(null);
	}
};
