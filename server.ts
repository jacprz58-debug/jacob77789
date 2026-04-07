import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Advanced Proxy Endpoint with HTML and CSS Rewriting
  app.get("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) return res.status(400).send("URL is required");

    try {
      const response = await axios.get(targetUrl, {
        responseType: 'arraybuffer',
        timeout: 20000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': new URL(targetUrl).origin,
          'Cache-Control': 'no-cache'
        },
        validateStatus: () => true
      });

      const contentType = response.headers['content-type'] || '';
      
      // Copy headers, excluding security/compression
      Object.keys(response.headers).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (!['content-security-policy', 'x-frame-options', 'content-encoding', 'transfer-encoding', 'strict-transport-security'].includes(lowerKey)) {
          res.set(key, response.headers[key]);
        }
      });

      if (response.status >= 300 && response.status < 400 && response.headers.location) {
        const redirectUrl = new URL(response.headers.location, targetUrl).href;
        return res.redirect(`/api/proxy?url=${encodeURIComponent(redirectUrl)}`);
      }

      const targetOrigin = new URL(targetUrl).origin;

      if (contentType.includes('text/html')) {
        let html = response.data.toString('utf8');
        const $ = cheerio.load(html);

        const rewrite = (selector: string, attr: string) => {
          $(selector).each((_, el) => {
            const val = $(el).attr(attr);
            if (val && !val.startsWith('data:') && !val.startsWith('javascript:') && !val.startsWith('#')) {
              try {
                const absoluteUrl = new URL(val, targetUrl).href;
                if (attr === 'href' && !val.match(/\.(png|jpg|jpeg|gif|css|js|svg|webp)$/i)) {
                  $(el).attr(attr, `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`);
                } else if (val.endsWith('.css')) {
                  $(el).attr(attr, `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`);
                } else {
                  $(el).attr(attr, absoluteUrl);
                }
              } catch (e) {}
            }
          });
        };

        rewrite('a', 'href');
        rewrite('img', 'src');
        rewrite('script', 'src');
        rewrite('link', 'href');
        rewrite('form', 'action');
        rewrite('iframe', 'src');
        rewrite('video', 'src');
        rewrite('audio', 'src');
        rewrite('source', 'src');

        // Rewrite inline styles
        $('[style]').each((_, el) => {
          let style = $(el).attr('style');
          if (style) {
            style = style.replace(/url\(['"]?([^'"]+)['"]?\)/g, (match, url) => {
              try {
                return `url("${new URL(url, targetUrl).href}")`;
              } catch (e) { return match; }
            });
            $(el).attr('style', style);
          }
        });

        // Inject Stealth Script
        $('head').prepend(`
          <script>
            const originalOpen = window.open;
            window.open = function(url, name, specs) {
              if (url && !url.startsWith(window.location.origin)) {
                const proxiedUrl = window.location.origin + '/api/proxy?url=' + encodeURIComponent(new URL(url, "${targetUrl}").href);
                return originalOpen(proxiedUrl, name, specs);
              }
              return originalOpen(url, name, specs);
            };
            // Intercept fetch/XHR could go here for even better proxying
          </script>
        `);

        res.send($.html());
      } else if (contentType.includes('text/css')) {
        let css = response.data.toString('utf8');
        // Rewrite url() in CSS files
        css = css.replace(/url\(['"]?([^'"]+)['"]?\)/g, (match, url) => {
          try {
            if (url.startsWith('data:')) return match;
            const absoluteUrl = new URL(url, targetUrl).href;
            return `url("${absoluteUrl}")`;
          } catch (e) { return match; }
        });
        res.send(css);
      } else {
        res.send(Buffer.from(response.data));
      }
    } catch (error) {
      console.error("Proxy error:", targetUrl, error.message);
      res.status(502).send(`Proxy Error: ${error.message}`);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
