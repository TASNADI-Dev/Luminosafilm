// Fetches the shared client logos singleton from Sanity.
import {sanityClient} from 'sanity:client'
import type {Locale} from '../i18n'
import {
	CLIENT_LOGOS_DOCUMENT_ID,
	CLIENT_LOGOS_QUERY,
	HOME_PAGE_DOCUMENT_ID,
	HOME_PAGE_QUERY,
} from './queries'

export interface LogoItem {
	_key: string
	alt?: string
	asset?: {
		_id: string
		url: string
		metadata?: {
			dimensions?: {
				width: number
				height: number
			}
		}
	}
}

interface ClientLogosQueryResult {
	logos?: LogoItem[]
}

interface HomePageLogosFallbackResult {
	sections?: {
		_type: string
		logos?: LogoItem[]
	}[]
}

function isCompleteLogos(logos: LogoItem[] | undefined): logos is LogoItem[] {
	return Boolean(
		Array.isArray(logos) &&
			logos.length > 0 &&
			logos.every((logo) => logo.asset?.url),
	)
}

function normalizeLogos(logos: LogoItem[] | undefined): LogoItem[] | null {
	if (!isCompleteLogos(logos)) {
		return null
	}

	return logos
}

async function fetchHomePageLogosFallback(): Promise<LogoItem[] | null> {
	try {
		const result = await sanityClient.fetch<HomePageLogosFallbackResult | null>(
			HOME_PAGE_QUERY,
			{
				documentId: HOME_PAGE_DOCUMENT_ID,
				locale: 'hu',
			},
		)

		const logos = result?.sections?.find(
			(section) => section._type === 'logosSection',
		)?.logos

		return normalizeLogos(logos)
	} catch {
		return null
	}
}

export async function getClientLogos(_locale: Locale): Promise<LogoItem[] | null> {
	try {
		const result = await sanityClient.fetch<ClientLogosQueryResult | null>(
			CLIENT_LOGOS_QUERY,
			{
				documentId: CLIENT_LOGOS_DOCUMENT_ID,
				locale: _locale,
			},
		)

		const logos = normalizeLogos(result?.logos)
		if (logos) {
			return logos
		}

		return fetchHomePageLogosFallback()
	} catch {
		return fetchHomePageLogosFallback()
	}
}
