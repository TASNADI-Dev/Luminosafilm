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

export const SERVICE_PAGE_BY_ID_QUERY = `coalesce(
  *[_id == $documentId][0],
  *[_id == "drafts." + $documentId][0]
){
  "heading": heading[$locale],
  "paragraph": paragraph[$locale],
  images[]{
    _key,
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
  },
  featureRows{
    "heading": heading[$locale],
    rows[]{
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
    }
  },
  whyChooseUs{
    "heading": heading[$locale],
    "paragraph": paragraph[$locale],
    "buttonText": buttonText[$locale],
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
    },
    rows[]{
      _key,
      "title": title[$locale],
      "body": body[$locale]
    }
  },
  relatedReferences{
    items[]{
      _key,
      "title": title[$locale],
      videoUrl
    }
  }
}`

export const REFERENCES_PAGE_DOCUMENT_ID = 'referencesPage'

export const REFERENCES_PAGE_QUERY = `coalesce(
  *[_id == $documentId][0],
  *[_id == "drafts." + $documentId][0]
){
  "heading": heading[$locale],
  "paragraph": paragraph[$locale],
  references{
    items[]{
      _key,
      "title": title[$locale],
      videoUrl
    }
  }
}`

export const GLOBAL_CTA_SECTION_DOCUMENT_ID = 'globalCtaSection'

export const GLOBAL_CTA_SECTION_QUERY = `coalesce(
  *[_id == $documentId][0],
  *[_id == "drafts." + $documentId][0]
){
  "heading": heading[$locale],
  "paragraph": paragraph[$locale],
  "buttonText": buttonText[$locale]
}`
