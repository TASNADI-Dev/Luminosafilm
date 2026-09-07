// Fetches the shared primary button label singleton from Sanity.
import {sanityClient} from 'sanity:client'
import type {Locale} from '../i18n'
import {PRIMARY_BUTTON_DOCUMENT_ID, PRIMARY_BUTTON_QUERY} from './queries'

const defaultPrimaryButtonTextByLocale: Record<Locale, string> = {
	hu: 'Kapcsolatfelvétel',
	en: 'Get in touch',
}

interface PrimaryButtonQueryResult {
	buttonText?: string
}

export async function getPrimaryButtonText(locale: Locale): Promise<string> {
	try {
		const result = await sanityClient.fetch<PrimaryButtonQueryResult | null>(
			PRIMARY_BUTTON_QUERY,
			{
				documentId: PRIMARY_BUTTON_DOCUMENT_ID,
				locale,
			},
		)

		return result?.buttonText || defaultPrimaryButtonTextByLocale[locale]
	} catch {
		return defaultPrimaryButtonTextByLocale[locale]
	}
}
