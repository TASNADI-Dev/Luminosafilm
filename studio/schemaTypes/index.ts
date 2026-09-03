import {homePage} from './homePage'
import {localizedString, localizedText} from './localized'
import {servicePage} from './servicePage'
import {globalCtaSection} from './globalCtaSection'
import {homePageSectionTypes, servicePageSectionTypes} from './sections'

export const schemaTypes = [
  localizedString,
  localizedText,
  ...homePageSectionTypes,
  ...servicePageSectionTypes,
  homePage,
  servicePage,
  globalCtaSection,
]
