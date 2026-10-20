const express = require('express');
const app = express();
const port = 3001;

app.get('/', (_req, res) => {
  res.send('Hello from v1 (Blue)!');
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', version: 'v1' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`v1 running on ${port}`);
});
