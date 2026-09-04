// Privacy policy page singleton: localized rich-text body (heading is hardcoded in the site).
import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'

const placeholderBlock = (text: string) => ({
  _type: 'block' as const,
  style: 'normal',
  markDefs: [],
  children: [
    {
      _type: 'span' as const,
      text,
      marks: [],
    },
  ],
})

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localizedBlockContent',
      validation: (rule) => rule.required(),
    }),
  ],
  initialValue: {
    body: {
      hu: [placeholderBlock('Ez egy helyőrző szöveg az adatvédelmi irányelvekhez.')],
      en: [placeholderBlock('This is placeholder text for the privacy policy.')],
    },
  },
  preview: {
    prepare() {
      return {
        title: 'Privacy Page',
      }
    },
  },
})
