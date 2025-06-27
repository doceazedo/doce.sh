import { type Handle } from "@sveltejs/kit";
import { paraglideMiddleware } from "$lib/paraglide/server";
import { sequence } from "@sveltejs/kit/hooks";

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

export const handle: Handle = sequence(
	handleParaglide,
	handleStatusCodeEndpoint,
);
