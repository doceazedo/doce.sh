import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import PocketBase from "pocketbase";
import type { TypedPocketBase } from "$lib/pocketbase-types";

export function createInstance() {
	return new PocketBase(publicEnv.PUBLIC_POCKETBASE_URL) as TypedPocketBase;
}

export const pb = createInstance();

export const pbAdmin = createInstance();

export const authSuperUser = async () => {
	try {
		await pbAdmin
			.collection("_superusers")
			.authWithPassword(env.POCKETBASE_USER!, env.POCKETBASE_PASSWORD!);
	} catch (err) {
		const e = err as {
			url?: string;
			status?: number;
			message?: string;
			originalError?: { message?: string; cause?: unknown };
		};
		console.error("authSuperUser failed", {
			url: e?.url,
			status: e?.status,
			message: e?.message,
			original: e?.originalError?.message,
			cause: e?.originalError?.cause,
		});
		throw err;
	}
};
