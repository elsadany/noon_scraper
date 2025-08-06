const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing 'url' parameter.");

  exec(`node scraper.js "${url}"`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.type('json').send(stdout);
  });
});

app.listen(3000, () => console.log('Server running'));
