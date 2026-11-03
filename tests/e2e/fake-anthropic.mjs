// Fake Anthropic Messages API (streaming only) for the advisor tests. Logs the request body for inspection.
import http from 'node:http';
import fs from 'node:fs';
const PORT = 4610;
http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    fs.writeFileSync(new URL('./anthropic-last.json', import.meta.url), body);
    const reply = 'Magnesium glycinate is a gentle place to start for sleep. Try [Magnesium Sleep+](/products/magnesium-complex), and read our [magnesium guide](/guides/magnesium).\n\n- Take it after an evening meal\n- **Check with your doctor** if you take medication';
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    const send = (type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
    send('message_start', { message: { id: 'msg_test', type: 'message', role: 'assistant', model: 'claude-opus-5-5', content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 0 } } });
    send('content_block_start', { index: 0, content_block: { type: 'text', text: '' } });
    for (const chunk of reply.match(/.{1,24}/gs)) send('content_block_delta', { index: 0, delta: { type: 'text_delta', text: chunk } });
    send('content_block_stop', { index: 0 });
    send('message_delta', { delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 40 } });
    send('message_stop', {});
    res.end();
  });
}).listen(PORT, () => console.log('fake anthropic on', PORT));
