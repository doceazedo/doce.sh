import { env } from "$env/dynamic/private";
import {
	AssetOrder,
	getAlbumInfo,
	getAllSharedLinks,
	init,
	searchAssets,
	SharedLinkType,
	type AssetResponseDto,
} from "@immich/sdk";
import type { PublicAlbum, GalleryAlbum, GalleryPhoto } from "./immich-types";

const PAGE_SIZE = 1000;

export const FAVORITES_ALBUM_ID = "favorites";

let initialized = false;

export const initImmich = () => {
	if (initialized) return;
	if (!env.IMMICH_BASE_URL || !env.IMMICH_API_KEY) {
		throw new Error("Missing IMMICH_BASE_URL or IMMICH_API_KEY");
	}
	init({
		baseUrl: `${env.IMMICH_BASE_URL}/api`,
		apiKey: env.IMMICH_API_KEY,
	});
	initialized = true;
};

export const getImageUrl = (assetId: string, key: string, preview = false) => {
	const size = preview ? "&size=preview" : "";
	return `${env.IMMICH_BASE_URL}/api/assets/${assetId}/thumbnail?key=${key}${size}`;
};

export const toGalleryAlbum = ({ album, key }: PublicAlbum): GalleryAlbum => ({
	id: album.id,
	title: album.albumName,
	description: album.description,
	thumbnailUrl: album.albumThumbnailAssetId
		? getImageUrl(album.albumThumbnailAssetId, key)
		: null,
	startDate: album.startDate || album.createdAt,
	endDate: album.endDate || null,
	count: album.assetCount,
});

export const toGalleryPhoto = (
	asset: AssetResponseDto,
	key: string,
): GalleryPhoto => ({
	id: asset.id,
	type: asset.type,
	url: getImageUrl(asset.id, key, true),
	thumbnailUrl: getImageUrl(asset.id, key),
	width: asset.width,
	height: asset.height,
	thumbhash: asset.thumbhash,
	duration: asset.duration,
	takenAt: asset.localDateTime || asset.fileCreatedAt,
	exif: asset.exifInfo,
});

export const getPublicAlbums = async (): Promise<PublicAlbum[]> => {
	initImmich();

	const links = await getAllSharedLinks({});
	const now = Date.now();
	const keys = new Map<string, string>();

	for (const link of links) {
		if (link.type !== SharedLinkType.Album || !link.album) continue;
		if (link.password) continue;
		if (link.expiresAt && new Date(link.expiresAt).getTime() <= now) continue;
		keys.set(link.album.id, link.key);
	}

	return await Promise.all(
		[...keys].map(async ([id, key]) => ({
			album: await getAlbumInfo({ id }),
			key,
		})),
	);
};

const searchAllAssets = async (
	filters: Parameters<typeof searchAssets>[0]["metadataSearchDto"],
) => {
	initImmich();

	const assets: AssetResponseDto[] = [];
	let page: number | null = 1;

	while (page) {
		const { assets: result } = await searchAssets({
			metadataSearchDto: {
				...filters,
				page,
				size: PAGE_SIZE,
				withExif: true,
				order: AssetOrder.Desc,
			},
		});
		assets.push(...result.items);
		page = result.nextPage ? Number(result.nextPage) : null;
	}

	return assets;
};

export const getAlbumAssets = (albumId: string) =>
	searchAllAssets({ albumIds: [albumId] });

export const getFavoritePhotos = async (
	publicAlbums?: PublicAlbum[],
): Promise<GalleryPhoto[]> => {
	const albums = publicAlbums ?? (await getPublicAlbums());
	const [favorites, ...albumAssets] = await Promise.all([
		searchAllAssets({ isFavorite: true }),
		...albums.map(({ album }) => getAlbumAssets(album.id)),
	]);

	const keys = new Map<string, string>();
	albumAssets.forEach((assets, i) => {
		for (const asset of assets) {
			if (!keys.has(asset.id)) keys.set(asset.id, albums[i].key);
		}
	});

	return favorites
		.filter((asset) => keys.has(asset.id))
		.map((asset) => toGalleryPhoto(asset, keys.get(asset.id)!));
};

export const toFavoritesAlbum = (
	photos: GalleryPhoto[],
): GalleryAlbum | null => {
	if (!photos.length) return null;

	const sorted = [...photos].sort((a, b) => b.takenAt.localeCompare(a.takenAt));
	const newest = sorted[0];
	const oldest = sorted[sorted.length - 1];

	return {
		id: FAVORITES_ALBUM_ID,
		title: "Favorites",
		description: "",
		thumbnailUrl: newest.thumbnailUrl,
		startDate: oldest.takenAt,
		endDate: newest.takenAt === oldest.takenAt ? null : newest.takenAt,
		count: photos.length,
	};
};
