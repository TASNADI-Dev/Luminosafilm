import {homePage} from './homePage'
import {localizedString, localizedText} from './localized'
import {servicePage} from './servicePage'
import {globalCtaSection} from './globalCtaSection'
import {clientLogos} from './clientLogos'
import {aboutPage} from './aboutPage'
import {referencesPage} from './referencesPage'
import {homePageSectionTypes, servicePageSectionTypes} from './sections'

export const schemaTypes = [
  localizedString,
  localizedText,
  ...homePageSectionTypes,
  ...servicePageSectionTypes,
  homePage,
  servicePage,
  globalCtaSection,
  clientLogos,
  referencesPage,
  aboutPage,
]
