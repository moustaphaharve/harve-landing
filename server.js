const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4174;
const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8'
};

const MIME_MP4 = 'video/mp4';
MIME['.mp4'] = MIME_MP4;

const server = http.createServer((req, res) => {
  const urlNoQuery = req.url.split('?')[0];

  if (urlNoQuery === '/auth/callback') {
    const callbackPath = path.join(ROOT, 'auth-callback.html');
    fs.readFile(callbackPath, (err, data) => {
      if (err) { res.writeHead(500); res.end('Callback page missing'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(data);
    });
    return;
  }

  let urlPath = req.url === '/' ? '/landing.html' : req.url;
  const filePath = path.resolve(ROOT, decodeURIComponent(urlPath.split('?')[0]).replace(/^\//, ''));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  const url = 'http://localhost:' + PORT;
  try { require('child_process').exec('start "" "' + url + '"'); } catch {}
  console.log('HARVE landing page at ' + url);
});
