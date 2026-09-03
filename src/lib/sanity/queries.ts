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
    items[]{
      _key,
      "title": title[$locale],
      "body": body[$locale],
      image{
        hotspot,
        crop,
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
    },
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

export const SERVICE_PAGES_SLUGS_QUERY = `*[_type == "servicePage" && defined(slug[$locale].current)]{
  "slug": slug[$locale].current,
  serviceId
}`

export const SERVICE_PAGE_BY_SLUG_QUERY = `*[_type == "servicePage" && slug[$locale].current == $slug][0]{
  serviceId,
  "title": title[$locale],
  "slug": slug[$locale].current
}`
