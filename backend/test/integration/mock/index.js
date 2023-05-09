const express = require('express');

const app = express();
app.use(express.json());

let emailCache = [];

app.get('/status', (_req, res) => {
  res.end();
});

app.post('/v2/email/outbound-emails', (req, res) => {
  emailCache.push(req.body);
  res.end();
});

app.get('/emails', (_req, res) => {
  res.json({ emails: emailCache });
});

app.delete('/emails', (_req, res) => {
  emailCache = [];
  res.end();
});

/* eslint-disable-next-line no-console */
app.listen(80, () => console.log('Mock server up...'));
