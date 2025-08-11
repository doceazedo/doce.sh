import {
	ATP_IDENTIFIER,
	ATP_PASSWORD,
	PLAUSIBLE_API_KEY,
	REDDIT_CLIENT_ID,
	REDDIT_CLIENT_SECRET,
	REDDIT_PASSWORD,
	REDDIT_USERNAME,
} from "$env/static/private";
import { SOCIALS } from "$lib/constants.js";
import type {
	BlueskyRawEmbed,
	PostActivity,
	PostComment,
	PostCommentEmbed,
	RedditComment,
	RedditCommentsResponse,
	RedditUserResponse,
} from "$lib/types.js";
import { escapeHTML, removeEmojiCodes } from "$lib/utils/string";
import { AppBskyFeedGetPostThread, AtpAgent, type Facet } from "@atproto/api";
import { error, json } from "@sveltejs/kit";

const agent = new AtpAgent({
	service: "https://bsky.social",
});

export const GET = async ({ params }) => {
	const post = await import(`../../(posts)/${params.slug}/+page.md`);
	if (!post) return error(404);

	const [viewsCount, blueskyData, mastodonData, redditData] = await Promise.all(
		[
			getPageViews(`/blog/${params.slug}`),
			getBlueskyData(post.metadata?.blueskyPostId),
			getMastodonData(post.metadata?.mastodonPostId),
			getRedditData(post.metadata?.redditPostId),
		],
	);

	const blueskyLikes = blueskyData?.likesCount || 0;
	const mastodonLikes = mastodonData?.likesCount || 0;
	const redditUpvotes = redditData?.likesCount || 0;

	return json({
		viewsCount,
		likesCount: blueskyLikes + mastodonLikes + redditUpvotes,
		comments: [
			...(blueskyData?.comments || []),
			...(mastodonData?.comments || []),
			...(redditData?.comments || []),
		].sort(
			(a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime(),
		),
	} as PostActivity);
};

const getBlueskyData = async (
	postId: string,
): Promise<Partial<PostActivity>> => {
	try {
		await agent.login({
			identifier: ATP_IDENTIFIER,
			password: ATP_PASSWORD,
		});
	} catch (_error) {
		return {};
	}

	let data: AppBskyFeedGetPostThread.OutputSchema;
	try {
		const resp = await agent.getPostThread({
			uri: `at://${SOCIALS.bluesky.handle}/app.bsky.feed.post/${postId}`,
		});
		data = resp.data;
	} catch (_error) {
		return {};
	}
	if (!("post" in data.thread)) return {};

	const parseEmbed = (
		embed?: BlueskyRawEmbed,
	): PostCommentEmbed | undefined => {
		if (!embed) return undefined;

		if (
			![
				// @ts-expect-error: ?.
				embed?.thumb,
				// @ts-expect-error: ?.
				embed?.fullsize,
				// @ts-expect-error: ?.
				embed?.playlist,
				// @ts-expect-error: ?.
				embed?.thumbnail,
				// @ts-expect-error: ?.
				embed?.external?.uri,
			]
				.filter((x) => !!x)
				.every((x) => {
					try {
						const url = new URL(x);
						return url.protocol === "https:";
					} catch (_error) {
						return false;
					}
				})
		)
			return undefined;

		switch (embed.$type) {
			case "app.bsky.embed.images#view":
				return {
					type: "image",
					images: embed.images.map((img) => ({
						thumbnail: img.thumb,
						fullsize: img.fullsize,
						alt: img.alt,
						aspectRatio: img.aspectRatio,
					})),
				};
			case "app.bsky.embed.video#view":
				return {
					type: "video",
					playlist: embed.playlist,
					thumbnail: embed.thumbnail,
					aspectRatio: embed.aspectRatio,
				};
			case "app.bsky.embed.external#view": {
				const url = new URL(embed.external.uri);
				if (url.host === "media.tenor.com") {
					return {
						type: "image",
						images: [
							{
								thumbnail: embed.external.uri,
								fullsize: embed.external.uri,
								alt: embed.external.title,
							},
						],
					};
				}
				return {
					type: "link",
					url: embed.external.uri,
					title: embed.external.title,
					description: embed.external.description,
					thumbnail: embed.external.thumb,
				};
			}
			default:
				return undefined;
		}
	};

	const parseMessageFacets = (content: string, facets: Facet[]): string => {
		const encoder = new TextEncoder();
		const decoder = new TextDecoder();

		const bytes = encoder.encode(content);
		const parts: string[] = [];

		let lastByteIndex = 0;

		for (const facet of facets.sort(
			(a, b) => a.index.byteStart - b.index.byteStart,
		)) {
			const { byteStart, byteEnd } = facet.index;

			if (byteStart > lastByteIndex) {
				const plainBytes = bytes.slice(lastByteIndex, byteStart);
				parts.push(escapeHTML(decoder.decode(plainBytes)));
			}

			const facetBytes = bytes.slice(byteStart, byteEnd);
			const facetText = decoder.decode(facetBytes);

			for (const feature of facet.features) {
				if (feature.$type === "app.bsky.richtext.facet#mention") {
					const handle = escapeHTML(facetText);
					parts.push(
						`<a href="https://bsky.app/profile/${handle.split("@")?.[1]}" target="_blank" rel="noopener noreferrer">${handle}</a>`,
					);
				} else if (feature.$type === "app.bsky.richtext.facet#tag") {
					parts.push(
						// @ts-expect-error: already checked
						`<a href="https://bsky.app/tag/${encodeURIComponent(feature.tag)}" target="_blank" rel="noopener noreferrer">#${escapeHTML(feature.tag)}</a>`,
					);
				} else if (feature.$type === "app.bsky.richtext.facet#link") {
					try {
						// @ts-expect-error: already checked
						const url = new URL(feature.uri);
						if (url.protocol !== "https:") throw Error();
						parts.push(
							`<a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHTML(facetText)}</a>`,
						);
					} catch (_error) {
						parts.push(escapeHTML(facetText));
					}
				} else {
					parts.push(escapeHTML(facetText));
				}
			}

			lastByteIndex = byteEnd;
		}

		// add remaining text
		if (lastByteIndex < bytes.length) {
			const remainingBytes = bytes.slice(lastByteIndex);
			parts.push(escapeHTML(decoder.decode(remainingBytes)));
		}

		return parts.join("");
	};

	return {
		likesCount: data.thread.post.likeCount,
		comments:
			data.thread.replies
				?.filter((x) => "post" in x)
				.map((x) => ({
					author: {
						id: x.post.author.did,
						displayName:
							x.post.author.displayName || `@${x.post.author.handle}`,
						url: `https://bsky.app/profile/${x.post.author.handle}`,
						avatar: x.post.author.avatar || `/img/avatar-fallback.webp`,
						isOp: x.post.author.did === SOCIALS.bluesky.id,
					},
					content: parseMessageFacets(
						(x.post.record?.text as string) || "",
						(x.post.record.facets as Facet[]) || [],
					),
					embed: parseEmbed(x.post.embed as BlueskyRawEmbed),
					likesCount: x.post.likeCount || 0,
					url: `https://bsky.app/profile/${x.post.author.handle}/post/${x.post.uri.split("app.bsky.feed.post/")[1]}`,
					postedAt:
						(x.post.record?.createdAt as string) || new Date(0).toString(),
					replies: [],
					source: "bluesky",
				})) || [],
	};
};

// manually extracted from old doceazedo.com plausible data
const OLD_PAGE_VIEWS = {
	"/blog/sveltekit-docker": 349,
	"/blog/tryhackme-couch": 231,
	"/blog/plausible-analytics": 201,
	"/blog/getting-started-with-svelte-4": 583,
	"/blog/who-is-doceazedo": 183,
	"/blog/photopea-vs-photoshop": 226,
	"/blog/wordpress-headless-cms": 129,
	"/blog/kotlin-spigot-plugin": 224,
} as { [page: string]: number };

const getPageViews = async (page: string) => {
	try {
		const res = await fetch("https://plausible.io/api/v2/query", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${PLAUSIBLE_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				site_id: "doce.sh",
				metrics: ["pageviews"],
				date_range: "all",
				filters: [["contains", "event:page", [page]]],
			}),
		});

		const data = await res.json();
		const livePageViews = data?.results?.[0]?.metrics?.["0"] || 0;
		const oldPageViews = OLD_PAGE_VIEWS?.[page] || 0;
		return livePageViews + oldPageViews;
	} catch (_error) {
		return 0;
	}
};

const getMastodonData = async (
	postId?: string,
): Promise<Partial<PostActivity>> => {
	if (!postId) return {};

	const postRes = await fetch(
		`${SOCIALS.mastodon.instance}/api/v1/statuses/${postId}`,
	);
	const post = await postRes.json();

	const contextRes = await fetch(
		`${SOCIALS.mastodon.instance}/api/v1/statuses/${postId}/context`,
	);
	const context = await contextRes.json();
	const descendants: {
		account: {
			id: string;
			display_name: string;
			username: string;
			url: string;
			avatar_static: string;
		};
		content: string;
		favourites_count: number;
		url: string;
		created_at: string;
		media_attachments: {
			type: string;
			preview_url: string;
			url: string;
			description: string;
		}[];
		card: { url: string; title: string; description: string; image: string };
	}[] = context.descendants || [];

	const parseEmbed = (status: {
		media_attachments: {
			type: string;
			preview_url: string;
			url: string;
			description: string;
		}[];
		card: { url: string; title: string; description: string; image: string };
	}) => {
		if (
			(!status.media_attachments || status.media_attachments.length === 0) &&
			!status.card
		) {
			return undefined;
		}

		const first = status.media_attachments[0];
		if (first?.type === "image") {
			return {
				type: "image" as const,
				images: status.media_attachments.map((img) => ({
					thumbnail: img.preview_url,
					fullsize: img.url,
					alt: img.description,
				})),
			};
		} else if (first?.type === "video") {
			return {
				type: "video" as const,
				playlist: first.url,
				thumbnail: first.preview_url,
			};
		} else if (first?.type === "gifv") {
			return {
				type: "gifv" as const,
				url: first.url,
			};
		} else if (status.card) {
			return {
				type: "link" as const,
				url: status.card.url,
				title: status.card.title,
				description: status.card.description,
				thumbnail: status.card.image,
			};
		}

		return undefined;
	};

	const comments = descendants.map((reply) => ({
		author: {
			id: reply.account.id,
			displayName: reply.account.display_name
				? removeEmojiCodes(reply.account.display_name)
				: reply.account.username,
			url: reply.account.url,
			avatar: reply.account.avatar_static,
			isOp: reply.account.id === SOCIALS.mastodon.id,
		},
		content: reply.content.replaceAll(
			"<a",
			'<a target="_blank" rel="noopener noreferrer"',
		),
		embed: parseEmbed(reply),
		likesCount: reply.favourites_count,
		url: reply.url,
		postedAt: reply.created_at,
		replies: [],
		source: "mastodon" as const,
	}));

	return {
		likesCount: post.favourites_count,
		comments,
	};
};

const getRedditAccessToken = async () => {
	try {
		const resp = await fetch(
			`https://www.reddit.com/api/v1/access_token?grant_type=password&username=${REDDIT_USERNAME}&password=${REDDIT_PASSWORD}`,
			{
				method: "POST",
				headers: {
					Authorization: `Basic ${Buffer.from(REDDIT_CLIENT_ID + ":" + REDDIT_CLIENT_SECRET).toString("base64")}`,
				},
			},
		);
		const data = await resp.json();
		return data.access_token || null;
	} catch (_error) {
		return null;
	}
};

const EPHEMERAL_USERS_CACHE = new Map<string, RedditUserResponse["data"]>();

const getRedditUser = async (
	username: string,
): Promise<RedditUserResponse["data"] | null> => {
	const cachedUser = EPHEMERAL_USERS_CACHE.get(username);
	if (cachedUser) return cachedUser;

	try {
		const resp = await fetch(`https://api.reddit.com/user/${username}/about`);
		const data: RedditUserResponse = await resp.json();
		const about = data?.data;
		if (!about) return null;
		EPHEMERAL_USERS_CACHE.set(username, about);
		return about;
	} catch (_error) {
		return null;
	}
};

const SELF_UPVOTE = 1;

const parseRedditComment = async (
	comment: RedditComment,
): Promise<PostComment | null> => {
	const author = await getRedditUser(comment.data.author);
	if (!author) return null;
	return {
		author: {
			id: author.id,
			displayName: author.name,
			url: `https://www.reddit.com/user/${author.name}`,
			avatar: author.snoovatar_img || author.icon_img,
			isOp: author.id === SOCIALS.reddit.id,
		},
		content: comment.data.body || "",
		likesCount: comment.data.ups - comment.data.downs - SELF_UPVOTE,
		url: `https://www.reddit.com/${comment.data.permalink}`,
		postedAt: new Date(comment.data.created * 1000).toISOString(),
		replies: (
			await Promise.all(
				comment.data.replies?.data?.children?.map((reply) =>
					parseRedditComment(reply),
				) || [],
			)
		).filter((x) => !!x),
		source: "reddit",
		subreddit: comment.data.subreddit,
	};
};

const getRedditData = async (
	postId?: string,
): Promise<Partial<PostActivity>> => {
	if (!postId) return {};

	const accessToken = await getRedditAccessToken();
	if (!accessToken) return {};

	try {
		const resp = await fetch(`https://oauth.reddit.com/comments/${postId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const data: RedditCommentsResponse = await resp.json();

		const post = data[0].data.children[0].data;
		const comments = data?.[1]?.data?.children || [];

		return {
			likesCount: post.ups - post.downs - SELF_UPVOTE,
			comments: (
				await Promise.all(
					comments
						.map((x) => {
							if (x.data.author !== SOCIALS.reddit.handle) return x;
							// this is my own comment on my reddit post, which serves as a description, so we're only interested in the replies
							return x.data?.replies?.data?.children || [];
						})
						.flat()
						.map((x) => parseRedditComment(x)),
				)
			).filter((x) => !!x),
		};
	} catch (_error) {
		return {};
	}
};
