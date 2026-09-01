// Fetches and normalizes localized home page content from Sanity.
import {sanityClient} from 'sanity:client'
import type {Locale} from '../i18n'
import {HOME_PAGE_QUERY, homePageDocumentId} from './queries'

export interface HeroSection {
  _type: 'heroSection'
  _key: string
  heading: string
  paragraph: string
  videoUrl: string
  buttonText: string
}

interface HomePageQueryResult {
  sections?: HeroSection[]
}

const defaultHeroByLocale: Record<Locale, Omit<HeroSection, '_type' | '_key'>> = {
  hu: {
    heading: 'Professzionális filmkészítés',
    paragraph:
      'Egyedi vizuális történeteket alkotunk, amelyek emlékezetes élményt nyújtanak a közönségnek.',
    videoUrl: 'https://lorem.video/1280x720',
    buttonText: 'Kapcsolatfelvétel',
  },
  en: {
    heading: 'Professional filmmaking',
    paragraph:
      'We craft distinctive visual stories that create memorable experiences for your audience.',
    videoUrl: 'https://lorem.video/1280x720',
    buttonText: 'Get in touch',
  },
}

function buildDefaultHero(locale: Locale): HeroSection {
  return {
    _type: 'heroSection',
    _key: `hero-${locale}`,
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
      documentId: homePageDocumentId(locale),
    })

    const hero = result?.sections?.find((section) => section._type === 'heroSection')

    if (!isCompleteHero(hero)) {
      return buildDefaultHero(locale)
    }

    return hero
  } catch {
    return buildDefaultHero(locale)
  }
}
