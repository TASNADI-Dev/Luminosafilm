// Collects public site paths and renders a flat sitemap.xml document.
import {
	localeHomePath,
	locales,
	pagePath,
	pages,
	servicePath,
	services,
	type PageId,
} from './i18n';

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

/** Returns every public page path for the sitemap (hu + en, static + service pages). */
export function getSitePaths(): string[] {
	const paths: string[] = [];

	for (const locale of locales) {
		paths.push(localeHomePath(locale));

		for (const pageId of Object.keys(pages) as PageId[]) {
			paths.push(pagePath(locale, pageId));
		}

		for (const service of services) {
			paths.push(servicePath(locale, service.id));
		}
	}

	return paths;
}

/** Builds a single flat urlset sitemap (no sitemap index or nested sitemap files). */
export function buildSitemapXml(site: string, paths: string[]): string {
	const urlEntries = paths
		.map((path) => {
			const loc = new URL(path, site).href;
			return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}
