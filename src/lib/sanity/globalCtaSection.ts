// Fetches the global CTA section singleton from Sanity.
import {sanityClient} from 'sanity:client'
import type {Locale} from '../i18n'
import {GLOBAL_CTA_SECTION_DOCUMENT_ID, GLOBAL_CTA_SECTION_QUERY} from './queries'

export interface GlobalCtaSectionContent {
	heading: string
	paragraph: string
	buttonText: string
}

interface GlobalCtaSectionQueryResult {
	heading?: string
	paragraph?: string
	buttonText?: string
}

const defaultCtaByLocale: Record<Locale, GlobalCtaSectionContent> = {
	hu: {
		heading: 'Készen áll a következő filmprojektjére?',
		paragraph:
			'Mesélje el, miben segíthetünk — felvesszük Önnel a kapcsolatot, és közösen megtaláljuk a legjobb megoldást.',
		buttonText: 'Kapcsolatfelvétel',
	},
	en: {
		heading: 'Ready for your next film project?',
		paragraph:
			'Tell us how we can help — we’ll get in touch and find the best approach together.',
		buttonText: 'Get in touch',
	},
}

export async function getGlobalCtaSection(
	locale: Locale,
): Promise<GlobalCtaSectionContent> {
	try {
		const result = await sanityClient.fetch<GlobalCtaSectionQueryResult | null>(
			GLOBAL_CTA_SECTION_QUERY,
			{
				documentId: GLOBAL_CTA_SECTION_DOCUMENT_ID,
				locale,
			},
		)

		if (!result?.heading || !result.paragraph || !result.buttonText) {
			return defaultCtaByLocale[locale]
		}

		return {
			heading: result.heading,
			paragraph: result.paragraph,
			buttonText: result.buttonText,
		}
	} catch {
		return defaultCtaByLocale[locale]
	}
}
