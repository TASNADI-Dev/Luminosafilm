import {homePage} from './homePage'
import {
  blockContent,
  localizedBlockContent,
  localizedSimpleBlockContent,
  localizedString,
  localizedText,
  simpleBlockContent,
} from './localized'
import {servicePage} from './servicePage'
import {globalCtaSection} from './globalCtaSection'
import {primaryButton} from './primaryButton'
import {clientLogos} from './clientLogos'
import {aboutPage} from './aboutPage'
import {privacyPage} from './privacyPage'
import {referencesPage} from './referencesPage'
import {homePageSectionTypes, servicePageSectionTypes} from './sections'

export const schemaTypes = [
  localizedString,
  localizedText,
  blockContent,
  simpleBlockContent,
  localizedBlockContent,
  localizedSimpleBlockContent,
  ...homePageSectionTypes,
  ...servicePageSectionTypes,
  homePage,
  servicePage,
  globalCtaSection,
  primaryButton,
  clientLogos,
  referencesPage,
  aboutPage,
  privacyPage,
]
