// About page singleton: localized hero copy + shared hero image.
import {UsersIcon} from '@sanity/icons/Users'
import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'paragraph',
      title: 'Paragraph',
      type: 'localizedText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      description: 'Shared across languages. Upload once; set Hungarian and English alt text.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'localizedString',
          description: 'Brief description for screen readers (localized).',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'closingParagraph',
      title: 'Closing paragraph',
      type: 'localizedText',
      description: 'Centered paragraph shown below the hero image.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page',
      }
    },
  },
})
