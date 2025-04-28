// netlify/functions/proxy.js
const fetch = require('node-fetch');

exports.handler = async function(event) {
  const url = event.queryStringParameters.url;
  if (!url) {
    return { statusCode: 400, body: 'Missing url parameter' };
  }
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const text = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: text
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
