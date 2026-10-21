// Production build with esbuild: dist/index.html + app.js + app.css + favicon.
import { build } from 'esbuild'
import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const dev = process.argv.includes('--dev')

export async function runBuild({ minify = !dev, sourcemap = dev } = {}) {
  await rm(dist, { recursive: true, force: true })
  await mkdir(dist, { recursive: true })
  const result = await build({
    entryPoints: [join(root, 'src/main.tsx')],
    outfile: join(dist, 'app.js'),
    bundle: true,
    format: 'esm',
    target: ['es2022', 'chrome100', 'safari15', 'firefox100'],
    jsx: 'automatic',
    minify,
    sourcemap,
    legalComments: 'linked',
    define: { 'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development'), __PROD__: String(minify) },
    logLevel: 'info',
    metafile: true,
  })
  await writeFile(join(dist, 'index.html'), await readFile(join(root, 'index.html'), 'utf8'))
  await cp(join(root, 'public'), dist, { recursive: true })
  const sw = join(dist, 'sw.js')
  await writeFile(sw, (await readFile(sw, 'utf8')).replace('__BUILD__', Date.now().toString(36)))
  return result
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runBuild()
}
