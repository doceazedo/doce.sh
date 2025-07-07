import { writable } from "svelte/store";
import { storage } from "./utils/storage";
import { browser } from "$app/environment";

export const PROSE_SIZE = storage(
	writable({
		base: "16px",
		xl: "18px",
	}),
	"prose_size",
);

export const NOISE_SETTING = storage(writable("animated"), "noise");
NOISE_SETTING.subscribe((setting) => {
	if (!browser) return;
	document.body.dataset.noise = setting;
});

export const MAKE_ELEVATOR_FASTER = storage(writable(false), "elevator_speed");

export const USE_DYSLEXIA_FONT = storage(writable(false), "dyslexia_font");
