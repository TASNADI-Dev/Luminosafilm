// GROQ queries for fetching localized Sanity content in Astro pages.
import type {Locale} from '../i18n'

export const HOME_PAGE_QUERY = `coalesce(
  *[_id == $documentId][0],
  *[_id == "drafts." + $documentId][0]
){
  sections[]{
    _type,
    _key,
    heading,
    paragraph,
    videoUrl,
    buttonText
  }
}`

export function homePageDocumentId(locale: Locale): string {
  return `homePage-${locale}`
}
