import { POCKETBASE_PASSWORD, POCKETBASE_USER } from "$env/static/private";
import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
import PocketBase from "pocketbase";
import type { TypedPocketBase } from "$lib/pocketbase-types";

export function createInstance() {
	return new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;
}

export const pb = createInstance();

export const pbAdmin = createInstance();

export const authSuperUser = async () => {
	await pbAdmin
		.collection("_superusers")
		.authWithPassword(POCKETBASE_USER, POCKETBASE_PASSWORD);
};
