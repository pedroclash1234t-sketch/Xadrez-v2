// Dev server: esbuild watch + static serving of ./dist with live rebuilds.
import { context } from 'esbuild'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
await mkdir(dist, { recursive: true })
await writeFile(join(dist, 'index.html'), await readFile(join(root, 'index.html'), 'utf8'))
await cp(join(root, 'public'), dist, { recursive: true })

const ctx = await context({
  entryPoints: [join(root, 'src/main.tsx')],
  outfile: join(dist, 'app.js'),
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  sourcemap: true,
  define: { 'process.env.NODE_ENV': '"development"', __PROD__: 'false' },
  logLevel: 'info',
})
await ctx.watch()
const { port } = await ctx.serve({ servedir: dist, port: Number(process.env.PORT) || 5173 })
console.log(`Midnight Chess (dev) em http://localhost:${port}`)
