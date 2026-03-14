export const POST = async ({ request }) => {
	const resp = await fetch("https://plausible.io/api/event", {
		method: "POST",
		headers: request.headers,
		body: await request.text(),
	});
	return new Response(resp.body, {
		status: resp.status,
		headers: resp.headers,
	});
};
