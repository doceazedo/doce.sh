export const GET = async ({ fetch }) => {
	const resp = await fetch("https://plausible.io/js/script.js");
	return new Response(resp.body, {
		headers: {
			"content-type": "application/javascript",
			"cache-control": "public, max-age=86400",
		},
	});
};
