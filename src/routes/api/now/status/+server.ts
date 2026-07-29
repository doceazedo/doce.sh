import { pbAdmin } from "$lib/pocketbase.js";
import { json } from "@sveltejs/kit";

export const GET = async () => {
    try {
        const latestStatus = await pbAdmin
            .collection("status")
            .getFirstListItem("", {
                sort: "-updated",
            });
        return json({
            text_en: latestStatus.text_en,
            text_pt: latestStatus.text_pt,
            feeling_en: latestStatus.feeling_en,
            feeling_pt: latestStatus.feeling_pt,
            created: latestStatus.created,
        });
    } catch (_error) {
        return json(null);
    }
};