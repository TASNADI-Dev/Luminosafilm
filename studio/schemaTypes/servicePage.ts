import {DocumentIcon} from '@sanity/icons/Document'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const servicePage = defineType({
  name: 'servicePage',
  title: 'Service Page',
  type: 'document',
  icon: DocumentIcon,
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
      name: 'images',
      title: 'Images',
      description:
        'Shared across languages. Upload once; set Hungarian and English alt text per image.',
      type: 'array',
      of: [
        defineArrayMember({
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
        }),
      ],
      validation: (rule) =>
        rule.min(1).warning('Add at least one image for the scrolling strip.'),
    }),
    defineField({
      name: 'featureRows',
      title: 'Feature Rows',
      type: 'featureRowsSection',
    }),
  ],
  preview: {
    select: {headingHu: 'heading.hu'},
    prepare({headingHu}) {
      return {
        title: headingHu || 'Service Page',
      }
    },
  },
})
