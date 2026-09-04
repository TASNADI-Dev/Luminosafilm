import {homePage} from './homePage'
import {blockContent, localizedBlockContent, localizedString, localizedText} from './localized'
import {servicePage} from './servicePage'
import {globalCtaSection} from './globalCtaSection'
import {clientLogos} from './clientLogos'
import {aboutPage} from './aboutPage'
import {privacyPage} from './privacyPage'
import {referencesPage} from './referencesPage'
import {homePageSectionTypes, servicePageSectionTypes} from './sections'

export const schemaTypes = [
  localizedString,
  localizedText,
  blockContent,
  localizedBlockContent,
  ...homePageSectionTypes,
  ...servicePageSectionTypes,
  homePage,
  servicePage,
  globalCtaSection,
  clientLogos,
  referencesPage,
  aboutPage,
  privacyPage,
]
