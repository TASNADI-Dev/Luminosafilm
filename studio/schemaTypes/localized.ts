// Reusable field-level localization types with hu/en sub-fields for Sanity schemas.
import {defineArrayMember, defineField, defineType} from 'sanity'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bulleted list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})

export const localizedBlockContent = defineType({
  name: 'localizedBlockContent',
  title: 'Localized Rich Text',
  type: 'object',
  fields: [
    defineField({
      name: 'hu',
      title: 'Hungarian',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
  ],
})

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({
      name: 'hu',
      title: 'Hungarian',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({
      name: 'hu',
      title: 'Hungarian',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
})
