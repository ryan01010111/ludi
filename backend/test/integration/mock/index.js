const express = require('express');

const app = express();
app.use(express.json());

let emailCache = [];

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

app.listen(80, () => console.log('Mock server up...'));
