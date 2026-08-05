import type { AlbumResponseDto, ExifResponseDto } from "@immich/sdk";

export type PublicAlbum = {
	album: AlbumResponseDto;
	key: string;
};

export type GalleryAlbum = {
	id: string;
	title: string;
	description: string;
	thumbnailUrl: string | null;
	previewThumbnailUrls: string[];
	startDate: string;
	endDate: string | null;
	count: number;
};

export type GalleryPhoto = {
	id: string;
	type: string;
	url: string;
	thumbnailUrl: string;
	width: number | null;
	height: number | null;
	thumbhash: string | null;
	duration: number | null;
	takenAt: string;
	exif?: ExifResponseDto;
};

export type GalleryAlbumWithItems = GalleryAlbum & {
	items: GalleryPhoto[];
};
