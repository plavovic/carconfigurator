const express = require('express');
const https = require('https');
const http = require('http');

const router = express.Router();

const ALLOWED_HOSTS = new Set([
  'prs.porsche.com',
  'configurator.porsche.com'
]);

const MAX_BYTES = 12 * 1024 * 1024; // 12MB safety limit
const MAX_REDIRECTS = 3;

function isAllowedUrl(input) {
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:') return null;
  if (!ALLOWED_HOSTS.has(parsed.hostname)) return null;
  return parsed;
}

function proxyRequest(urlObj, res, redirectCount = 0) {
  const client = urlObj.protocol === 'https:' ? https : http;

  const req = client.get(
    urlObj,
    {
      headers: {
        'User-Agent': 'carconfigurator/1.0',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
      }
    },
    (upstream) => {
      const status = upstream.statusCode || 500;
      const location = upstream.headers.location;

      if (status >= 300 && status < 400 && location) {
        if (redirectCount >= MAX_REDIRECTS) {
          res.status(508).json({ error: 'Too many redirects' });
          upstream.resume();
          return;
        }

        const nextUrl = new URL(location, urlObj);
        const allowedNext = isAllowedUrl(nextUrl.toString());
        if (!allowedNext) {
          res.status(400).json({ error: 'Redirect target not allowed' });
          upstream.resume();
          return;
        }

        upstream.resume();
        proxyRequest(allowedNext, res, redirectCount + 1);
        return;
      }

      if (status !== 200) {
        res.status(status).json({ error: `Upstream returned ${status}` });
        upstream.resume();
        return;
      }

      const contentType = upstream.headers['content-type'] || 'application/octet-stream';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

      let bytes = 0;
      upstream.on('data', (chunk) => {
        bytes += chunk.length;
        if (bytes > MAX_BYTES) {
          upstream.destroy(new Error('Image too large'));
        }
      });

      upstream.on('error', () => {
        if (!res.headersSent) res.status(502).end();
      });

      upstream.pipe(res);
    }
  );

  req.on('error', () => {
    if (!res.headersSent) res.status(502).json({ error: 'Failed to fetch image' });
  });
}

// GET /api/image-proxy?url=https://...
router.get('/image-proxy', (req, res) => {
  const rawUrl = String(req.query.url || '').trim();
  if (!rawUrl) return res.status(400).json({ error: 'Missing url' });

  const allowed = isAllowedUrl(rawUrl);
  if (!allowed) return res.status(400).json({ error: 'URL not allowed' });

  proxyRequest(allowed, res);
});

module.exports = router;
