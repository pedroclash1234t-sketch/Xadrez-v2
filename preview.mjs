// Serves ./dist on http://localhost:4173 (static files only).
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'dist')
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.map': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' }

export function serve(port = 4173) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://x')
    const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
    const file = join(root, rel === '/' || rel === '\\' ? 'index.html' : rel)
    if (!file.startsWith(root)) {
      res.writeHead(403).end()
      return
    }
    try {
      const body = await readFile(file)
      res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(body)
    } catch {
      res.writeHead(404).end('Not found')
    }
  })
  return new Promise((resolve) => server.listen(port, () => resolve(server)))
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await serve(Number(process.env.PORT) || 4173)
  console.log('Midnight Chess em http://localhost:' + (process.env.PORT || 4173))
}
