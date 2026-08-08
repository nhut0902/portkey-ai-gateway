const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: 8787,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', () => {
    res.writeHead(502);
    res.end('Portkey starting up...');
  });
  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`[proxy] Listening on port ${PORT} → proxying to Portkey on 8787`);
});

const portkey = spawn('npx', ['@portkey-ai/gateway', '--port=8787'], {
  stdio: 'inherit',
  shell: true
});
portkey.on('error', (err) => console.error('[portkey] Error:', err));
portkey.on('exit', (code) => process.exit(code));
