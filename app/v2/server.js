const express = require('express');
const app = express();
const port = 3002;

app.get('/', (_req, res) => {
  res.send('Hello from v2 (Green/Canary)!');
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', version: 'v2' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`v2 running on ${port}`);
});
