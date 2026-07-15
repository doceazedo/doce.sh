<script lang="ts">
	import Seo from "$lib/components/common/seo.svelte";
	import { m } from "$lib/paraglide/messages";
	import Gachapon from "$lib/components/misc/gachapon/index";
	import { GAME_STATE, GIFT_ITEM } from "$lib/components/misc/gachapon/stores";
	import { onMount } from "svelte";

	onMount(() => {
		$GAME_STATE = "idle";
		$GIFT_ITEM = null;
	});
</script>

<Seo title={m.portfolio_gachapon_pretitle()} />

<Gachapon />
