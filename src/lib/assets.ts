// Builds absolute URLs for images hosted on the project R2 CDN.
const ASSET_BASE = 'https://pub-7201b9d69f714980aff6db704be9de2d.r2.dev';

export function asset(path: string): string {
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${ASSET_BASE}${normalized}`;
}
