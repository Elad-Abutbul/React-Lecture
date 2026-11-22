import { mkdtemp, writeFile, mkdir, symlink, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { HANDS_ON_SOLUTIONS } from '../src/content/handsOnSolutions.ts'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workspace = await mkdtemp(join(tmpdir(), 'react-workshop-check-'))
let checks = 0
try {
  for (const [id, files] of Object.entries(HANDS_ON_SOLUTIONS)) {
    const dir = join(workspace, id)
    await mkdir(dir, { recursive: true })
    await symlink(join(root, 'node_modules'), join(dir, 'node_modules'), 'dir')
    for (const [name, source] of Object.entries(files)) {
      const file = join(dir, name)
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, source)
    }
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify({ type: 'module' }),
    )
    await writeFile(
      join(dir, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          verbatimModuleSyntax: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ['src'],
      }),
    )
    await writeFile(
      join(dir, 'index.html'),
      '<html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    )
    await writeFile(
      join(dir, 'src/main.tsx'),
      "import {createRoot} from 'react-dom/client';import App from './App';createRoot(document.getElementById('root')!).render(<App/>);",
    )
    await writeFile(
      join(dir, 'vite.config.ts'),
      "import react from '@vitejs/plugin-react';export default {plugins:[react()]};",
    )
    for (const args of [
      [join(root, 'node_modules/typescript/bin/tsc'), '-p', dir],
      [
        join(root, 'node_modules/vite/bin/vite.js'),
        'build',
        '--configLoader',
        'native',
      ],
    ]) {
      const result = spawnSync(process.execPath, args, {
        cwd: dir,
        encoding: 'utf8',
      })
      if (result.status !== 0)
        throw new Error(`${id}: ${result.stdout}\n${result.stderr}`)
      checks++
    }
    console.log(`${id}: strict TypeScript + production build passed`)
  }
  console.log(`${checks} workshop source checks passed`)
} finally {
  await rm(workspace, { recursive: true, force: true })
}
