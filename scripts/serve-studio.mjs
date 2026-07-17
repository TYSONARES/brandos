import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = 'dist/studio';
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';

if (!existsSync(join(root, 'index.html'))) {
  console.error('Missing Studio build. Run `npm run build:studio` before `npm run serve:studio`.');
  process.exit(1);
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = createServer((request, response) => {
  const requestPath = new URL(request.url, `http://localhost:${port}`).pathname;
  const safePath = normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(root, safePath === '/' ? 'index.html' : safePath);

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, { 'content-type': contentTypes[extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
});

server.on('error', (error) => {
  console.error(`Unable to start Studio preview server on ${host}:${port}: ${error.message}`);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`BrandOS Studio available at http://${host}:${port}`);
});
