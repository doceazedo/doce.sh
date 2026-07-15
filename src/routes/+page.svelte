<script lang="ts">
	import Hero from "$lib/components/sections/hero/hero.svelte";
	import Portfolio from "$lib/components/sections/portfolio/portfolio.svelte";
	import BlogPosts from "$lib/components/sections/blog-posts.svelte";
	import Newsletter from "$lib/components/sections/newsletter.svelte";
	import Seo from "$lib/components/common/seo.svelte";
</script>

<Seo title="Doce Fernandes • Unicorn Developer, Designer & DJ" />
<Hero />
<BlogPosts />
<Newsletter />
<Portfolio />
