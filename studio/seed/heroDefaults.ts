export const heroDefaults = {
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
} as const

export type HomePageLocale = keyof typeof heroDefaults

export function createHeroSection(locale: HomePageLocale) {
  return {
    _type: 'heroSection',
    _key: `hero-${locale}`,
    ...heroDefaults[locale],
  }
}
