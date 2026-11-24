import { mkdtemp, writeFile, mkdir, symlink, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { COURSE_BUILDS } from '../src/content/courseBuilds.ts'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..'),
  workspace = await mkdtemp(join(tmpdir(), 'react-course-check-'))
let checks = 0
try {
  for (const [id, files] of Object.entries(COURSE_BUILDS)) {
    const dir = join(workspace, id)
    await mkdir(dir, { recursive: true })
    await symlink(join(root, 'node_modules'), join(dir, 'node_modules'), 'dir')
    for (const [name, source] of Object.entries(files)) {
      const file = join(dir, name)
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, source)
    }
    await writeFile(
      join(dir, 'src/vite-env.d.ts'),
      '/// <reference types="vite/client" />',
    )
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify({ type: 'module' }),
    )
    await writeFile(
      join(dir, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2023',
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
      "import {createRoot} from 'react-dom/client';import App from './App';import './index.css';createRoot(document.getElementById('root')!).render(<App/>);",
    )
    await writeFile(join(dir, 'src/index.css'), '@import "tailwindcss";')
    await writeFile(
      join(dir, 'vite.config.ts'),
      "import react from '@vitejs/plugin-react';import tailwindcss from '@tailwindcss/vite';export default {plugins:[react(),tailwindcss()]};",
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
      const r = spawnSync(process.execPath, args, {
        cwd: dir,
        encoding: 'utf8',
      })
      if (r.status !== 0) throw Error(`${id}: ${r.stdout}\n${r.stderr}`)
      checks++
    }
    console.log(`${id}: strict TypeScript + Tailwind production build passed`)
  }
  console.log(`${checks} course source checks passed`)
} finally {
  await rm(workspace, { recursive: true, force: true })
}
