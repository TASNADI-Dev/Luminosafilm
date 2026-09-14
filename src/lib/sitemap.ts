// Collects public site paths and renders a flat sitemap.xml document with hreflang alternates.
import {
	localeHomePath,
	locales,
	pagePath,
	pages,
	servicePath,
	services,
	type PageId,
} from './i18n';
import { getLocaleAlternateUrls, toAbsoluteSeoUrl } from './seo';

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

function buildAlternateLinks(site: string, path: string): string {
	return getLocaleAlternateUrls(site, path)
		.map(
			({ hreflang, href }) =>
				`    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`,
		)
		.join('\n');
}

/** Builds a single flat urlset sitemap (no sitemap index or nested sitemap files). */
export function buildSitemapXml(site: string, paths: string[]): string {
	const urlEntries = paths
		.map((path) => {
			const loc = toAbsoluteSeoUrl(site, path);
			const alternates = buildAlternateLinks(site, path);
			return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n${alternates}\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries}\n</urlset>\n`;
}
