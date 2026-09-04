// Fetches the privacy page singleton body from Sanity.
import type {PortableTextBlock} from '@portabletext/types'
import {sanityClient} from 'sanity:client'
import type {Locale} from '../i18n'
import {PRIVACY_PAGE_DOCUMENT_ID, PRIVACY_PAGE_QUERY} from './queries'

export type PrivacyPageBody = PortableTextBlock[]

interface PrivacyPageQueryResult {
	body?: PortableTextBlock[] | null
}

function paragraphBlock(locale: Locale, text: string): PortableTextBlock {
	return {
		_type: 'block',
		_key: `privacy-placeholder-${locale}`,
		style: 'normal',
		markDefs: [],
		children: [
			{
				_type: 'span',
				_key: `privacy-placeholder-${locale}-span`,
				text,
				marks: [],
			},
		],
	}
}

const defaultBodyByLocale: Record<Locale, PrivacyPageBody> = {
	hu: [paragraphBlock('hu', 'Ez egy helyőrző szöveg az adatvédelmi irányelvekhez.')],
	en: [paragraphBlock('en', 'This is placeholder text for the privacy policy.')],
}

function isPortableTextBody(value: PrivacyPageQueryResult['body']): value is PrivacyPageBody {
	return Array.isArray(value) && value.length > 0
}

export async function getPrivacyPage(locale: Locale): Promise<PrivacyPageBody> {
	const fallback = defaultBodyByLocale[locale]

	try {
		const result = await sanityClient.fetch<PrivacyPageQueryResult | null>(PRIVACY_PAGE_QUERY, {
			documentId: PRIVACY_PAGE_DOCUMENT_ID,
			locale,
		})

		return isPortableTextBody(result?.body) ? result.body : fallback
	} catch {
		return fallback
	}
}
