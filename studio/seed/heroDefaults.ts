export const heroDefaults = {
  hu: {
    heading: 'Professzionális filmkészítés',
    paragraph:
      'Egyedi vizuális történeteket alkotunk, amelyek emlékezetes élményt nyújtanak a közönségnek.',
    buttonText: 'Kapcsolatfelvétel',
  },
  en: {
    heading: 'Professional filmmaking',
    paragraph:
      'We craft distinctive visual stories that create memorable experiences for your audience.',
    buttonText: 'Get in touch',
  },
  videoUrl: 'https://lorem.video/1280x720',
} as const

export function createDefaultHeroSection() {
  return {
    _type: 'heroSection',
    _key: 'hero',
    heading: {
      hu: heroDefaults.hu.heading,
      en: heroDefaults.en.heading,
    },
    paragraph: {
      hu: heroDefaults.hu.paragraph,
      en: heroDefaults.en.paragraph,
    },
    buttonText: {
      hu: heroDefaults.hu.buttonText,
      en: heroDefaults.en.buttonText,
    },
    videoUrl: heroDefaults.videoUrl,
  }
}
