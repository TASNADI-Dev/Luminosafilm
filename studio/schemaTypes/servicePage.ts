import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'

export const servicePage = defineType({
  name: 'servicePage',
  title: 'Service Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'serviceId',
      title: 'Service ID',
      type: 'string',
      description:
        'Stable code key matching the site catalog (e.g. documentaries). Used for routing fallbacks.',
      options: {
        list: [
          {title: 'Documentaries', value: 'documentaries'},
          {title: 'Oral history', value: 'oral-history'},
          {title: 'Promotional films', value: 'promotional-films'},
          {title: 'NGO presentations', value: 'ngo-presentations'},
          {title: 'Education', value: 'education'},
          {title: 'Grant writing', value: 'grant-writing'},
          {title: 'Equipment rental', value: 'equipment-rental'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'object',
      fields: [
        defineField({
          name: 'hu',
          title: 'Hungarian slug',
          type: 'slug',
          options: {source: 'title.hu', maxLength: 96},
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'en',
          title: 'English slug',
          type: 'slug',
          options: {source: 'title.en', maxLength: 96},
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {titleHu: 'title.hu', serviceId: 'serviceId'},
    prepare({titleHu, serviceId}) {
      return {
        title: titleHu || 'Service Page',
        subtitle: serviceId,
      }
    },
  },
})
