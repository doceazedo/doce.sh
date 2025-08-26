import { type Handle } from "@sveltejs/kit";
import { paraglideMiddleware } from "$lib/paraglide/server";
import { sequence } from "@sveltejs/kit/hooks";
import { createInstance } from "$lib/pocketbase";

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace("%paraglide.lang%", locale),
		});
	});

const handleStatusCodeEndpoint: Handle = async ({ event, resolve }) => {
	let response = await resolve(event);
	if (event.route.id === "/[status=status]") {
		const status = parseInt(event.params.status || "200");
		if (status >= 400 && status <= 599) {
			response = new Response(response.body, {
				...response,
				status,
			});
		}
	}
	return response;
};

export const handlePocketbase: Handle = async ({ event, resolve }) => {
	const pb = createInstance();

	pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");
	try {
		if (pb.authStore.isValid) {
			await pb.collection("users").authRefresh();
		}
	} catch (_) {
		pb.authStore.clear();
	}

	event.locals.pb = pb;
	event.locals.user = pb.authStore.record;

	const response = await resolve(event);

	response.headers.set(
		"set-cookie",
		pb.authStore.exportToCookie({ httpOnly: false }),
	);

	return response;
};

export const handle: Handle = sequence(
	handleParaglide,
	handleStatusCodeEndpoint,
);
