const express = require('express');
const { exec } = require('child_process');
const scrapeNoon = require('./new_scrapper');
const app = express();

app.get('/', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing 'url' parameter.");

  exec(`node scraper.js "${url}"`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.type('json').send(stdout);
  });
});

app.get('/scrape', async(req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json ({success:false,error: "Missing 'url' parameter."});
  const result = await scrapeNoon(url);
  res.json({success:true,data:result});
});

app.listen(3000, () => console.log('Server running'));
 