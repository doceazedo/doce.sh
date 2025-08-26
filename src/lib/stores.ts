import { writable } from "svelte/store";
import type { LastPlayedTracksRecord } from "./pocketbase-types";

export const LAST_PLAYED_TRACKS = writable<
	Required<LastPlayedTracksRecord>[] | null
>(null);

export const IS_DESKTOP = writable(false);

export const IS_XL = writable(false);

export const MEMOJI_BLINK_COUNT = writable(0);
