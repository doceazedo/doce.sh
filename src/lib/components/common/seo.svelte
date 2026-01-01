<script lang="ts">
	import { DOMAIN, SOCIALS, WORK } from "$lib/constants";
	import { m } from "$lib/paraglide/messages";

	const BASE_URL = `https://${DOMAIN}`;

	let {
		title = "Doce Fernandes",
		description = m.excerpt_clean({ company: WORK.company }),
		thumbnail = "/img/thumbnail.jpg",
	}: { title?: string; description?: string; thumbnail?: string } = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={BASE_URL} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{BASE_URL}{thumbnail}" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={BASE_URL} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content="{BASE_URL}{thumbnail}" />

	<link href={SOCIALS.mastodon.url} rel="me" />
</svelte:head>
