<script lang="ts">
	import { PUBLIC_MAPBOX_TOKEN } from "$env/static/public";
	import { onMount } from "svelte";
	import type { Map } from "mapbox-gl";
	import { MY_LOCATION } from "$lib/constants";
	import { onVisible } from "$lib/utils/actions";
	import { getLocale } from "$lib/paraglide/runtime";
	import { prefersReducedMotion } from "svelte/motion";

	let { userLocation } = $props<{ userLocation: [number, number] | null }>();

	let map: Map;
	let loaded = $state(false);

	onMount(() => {
		window.mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

		map = new window.mapboxgl.Map({
			container: "map",
			center: MY_LOCATION,
			zoom: 3,
			cooperativeGestures: true,
		});

		map.on("load", () => {
			loaded = true;

			new window.mapboxgl.Marker(
				document.getElementById("doce-marker") as HTMLElement,
			)
				.setLngLat(MY_LOCATION)
				.addTo(map);

			if (!userLocation) return;

			new window.mapboxgl.Marker(
				document.getElementById("user-marker") as HTMLElement,
			)
				.setLngLat(userLocation)
				.addTo(map);

			map.addSource("route", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							geometry: {
								type: "LineString",
								coordinates: [MY_LOCATION, userLocation],
							},
							properties: null,
						},
					],
				},
			});

			map.addLayer({
				id: "route",
				source: "route",
				type: "line",
				paint: {
					"line-width": 4,
					"line-color": "#85cc1a",
				},
			});
		});
	});
</script>

<div id="map" class="size-full"></div>

<img
	src={prefersReducedMotion.current
		? "/img/doce-mii-halfbody-static.webp"
		: "/img/doce-mii-halfbody-128.webp"}
	alt=""
	class="size-12"
	id="doce-marker"
/>
<img src="/img/emoji-apple-you.webp" alt="" class="size-10" id="user-marker" />

{#if loaded}
	<div
		class="pointer-events-none absolute top-0 left-0 size-full"
		use:onVisible={() =>
			setTimeout(() => {
				map.fitBounds([MY_LOCATION, userLocation], {
					padding: { top: 24, bottom: 24, left: 24, right: 24 },
				});
			}, 100)}
	></div>
{/if}
