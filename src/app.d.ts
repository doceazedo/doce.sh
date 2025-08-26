import mapboxgl from "mapbox-gl";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: import("pocketbase").default;
			user: import("pocketbase").default["authStore"]["record"];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	declare interface Window {
		mapboxgl: typeof mapboxgl;
		rosebud: () => void;
		kaching: () => void;
		motherlode: () => void;
		giveItem: (id: string, quantity?: number) => void;
		giveAll: () => void;
	}
}

export {};
