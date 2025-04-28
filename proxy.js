// *********************
// File: proxy.js
// *********************
const express = require('express');
const app = express();
const PORT = 8080;

// Cho phép CORS cho mọi origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Endpoint proxy: gọi đến URL thực qua query string
app.get('/', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'http://dautiengphuochoa.com',
        'Origin': 'http://dautiengphuochoa.com'
      }
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Khởi động proxy server
app.listen(PORT, () => console.log(`Proxy server running at http://localhost:${PORT}`));