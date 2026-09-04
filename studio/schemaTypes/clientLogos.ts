// Client logos singleton shared by the home and contact pages.
import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const clientLogos = defineType({
  name: 'clientLogos',
  title: 'Client Logos',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'logos',
      title: 'Logos',
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
              description: 'Brief description of the logo for screen readers.',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {logos: 'logos'},
    prepare({logos}) {
      const count = Array.isArray(logos) ? logos.length : 0
      return {
        title: 'Client Logos',
        subtitle: count === 1 ? '1 logo' : `${count} logos`,
      }
    },
  },
})
