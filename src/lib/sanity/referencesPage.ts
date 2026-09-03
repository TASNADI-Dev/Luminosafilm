// Fetches the references page singleton content from Sanity.
import {sanityClient} from 'sanity:client'
import type {Locale} from '../i18n'
import {REFERENCES_PAGE_DOCUMENT_ID, REFERENCES_PAGE_QUERY} from './queries'
import {extractYoutubeId} from './youtube'

export interface ReferencesPageHero {
	heading: string
	paragraph: string
}

export interface ReferencesPageItem {
	_key: string
	title: string
	videoUrl: string
	youtubeId: string
}

export interface ReferencesPageContent {
	hero: ReferencesPageHero
	references?: ReferencesPageItem[]
}

interface ReferencesPageItemQuery {
	_key?: string
	title?: string
	videoUrl?: string
}

interface ReferencesPageQueryResult {
	heading?: string
	paragraph?: string
	references?: {
		items?: ReferencesPageItemQuery[]
	}
}

const defaultHeroByLocale: Record<Locale, ReferencesPageHero> = {
	hu: {
		heading: 'Referenciák',
		paragraph: 'Válogatás a legfontosabb film- és videóprojektjeinkből.',
	},
	en: {
		heading: 'References',
		paragraph: 'A selection of our most important film and video projects.',
	},
}

function normalizeReferences(
	items: ReferencesPageItemQuery[] | undefined,
): ReferencesPageItem[] | undefined {
	if (!items?.length) {
		return undefined
	}

	const normalized = items
		.map((item, index) => {
			if (!item.title || !item.videoUrl) {
				return null
			}

			const youtubeId = extractYoutubeId(item.videoUrl)
			if (!youtubeId) {
				return null
			}

			return {
				_key: item._key || `reference-${index + 1}`,
				title: item.title,
				videoUrl: item.videoUrl,
				youtubeId,
			}
		})
		.filter((item): item is ReferencesPageItem => item !== null)

	return normalized.length > 0 ? normalized : undefined
}

export async function getReferencesPage(
	locale: Locale,
): Promise<ReferencesPageContent> {
	const fallback: ReferencesPageContent = {
		hero: defaultHeroByLocale[locale],
	}

	try {
		const result = await sanityClient.fetch<ReferencesPageQueryResult | null>(
			REFERENCES_PAGE_QUERY,
			{
				documentId: REFERENCES_PAGE_DOCUMENT_ID,
				locale,
			},
		)

		if (!result?.heading || !result.paragraph) {
			return {
				...fallback,
				references: normalizeReferences(result?.references?.items),
			}
		}

		return {
			hero: {
				heading: result.heading,
				paragraph: result.paragraph,
			},
			references: normalizeReferences(result.references?.items),
		}
	} catch {
		return fallback
	}
}
