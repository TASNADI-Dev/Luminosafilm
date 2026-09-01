// GROQ queries for fetching localized Sanity content in Astro pages.

export const HOME_PAGE_DOCUMENT_ID = 'homePage'

export const HOME_PAGE_QUERY = `coalesce(
  *[_id == $documentId][0],
  *[_id == "drafts." + $documentId][0]
){
  sections[]{
    _type,
    _key,
    "heading": heading[$locale],
    "paragraph": paragraph[$locale],
    "buttonText": buttonText[$locale],
    videoUrl,
    logos[]{
      _key,
      "alt": alt[$locale],
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    }
  }
}`
