// api/redirect.js
export default function handler(req, res) {
  const host = req.headers.host?.toLowerCase();
  const path = req.url?.toLowerCase();

  // Basic redirects (direct domain to destination mapping)
  const redirects = {
    'github.jaspermayone.com': 'https://github.com/jaspermayone',
    'linkedin.jaspermayone.com': 'https://www.linkedin.com/in/jaspermayone',
    'bluesky.jaspermayone.com': 'https://bsky.app/profile/jaspermayone.com',
    'threads.jaspermayone.com': 'https://www.threads.net/@jasper.mayone',
    'x.jaspermayone.com': 'https://x.com/jaspermayone',
    'twitter.jaspermayone.com': 'https://x.jaspermayone.com',
    'youtube.jaspermayone.com': 'https://www.youtube.com/@jasper.does.circus',
    'coffee.jaspermayone.com': 'https://buymeacoffee.com/jaspermayone', // Fixed typo in "coffee"
    'reddit.jaspermayone.com': 'https://www.reddit.com/user/j-dogcoder',
    'matrix.jaspermayone.com': 'https://matrix.to/#/@jasper.mayone:matrix.org',
    'devto.jaspermayone.com': 'https://dev.to/jaspermayone',
    'hackerone.jaspermayone.com': "https://hackerone.com/jmayone",
    'producthunt.jaspermayone.com': 'https://www.producthunt.com/@jaspermayone', // Added Product Hunt
    'hackernews.jaspermayone.com': 'https://news.ycombinator.com/user?id=jaspermayone', // Added Hacker News
    'thingiverse.jaspermayone.com': "https://www.thingiverse.com/preamble6098/"
  };

  // Special case redirects (handling specific paths and nested subdomains)
  const specialRedirects = [
    {
      match: (host, path) => host === 'instagram.jaspermayone.com' && path.startsWith('/personal'),
      url: 'https://instagram.com/jasper.mayone'
    },
    {
      match: (host) => host === 'photography.instagram.jaspermayone.com',
      url: 'https://www.instagram.com/jasper.mayone.photography'
    },
    {
      match: (host) => host === 'circus.instagram.jaspermayone.com',
      url: 'https://instagram.com/jasper.mayone.circus'
    }
  ];

  // Check for special redirects first
  const specialRedirect = specialRedirects.find(r => r.match(host, path));
  if (specialRedirect) {
    const targetUrl = new URL(specialRedirect.url);

    // Add query parameters if they exist
    const url = new URL(req.url, `https://${host}`);
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
    return res.redirect(301, targetUrl.toString());
  }

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
