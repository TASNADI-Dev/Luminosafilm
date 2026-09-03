// Service page related references: YouTube video URL (shared) + localized title per item.
import {defineArrayMember, defineField, defineType} from 'sanity'

export const serviceRelatedReferencesSection = defineType({
  name: 'serviceRelatedReferencesSection',
  title: 'Related References Section',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'References',
      description:
        'YouTube links are shared across languages. Titles are localized (Hungarian and English).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceRelatedReference',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'videoUrl',
              title: 'Video URL',
              description: 'YouTube link (same for both languages).',
              type: 'url',
              validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {titleHu: 'title.hu', videoUrl: 'videoUrl'},
            prepare({titleHu, videoUrl}) {
              return {
                title: titleHu || 'Reference',
                subtitle: videoUrl,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: 'Related References',
        subtitle: count ? `${count} video${count === 1 ? '' : 's'}` : 'No videos',
      }
    },
  },
})
