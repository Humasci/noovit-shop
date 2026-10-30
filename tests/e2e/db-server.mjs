import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { readFileSync, mkdirSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import http from 'http';

const db = await PGlite.create();
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
`);
for (const file of process.argv.slice(2)) await db.exec(readFileSync(file, 'utf8'));
const server = new PGLiteSocketServer({ db, port: 54322, host: '127.0.0.1' });
await server.start();
console.log('pglite listening on 54322');

const STORE = new URL('./storage/', import.meta.url).pathname;
const types = {};

// Supabase-style gateway: /rest/v1 -> PostgREST, /storage/v1 -> tiny local object store.
http.createServer((req, res) => {
  if (req.url.startsWith('/storage/v1/')) {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', async () => {
      const path = decodeURIComponent(req.url.split('?')[0].replace('/storage/v1/', ''));
      let payload = Buffer.concat(chunks);
      let ctype = req.headers['content-type'];
      if (ctype?.startsWith('multipart/form-data')) {
        const form = await new Request('http://x', { method: 'POST', headers: { 'content-type': ctype }, body: payload }).formData();
        const file = [...form.values()].find((v) => typeof v !== 'string');
        payload = Buffer.from(await file.arrayBuffer());
        ctype = file.type;
      }
      console.log('storage', req.method, path);
      let m;
      if (req.method === 'POST' && (m = path.match(/^object\/([^/]+)\/(.+)$/)) && m[1] !== 'public') {
        const file = join(STORE, m[1], m[2]);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, payload);
        types[file] = ctype;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ Key: `${m[1]}/${m[2]}`, Id: m[2] }));
      }
      if (req.method === 'GET' && (m = path.match(/^object\/public\/([^/]+)\/(.+)$/))) {
        const file = join(STORE, m[1], m[2]);
        if (!existsSync(file)) { res.writeHead(404); return res.end(); }
        res.writeHead(200, { 'Content-Type': types[file] ?? 'image/png' });
        return res.end(readFileSync(file));
      }
      if (req.method === 'DELETE' && (m = path.match(/^object\/([^/]+)$/))) {
        const { prefixes } = JSON.parse(Buffer.concat(chunks).toString() || '{}');
        for (const p of prefixes ?? []) { const f = join(STORE, m[1], p); if (existsSync(f)) unlinkSync(f); }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify((prefixes ?? []).map((name) => ({ name }))));
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'unsupported', message: `${req.method} ${path}` }));
    });
    return;
  }
  const path = req.url.replace(/^\/rest\/v1/, '') || '/';
  const p = http.request({ host: '127.0.0.1', port: 3001, path, method: req.method, headers: req.headers }, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  p.on('error', (e) => { res.writeHead(502); res.end(String(e)); });
  req.pipe(p);
}).listen(54321, () => console.log('supabase-style gateway on 54321'));
