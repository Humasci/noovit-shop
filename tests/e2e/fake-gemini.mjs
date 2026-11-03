// Fake Gemini streamGenerateContent (SSE) for the advisor tests. Saves the last request body.
import http from 'node:http';
import fs from 'node:fs';
http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    fs.writeFileSync(new URL('./gemini-last.json', import.meta.url), JSON.stringify({ url: req.url, body: JSON.parse(body || '{}') }));
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    const parts = ['Magnesium glycinate is a gentle option for sleep. Try ', '[Magnesium Sleep+](/products/magnesium-complex) and see our ', '[magnesium guide](/guides/magnesium). NIH notes most adults ', 'can meet needs from food ([NCCIH](https://www.nccih.nih.gov/health/turmeric)).'];
    for (const t of parts) res.write(`data: ${JSON.stringify({ candidates: [{ content: { role: 'model', parts: [{ text: t }] } }] })}\n\n`);
    res.write(`data: ${JSON.stringify({ candidates: [{ content: { role: 'model', parts: [{ text: '' }] }, finishReason: 'STOP', groundingMetadata: { webSearchQueries: ['magnesium sleep'], groundingChunks: [{ web: { uri: 'https://ods.od.nih.gov/factsheets/Magnesium-Consumer/', title: 'nih.gov' } }], searchEntryPoint: { renderedContent: '<style>.chip{font:14px sans-serif;border:1px solid #ddd;border-radius:16px;padding:6px 12px}</style><a class="chip" href="https://www.google.com/search?q=magnesium+sleep" target="_blank">magnesium sleep</a>' } } }], usageMetadata: { promptTokenCount: 1800, candidatesTokenCount: 80 } })}\n\n`);
    res.end();
  });
}).listen(4611, () => console.log('fake gemini on 4611'));
