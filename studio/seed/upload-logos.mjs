// Uploads local logo files to Sanity and seeds the home page logos section.
import {execFileSync} from 'node:child_process'
import {readdirSync} from 'node:fs'
import {basename, extname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'

const projectId = '018x49q7'
const dataset = 'production'
const logosDir = process.argv[2] ?? '/Users/pepszi/Desktop/Logos'
const studioDir = fileURLToPath(new URL('..', import.meta.url))
const sanityBin = join(studioDir, 'node_modules', '.bin', 'sanity')

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg'])

function toAltText(filename) {
  return basename(filename, extname(filename))
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function uploadAsset(filePath) {
  const output = execFileSync(
    sanityBin,
    ['assets', 'upload', '--file', filePath, '--type', 'image', '--dataset', dataset],
    {cwd: studioDir, encoding: 'utf8'},
  )

  const asset = JSON.parse(output)
  return asset._id
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-19',
  useCdn: false,
})

const logoFiles = readdirSync(logosDir)
  .filter((file) => imageExtensions.has(extname(file).toLowerCase()))
  .sort((a, b) => a.localeCompare(b))

if (logoFiles.length === 0) {
  throw new Error(`No logo images found in ${logosDir}`)
}

const logos = logoFiles.map((file, index) => {
  const filePath = join(logosDir, file)
  const assetId = uploadAsset(filePath)

  return {
    _key: `logo-${index + 1}`,
    alt: {
      hu: toAltText(file),
      en: toAltText(file),
    },
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  }
})

const logosSection = {
  _type: 'logosSection',
  _key: 'logos',
  logos,
}

const homePage = await client.fetch(
  `*[_id == "homePage"][0]{ sections }`,
)

const sectionsWithoutLogos = (homePage?.sections ?? []).filter(
  (section) => section._type !== 'logosSection',
)

await client
  .patch('homePage')
  .set({sections: [...sectionsWithoutLogos, logosSection]})
  .commit()

console.log(`Uploaded ${logos.length} logos and added logos section to homePage.`)
