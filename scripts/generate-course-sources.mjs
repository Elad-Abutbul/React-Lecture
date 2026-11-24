import { readFile, readdir, writeFile } from 'node:fs/promises'
import { posix } from 'node:path'
const dir = new URL('../src/components/react-tasks/', import.meta.url)
const files = {}
async function collect(path = '') {
  const entries = await readdir(new URL(path, dir), { withFileTypes: true })
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  for (const entry of entries) {
    const name = posix.join(path, entry.name)
    if (entry.isDirectory()) await collect(name + '/')
    else if (/\.tsx?$/.test(name) && !name.includes('.test.'))
      files['src/' + name] = (
        await readFile(new URL(name, dir), 'utf8')
      ).replace(/\r\n/g, '\n')
  }
}
await collect()
const target = new URL('../src/content/courseSources.json', import.meta.url),
  result = JSON.stringify(files, null, 2) + '\n'
if (process.argv.includes('--check')) {
  if ((await readFile(target, 'utf8')) !== result)
    throw Error(
      'Course source snapshot is stale; run node scripts/generate-course-sources.mjs',
    )
} else await writeFile(target, result)
