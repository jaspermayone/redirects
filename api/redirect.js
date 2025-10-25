// api/redirect.js
export default function handler(req, res) {
  const host = req.headers.host?.toLowerCase();

  // Basic redirects (direct domain to destination mapping)
  const redirects = {
    "jaspermayone.cv": "https://jasper.cv",
    "cv.jaspermayone.com": "https://jasper.cv",
  };

  // Check for basic redirects
  if (redirects[host]) {
    const targetUrl = new URL(redirects[host]);
    if (req.url !== '/') {
      targetUrl.pathname = targetUrl.pathname.replace(/\/$/, '') + req.url;
    }

    // Add query parameters if they exist
    const url = new URL(req.url, `https://${host}`);
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
    return res.redirect(301, targetUrl.toString());
  }

  // If no redirect is found, return 404
  res.status(404).send('Not Found');
}
