// Seeds the service-page whyChooseUs section on all service docs (additive patch only).
import {createClient} from '@sanity/client'

const projectId = '018x49q7'
const dataset = 'production'
const imageAssetId = 'image-0d33ed686cd2610970aaca9e0ee87492d9b5e7cd-1000x1504-jpg'

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
const loremShort = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

const whyChooseUs = {
  _type: 'serviceWhyChooseUsSection',
  image: {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: imageAssetId,
    },
    alt: {
      _type: 'localizedString',
      hu: 'Lorem ipsum',
      en: 'Lorem ipsum',
    },
  },
  heading: {
    _type: 'localizedString',
    hu: 'Miért minket válassz',
    en: 'Why choose us',
  },
  paragraph: {
    _type: 'localizedText',
    hu: loremShort,
    en: loremShort,
  },
  buttonText: {
    _type: 'localizedString',
    hu: 'Primary',
    en: 'Primary',
  },
  rows: [1, 2, 3, 4].map((n) => ({
    _key: `why-row-${n}`,
    _type: 'serviceWhyChooseUsRow',
    title: {
      _type: 'localizedString',
      hu: 'Miért minket válassz',
      en: 'Why choose us',
    },
    body: {
      _type: 'localizedText',
      hu: lorem,
      en: lorem,
    },
  })),
}

const ids = await client.fetch(`*[_type == "servicePage"]._id`)

for (const id of ids) {
  await client.patch(id).set({whyChooseUs}).commit()
  console.log(`Patched ${id}`)
}

console.log(`Done. Updated ${ids.length} service pages.`)
