// Builds hreflang alternate URLs, Open Graph locale tags, and meta description helpers.
import { defaultLocale, locales, switchLocalePath, type Locale } from './i18n';

export const ogLocaleBySiteLocale: Record<Locale, string> = {
	hu: 'hu_HU',
	en: 'en_US',
};

/** Builds a consistent absolute URL for canonical, hreflang, and sitemap entries. */
export function toAbsoluteSeoUrl(site: string | URL, path: string): string {
	const url = new URL(path, site);

	if (url.pathname !== '/' && url.pathname.endsWith('/')) {
		url.pathname = url.pathname.slice(0, -1);
	}

	return url.href;
}

/** Truncates copy to a SERP-friendly meta description length. */
export function truncateMetaDescription(text: string, maxLength = 160): string {
	const normalized = text.replace(/\s+/g, ' ').trim();
	if (normalized.length <= maxLength) {
		return normalized;
	}

	const truncated = normalized.slice(0, maxLength - 1);
	const lastSpace = truncated.lastIndexOf(' ');
	const trimmed = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

	return `${trimmed.trimEnd()}…`;
}

/** Resolves absolute alternate URLs for every locale plus x-default (Hungarian). */
export function getLocaleAlternateUrls(
	site: string | URL,
	pathname: string,
): Array<{ hreflang: Locale | 'x-default'; href: string }> {
	const alternates = locales.map((locale) => ({
		hreflang: locale,
		href: toAbsoluteSeoUrl(site, switchLocalePath(pathname, locale)),
	}));

	return [
		...alternates,
		{
			hreflang: 'x-default' as const,
			href: toAbsoluteSeoUrl(site, switchLocalePath(pathname, defaultLocale)),
		},
	];
}
