// Locale types and helpers for hu (default) / en routing and chrome copy.
export type Locale = 'hu' | 'en';

export const defaultLocale: Locale = 'hu';
export const locales: Locale[] = ['hu', 'en'];

/** Astro/Vite base URL (e.g. `/Luminosafilm/` on GitHub Pages). Always ends with `/`. */
export const baseUrl = import.meta.env.BASE_URL;

export function isLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
}

/** Prepends the configured base URL to a site path. */
export function withBase(path: string): string {
	const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
	if (!path || path === '/') return base;
	const normalized = path.startsWith('/') ? path.slice(1) : path;
	return `${base}${normalized}`;
}

/** Removes the configured base URL from a pathname (e.g. from `Astro.url.pathname`). */
export function stripBase(pathname: string): string {
	const base = baseUrl.replace(/\/$/, '');
	if (base && pathname.startsWith(base)) {
		const rest = pathname.slice(base.length);
		if (!rest || rest === '/') return '/';
		return rest.startsWith('/') ? rest : `/${rest}`;
	}
	return pathname || '/';
}

/** Home path for a locale (`/` for hu, `/en/` for en), including base URL. */
export function localeHomePath(locale: Locale): string {
	return withBase(locale === defaultLocale ? '/' : `/${locale}/`);
}

/**
 * Maps the current path to the equivalent path in another locale.
 * Hungarian lives at `/…`; English under `/en/…`.
 * Static pages and service pages use locale-specific slug segments.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
	const matchedService = matchServicePath(pathname);
	if (matchedService) {
		return servicePath(target, matchedService.id);
	}

	const matchedPage = matchPagePath(pathname);
	if (matchedPage) {
		return pagePath(target, matchedPage);
	}

	const sitePath = stripBase(pathname);
	const normalized =
		sitePath.endsWith('/') && sitePath !== '/' ? sitePath.slice(0, -1) : sitePath;
	const withoutEn = normalized.replace(/^\/en(?=\/|$)/, '') || '/';

	if (target === 'en') {
		if (withoutEn === '/') return withBase('/en/');
		return withBase(`/en${withoutEn}${sitePath.endsWith('/') ? '/' : ''}`);
	}

	return withBase(withoutEn === '/' ? '/' : `${withoutEn}${sitePath.endsWith('/') ? '/' : ''}`);
}

export interface NavLink {
	href: string;
	label: string;
}

export interface NavItem extends NavLink {
	children?: NavLink[];
}

/** Shared catalog for the seven service pages (nav, routes, locale switching). */
export const services = [
	{
		id: 'documentaries',
		slugs: { hu: 'dokumentumfilmek', en: 'documentaries' },
		labels: { hu: 'Dokumentumfilmek', en: 'Documentaries' },
	},
	{
		id: 'oral-history',
		slugs: { hu: 'oral-history', en: 'oral-history' },
		labels: { hu: 'Oral history', en: 'Oral history' },
	},
	{
		id: 'promotional-films',
		slugs: { hu: 'promocios-filmek', en: 'promotional-films' },
		labels: { hu: 'Promóciós filmek', en: 'Promotional films' },
	},
	{
		id: 'ngo-presentations',
		slugs: { hu: 'civil-szervezetek-bemutatasa', en: 'ngo-presentations' },
		labels: { hu: 'Civil szervezetek bemutatása', en: 'NGO presentations' },
	},
	{
		id: 'education',
		slugs: { hu: 'oktatas', en: 'education' },
		labels: { hu: 'Oktatás', en: 'Education' },
	},
	{
		id: 'grant-writing',
		slugs: { hu: 'palyazatiras-es-megvalositas', en: 'grant-writing-and-implementation' },
		labels: { hu: 'Pályázatírás és megvalósítás', en: 'Grant writing and implementation' },
	},
	{
		id: 'equipment-rental',
		slugs: { hu: 'eszkozberles', en: 'equipment-rental' },
		labels: { hu: 'Eszközbérlés', en: 'Equipment rental' },
	},
] as const;

export type ServiceId = (typeof services)[number]['id'];

export function isServiceId(value: string): value is ServiceId {
	return services.some((service) => service.id === value);
}

/** Absolute site path for a service page in the given locale. */
export function servicePath(locale: Locale, id: ServiceId): string {
	const service = services.find((entry) => entry.id === id);
	if (!service) {
		return localeHomePath(locale);
	}

	if (locale === 'hu') {
		return withBase(`/szolgaltatasok/${service.slugs.hu}`);
	}

	return withBase(`/en/services/${service.slugs.en}`);
}

/** Resolves a site path to a service catalog entry, if it is a service page URL. */
export function matchServicePath(pathname: string): (typeof services)[number] | undefined {
	const sitePath = stripBase(pathname);
	const normalized =
		sitePath.endsWith('/') && sitePath !== '/' ? sitePath.slice(0, -1) : sitePath;

	const huMatch = normalized.match(/^\/szolgaltatasok\/([^/]+)$/);
	if (huMatch) {
		return services.find((service) => service.slugs.hu === huMatch[1]);
	}

	const enMatch = normalized.match(/^\/en\/services\/([^/]+)$/);
	if (enMatch) {
		return services.find((service) => service.slugs.en === enMatch[1]);
	}

	return undefined;
}

/** Shared catalog for static top-level pages (about, references, contact). */
export const pages = {
	about: {
		slugs: { hu: 'rolunk', en: 'about' },
	},
	references: {
		slugs: { hu: 'referenciak', en: 'references' },
	},
	contact: {
		slugs: { hu: 'kapcsolat', en: 'contact' },
	},
} as const;

export type PageId = keyof typeof pages;

/** Absolute site path for a static page in the given locale. */
export function pagePath(locale: Locale, id: PageId): string {
	const page = pages[id];
	const slug = page.slugs[locale];
	const path = locale === 'hu' ? `/${slug}` : `/en/${slug}`;
	return withBase(path);
}

/** Resolves a site path to a static page catalog entry, if matched. */
export function matchPagePath(pathname: string): PageId | undefined {
	const sitePath = stripBase(pathname);
	const normalized =
		sitePath.endsWith('/') && sitePath !== '/' ? sitePath.slice(0, -1) : sitePath;

	const huMatch = normalized.match(/^\/([^/]+)$/);
	if (huMatch) {
		const entry = (Object.entries(pages) as [PageId, (typeof pages)[PageId]][]).find(
			([, page]) => page.slugs.hu === huMatch[1],
		);
		return entry?.[0];
	}

	const enMatch = normalized.match(/^\/en\/([^/]+)$/);
	if (enMatch) {
		const entry = (Object.entries(pages) as [PageId, (typeof pages)[PageId]][]).find(
			([, page]) => page.slugs.en === enMatch[1],
		);
		return entry?.[0];
	}

	return undefined;
}

const servicesChildrenHu: NavLink[] = services.map((service) => ({
	href: servicePath('hu', service.id),
	label: service.labels.hu,
}));

const servicesChildrenEn: NavLink[] = services.map((service) => ({
	href: servicePath('en', service.id),
	label: service.labels.en,
}));

export const navItems: Record<Locale, NavItem[]> = {
	hu: [
		{ href: withBase('/#szolgaltatasok'), label: 'Szolgáltatások', children: servicesChildrenHu },
		{ href: pagePath('hu', 'references'), label: 'Referenciák' },
		{ href: pagePath('hu', 'about'), label: 'Rólunk' },
		{ href: pagePath('hu', 'contact'), label: 'Kapcsolat' },
	],
	en: [
		{ href: withBase('/en/#services'), label: 'Services', children: servicesChildrenEn },
		{ href: pagePath('en', 'references'), label: 'References' },
		{ href: pagePath('en', 'about'), label: 'About' },
		{ href: pagePath('en', 'contact'), label: 'Contact' },
	],
};

/** Hardcoded hero CTA targets per locale (not Sanity-editable). */
export const heroButtonHref: Record<Locale, string> = {
	hu: '#kapcsolat',
	en: '#contact',
};

/** Hardcoded hero video play/pause toggle labels (not Sanity-editable). */
export const heroVideoToggleLabels: Record<Locale, { play: string; pause: string }> = {
	hu: { play: 'Videó lejátszása', pause: 'Videó szüneteltetése' },
	en: { play: 'Play video', pause: 'Pause video' },
};

/** Hardcoded why-choose-us CTA per locale (not Sanity-editable). */
export const whyChooseUsButton: Record<Locale, { href: string; label: string }> = {
	hu: { href: '#kapcsolat', label: 'Primary' },
	en: { href: '#contact', label: 'Primary' },
};

/** Hardcoded home services-overview block CTA label (href comes from the service catalog). */
export const servicesOverviewButtonLabel: Record<Locale, string> = {
	hu: 'Bővebben',
	en: 'Learn more',
};

/** Hardcoded service-page why-choose-us CTA href per locale (label is Sanity-editable). */
export const serviceWhyChooseUsButtonHref: Record<Locale, string> = {
	hu: '#kapcsolat',
	en: '#contact',
};

/** Hardcoded global CTA section href per locale (label is Sanity-editable). */
export const globalCtaSectionButtonHref: Record<Locale, string> = {
	hu: withBase('/#kapcsolat'),
	en: withBase('/en/#contact'),
};

/** Hardcoded service-page related references section heading (items are Sanity-editable). */
export const serviceRelatedReferencesHeading: Record<Locale, string> = {
	hu: 'Kapcsolódó referenciák',
	en: 'Related references',
};

/** Hardcoded about-page recognitions section heading (items are Sanity-editable). */
export const recognitionsHeading: Record<Locale, string> = {
	hu: 'Eredményeink',
	en: 'Our recognitions',
};

/** Hardcoded home-page highlighted references section heading (items are Sanity-editable). */
export const homeReferencesHeading: Record<Locale, string> = {
	hu: 'Kiemelt referenciák',
	en: 'Highlighted references',
};

/** Hardcoded home-page highlighted references “more” CTA (href is code-owned). */
export const homeHighlightedReferencesButton: Record<Locale, { href: string; label: string }> = {
	hu: { href: pagePath('hu', 'references'), label: 'További referenciák' },
	en: { href: pagePath('en', 'references'), label: 'More references' },
};

/** Hardcoded references-page “more” CTA label (href is code-owned). */
export const referencesMoreButton: Record<Locale, { href: string; label: string }> = {
	hu: { href: 'https://www.youtube.com/@luminosafilm5112', label: 'További referenciák' },
	en: { href: 'https://www.youtube.com/@luminosafilm5112', label: 'More references' },
};

export const navUi = {
	hu: {
		homeAria: 'Luminosa Film kezdőlap',
		menuOpen: 'Menü megnyitása',
		menuClose: 'Menü bezárása',
		submenuOpen: 'Almenü megnyitása',
		submenuClose: 'Almenü bezárása',
	},
	en: {
		homeAria: 'Luminosa Film home',
		menuOpen: 'Open menu',
		menuClose: 'Close menu',
		submenuOpen: 'Open submenu',
		submenuClose: 'Close submenu',
	},
} as const satisfies Record<Locale, Record<string, string>>;

export const contactFormUi = {
	hu: {
		nameLabel: 'Név',
		emailLabel: 'E-mail',
		messageLabel: 'Üzenet',
		submit: 'Küldés',
		submitting: 'Küldés…',
		success: 'Köszönjük! Üzenetét megkaptuk, hamarosan jelentkezünk.',
		error: 'Hiba történt az üzenet küldésekor. Kérjük, próbálja újra később.',
		nameRequired: 'Adja meg a nevét.',
		emailRequired: 'Adja meg az e-mail címét.',
		emailInvalid: 'Érvényes e-mail címet adjon meg.',
		messageRequired: 'Írja meg üzenetét.',
		subject: 'Új kapcsolatfelvétel – Luminosa Film',
	},
	en: {
		nameLabel: 'Name',
		emailLabel: 'Email',
		messageLabel: 'Message',
		submit: 'Send',
		submitting: 'Sending…',
		success: 'Thank you! We received your message and will get back to you soon.',
		error: 'Something went wrong while sending your message. Please try again later.',
		nameRequired: 'Please enter your name.',
		emailRequired: 'Please enter your email address.',
		emailInvalid: 'Please enter a valid email address.',
		messageRequired: 'Please enter your message.',
		subject: 'New contact request – Luminosa Film',
	},
} as const satisfies Record<Locale, Record<string, string>>;
