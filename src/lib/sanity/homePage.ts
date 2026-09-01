// Fetches and normalizes localized home page content from Sanity.
import {sanityClient} from 'sanity:client'
import {asset} from '../assets'
import type {Locale} from '../i18n'
import {HOME_PAGE_DOCUMENT_ID, HOME_PAGE_QUERY} from './queries'

const defaultHeroVideoUrl = asset('/home/Showreel.mp4')

export interface HeroSection {
  _type: 'heroSection'
  _key: string
  heading: string
  paragraph: string
  videoUrl: string
  buttonText: string
}

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

export interface LogosSection {
  _type: 'logosSection'
  _key: string
  logos: LogoItem[]
}

interface HomePageQueryResult {
  sections?: (HeroSection | LogosSection)[]
}

const defaultHeroByLocale: Record<Locale, Omit<HeroSection, '_type' | '_key'>> = {
  hu: {
    heading: 'Professzionális filmkészítés',
    paragraph:
      'Egyedi vizuális történeteket alkotunk, amelyek emlékezetes élményt nyújtanak a közönségnek.',
    videoUrl: defaultHeroVideoUrl,
    buttonText: 'Kapcsolatfelvétel',
  },
  en: {
    heading: 'Professional filmmaking',
    paragraph:
      'We craft distinctive visual stories that create memorable experiences for your audience.',
    videoUrl: defaultHeroVideoUrl,
    buttonText: 'Get in touch',
  },
}

function buildDefaultHero(locale: Locale): HeroSection {
  return {
    _type: 'heroSection',
    _key: 'hero',
    ...defaultHeroByLocale[locale],
  }
}

function isCompleteHero(section: HeroSection | undefined): section is HeroSection {
  return Boolean(
    section?._type === 'heroSection' &&
      section.heading &&
      section.paragraph &&
      section.videoUrl &&
      section.buttonText,
  )
}

export async function getHomePageHero(locale: Locale): Promise<HeroSection> {
  try {
    const result = await sanityClient.fetch<HomePageQueryResult | null>(HOME_PAGE_QUERY, {
      documentId: HOME_PAGE_DOCUMENT_ID,
      locale,
    })

    const hero = result?.sections?.find(
      (section): section is HeroSection => section._type === 'heroSection',
    )

    if (!isCompleteHero(hero)) {
      return buildDefaultHero(locale)
    }

    return hero
  } catch {
    return buildDefaultHero(locale)
  }
}

function isCompleteLogos(section: LogosSection | undefined): section is LogosSection {
  return Boolean(
    section?._type === 'logosSection' &&
      Array.isArray(section.logos) &&
      section.logos.length > 0 &&
      section.logos.every((logo) => logo.asset?.url),
  )
}

export async function getHomePageLogos(locale: Locale): Promise<LogosSection | null> {
  try {
    const result = await sanityClient.fetch<HomePageQueryResult | null>(HOME_PAGE_QUERY, {
      documentId: HOME_PAGE_DOCUMENT_ID,
      locale,
    })

    const logos = result?.sections?.find(
      (section): section is LogosSection => section._type === 'logosSection',
    )

    if (!isCompleteLogos(logos)) {
      return null
    }

    return logos
  } catch {
    return null
  }
}
