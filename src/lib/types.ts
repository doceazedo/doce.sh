import {
	AppBskyEmbedExternal,
	AppBskyEmbedImages,
	AppBskyEmbedRecord,
	AppBskyEmbedRecordWithMedia,
	AppBskyEmbedVideo,
	type $Typed,
} from "@atproto/api";
import type { SimpleIcon } from "simple-icons";

export type Post = {
	metadata: object;
	date: string;
	title: string;
	icon: string;
	slug: string;
	pinned?: boolean;
};

export type Project = {
	pretitle: string;
	title: string;
	description: string;
	thumbnail: string;
	video?: string;
	stack: (SimpleIcon | string)[];
	role: string;
	details: string;
	links: { label: string; url: string }[];
	media: {
		url: string;
		label: string;
	}[];
	visible?: boolean;
};

export type PostActivity = {
	likesCount: number;
	viewsCount: number;
	comments: PostComment[];
};

export type PostComment = {
	id: string;
	author: {
		id: string;
		displayName: string;
		url: string;
		avatar: string;
		isOp: boolean;
	};
	content: string;
	embed?: PostCommentEmbed;
	likesCount: number;
	url: string;
	postedAt: string;
	replies: PostComment[];
	source: "bluesky" | "mastodon" | "reddit";
	subreddit?: string;
};

export type PostCommentEmbed =
	| {
			type: "image";
			images: {
				thumbnail: string;
				fullsize: string;
				alt?: string;
				aspectRatio?: { width: number; height: number };
			}[];
	  }
	| {
			type: "video";
			playlist: string;
			thumbnail?: string;
			aspectRatio?: { width: number; height: number };
	  }
	| {
			type: "link";
			url: string;
			title: string;
			description?: string;
			thumbnail?: string;
	  }
	| {
			type: "gifv";
			url: string;
			alt?: string;
	  };

export type BlueskyRawEmbed =
	| $Typed<AppBskyEmbedImages.View>
	| $Typed<AppBskyEmbedVideo.View>
	| $Typed<AppBskyEmbedExternal.View>
	| $Typed<AppBskyEmbedRecord.View>
	| $Typed<AppBskyEmbedRecordWithMedia.View>;

/**
 * Non-exaustive
 */
export type RedditCommentsResponse = {
	kind: string;
	data: {
		dist?: number;
		geo_filter: string;
		children: RedditComment[];
	};
}[];

export type RedditComment = {
	kind: string;
	data: {
		subreddit: string;
		selftext?: string;
		saved: boolean;
		gilded: number;
		clicked?: boolean;
		title?: string;
		subreddit_name_prefixed: string;
		hidden?: boolean;
		pwls?: number;
		link_flair_css_class?: string;
		downs: number;
		thumbnail_height?: number;
		hide_score?: boolean;
		name: string;
		quarantine?: boolean;
		link_flair_text_color?: string;
		upvote_ratio?: number;
		ups: number;
		domain?: string;
		thumbnail_width?: number;
		is_original_content?: boolean;
		author_fullname: string;
		secure_media?: {
			reddit_video: {
				bitrate_kbps: number;
				fallback_url: string;
				has_audio: boolean;
				height: number;
				width: number;
				scrubber_media_url: string;
				dash_url: string;
				duration: number;
				hls_url: string;
				is_gif: boolean;
				transcoding_status: string;
			};
		};
		is_reddit_media_domain?: boolean;
		is_meta?: boolean;
		link_flair_text?: string;
		can_mod_post: boolean;
		score: number;
		is_created_from_ads_ui?: boolean;
		author_premium: boolean;
		thumbnail?: string;
		edited: boolean;
		post_hint?: string;
		is_self?: boolean;
		subreddit_type: string;
		created: number;
		link_flair_type?: string;
		wls?: number;
		author_flair_type: string;
		total_awards_received: number;
		allow_live_comments?: boolean;
		likes?: boolean;
		url_overridden_by_dest?: string;
		archived: boolean;
		no_follow: boolean;
		is_crosspostable?: boolean;
		pinned?: boolean;
		over_18?: boolean;
		preview?: {
			images: Array<{
				source: {
					url: string;
					width: number;
					height: number;
				};
				resolutions: Array<{
					url: string;
					width: number;
					height: number;
				}>;
				id: string;
			}>;
			enabled: boolean;
		};
		media_only?: boolean;
		link_flair_template_id?: string;
		can_gild: boolean;
		spoiler?: boolean;
		locked: boolean;
		rte_mode?: string;
		visited?: boolean;
		subreddit_id: string;
		author_is_blocked: boolean;
		link_flair_background_color?: string;
		id: string;
		is_robot_indexable?: boolean;
		num_duplicates?: number;
		author: string;
		num_comments?: number;
		send_replies: boolean;
		media?: {
			reddit_video: {
				bitrate_kbps: number;
				fallback_url: string;
				has_audio: boolean;
				height: number;
				width: number;
				scrubber_media_url: string;
				dash_url: string;
				duration: number;
				hls_url: string;
				is_gif: boolean;
				transcoding_status: string;
			};
		};
		contest_mode?: boolean;
		author_patreon_flair: boolean;
		permalink: string;
		stickied: boolean;
		url?: string;
		subreddit_subscribers?: number;
		created_utc: number;
		num_crossposts?: number;
		is_video?: boolean;
		parent_id?: string;
		collapsed?: boolean;
		body?: string;
		is_submitter?: boolean;
		body_html?: string;
		score_hidden?: boolean;
		link_id?: string;
		controversiality?: number;
		depth?: number;
		replies?: {
			data?: {
				children?: RedditComment[];
			};
		};
	};
};

/**
 * Non-exaustive
 */
export type RedditUserResponse = {
	kind: string;
	data: {
		is_employee: boolean;
		has_visited_new_profile: boolean;
		is_friend: boolean;
		pref_no_profanity: boolean;
		has_external_account: boolean;
		pref_geopopular: string;
		pref_show_trending: boolean;
		subreddit: {
			default_set: boolean;
			user_is_contributor: boolean;
			banner_img: string;
			user_is_banned: boolean;
			free_form_reports: boolean;
			show_media: boolean;
			icon_color: string;
			display_name: string;
			title: string;
			coins: number;
			over_18: boolean;
			icon_size: Array<number>;
			primary_color: string;
			icon_img: string;
			description: string;
			submit_link_label: string;
			restrict_posting: boolean;
			restrict_commenting: boolean;
			subscribers: number;
			submit_text_label: string;
			is_default_icon: boolean;
			link_flair_position: string;
			display_name_prefixed: string;
			key_color: string;
			name: string;
			is_default_banner: boolean;
			url: string;
			quarantine: boolean;
			banner_size: Array<number>;
			user_is_moderator: boolean;
			accept_followers: boolean;
			public_description: string;
			link_flair_enabled: boolean;
			disable_contributor_requests: boolean;
			subreddit_type: string;
			user_is_subscriber: boolean;
		};
		pref_show_presence: boolean;
		snoovatar_img: string;
		snoovatar_size: Array<number>;
		has_gold_subscription: boolean;
		is_sponsor: boolean;
		num_friends: number;
		can_edit_name: boolean;
		is_blocked: boolean;
		verified: boolean;
		pref_autoplay: boolean;
		coins: number;
		has_paypal_subscription: boolean;
		has_subscribed_to_premium: boolean;
		id: string;
		can_create_subreddit: boolean;
		over_18: boolean;
		is_gold: boolean;
		is_mod: boolean;
		awarder_karma: number;
		has_stripe_subscription: boolean;
		is_suspended: boolean;
		pref_video_autoplay: boolean;
		has_android_subscription: boolean;
		in_redesign_beta: boolean;
		icon_img: string;
		has_mod_mail: boolean;
		pref_nightmode: boolean;
		awardee_karma: number;
		hide_from_robots: boolean;
		password_set: boolean;
		modhash: string;
		link_karma: number;
		force_password_reset: boolean;
		total_karma: number;
		inbox_count: number;
		pref_top_karma_subreddits: boolean;
		has_mail: boolean;
		pref_show_snoovatar: boolean;
		name: string;
		pref_clickgadget: number;
		created: number;
		has_verified_email: boolean;
		gold_creddits: number;
		created_utc: number;
		has_ios_subscription: boolean;
		pref_show_twitter: boolean;
		in_beta: boolean;
		comment_karma: number;
		accept_followers: boolean;
		has_subscribed: boolean;
	};
};
