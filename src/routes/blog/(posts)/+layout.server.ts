export const load = async ({ route }) => {
	const slug = route.id.split("/blog/(posts)/")[1];
	const post = await import(`./${slug}/+page.md`);

	return {
		metadata: post.metadata,
		slug,
	};
};
