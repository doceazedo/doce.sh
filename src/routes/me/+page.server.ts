export const load = async ({ request, getClientAddress, fetch }) => {
	const ip = request.headers.get("X-Real-Ip") || getClientAddress();
	console.log(`===== IP: ${ip} =====`);

	let lon = 0;
	let lat = 0;

	try {
		const resp = await fetch("https://json.geoiplookup.io");
		const data: { latitude: number; longitude: number } = await resp.json();
		if (isNaN(data.longitude) || isNaN(data.latitude)) throw Error();
		lon = data.longitude;
		lat = data.latitude;
	} catch (_error) {
		/* empty */
	}

	const location: [number, number] | null = lon && lat ? [lon, lat] : null;
	return {
		location,
	};
};
