// Locale types and helpers for hu (default) / en routing and chrome copy.
export type Locale = 'hu' | 'en';

export const defaultLocale: Locale = 'hu';
export const locales: Locale[] = ['hu', 'en'];

export function isLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
}

/** Home path for a locale (`/` for hu, `/en/` for en). */
export function localeHomePath(locale: Locale): string {
	return locale === defaultLocale ? '/' : `/${locale}/`;
}

/**
 * Maps the current path to the equivalent path in another locale.
 * Hungarian lives at `/…`; English under `/en/…`.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
	const normalized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
	const withoutEn = normalized.replace(/^\/en(?=\/|$)/, '') || '/';

	if (target === 'en') {
		if (withoutEn === '/') return '/en/';
		return `/en${withoutEn}${pathname.endsWith('/') ? '/' : ''}`;
	}

	return withoutEn === '/' ? '/' : `${withoutEn}${pathname.endsWith('/') ? '/' : ''}`;
}

export interface NavItem {
	href: string;
	label: string;
}

export const navItems: Record<Locale, NavItem[]> = {
	hu: [
		{ href: '#szolgaltatasok', label: 'Szolgáltatások' },
		{ href: '#referenciak', label: 'Referenciák' },
		{ href: '#rolunk', label: 'Rólunk' },
		{ href: '#kapcsolat', label: 'Kapcsolat' },
	],
	en: [
		{ href: '#services', label: 'Services' },
		{ href: '#references', label: 'References' },
		{ href: '#about', label: 'About' },
		{ href: '#contact', label: 'Contact' },
	],
};

export const navUi = {
	hu: {
		homeAria: 'Luminosa Film kezdőlap',
		menuOpen: 'Menü megnyitása',
		menuClose: 'Menü bezárása',
	},
	en: {
		homeAria: 'Luminosa Film home',
		menuOpen: 'Open menu',
		menuClose: 'Close menu',
	},
} as const satisfies Record<Locale, Record<string, string>>;
