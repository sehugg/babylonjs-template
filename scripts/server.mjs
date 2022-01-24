import esbuild from 'esbuild'
import { createServer, request } from 'http'
import { spawn } from 'child_process'

const port = 8088
const esport = port + 10000

const clients = []

// https://esbuild.github.io/api/

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    outfile: './gen/bundle.js',
    sourcemap: 'external',

    banner: { js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();' },
    watch: {
      onRebuild(error, result) {
        clients.forEach((res) => res.write('data: update\n\n'))
        clients.length = 0
        console.log(error ? error : '...')
      },
    },
  })
  .catch(() => process.exit(1))

esbuild.serve({
	servedir: './www/',
	host: 'localhost',
	port: esport
}, {}).then(() => {
  createServer((req, res) => {
    const { url, method, headers } = req
    console.log('>>>', method, url);
    if (req.url === '/esbuild')
      return clients.push(
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        })
      )
    const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html` //for PWA with router
    req.pipe(
      request({ hostname: '0.0.0.0', port: port+10000, path, method, headers }, (prxRes) => {
        res.writeHead(prxRes.statusCode, prxRes.headers)
        prxRes.pipe(res, { end: true })
      }),
      { end: true }
    )
  }).listen(port)

  setTimeout(() => {
    const op = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', '/c', 'start'] }
    const ptf = process.platform
    if (clients.length === 0) spawn(op[ptf][0], [...[op[ptf].slice(1)], `http://localhost:${port}`])
  }, 1000) //open the default browser only if it is not opened yet
})
