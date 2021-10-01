module.exports = {
  "mode": "production",
  "globDirectory": "_site/",
  "globPatterns": [
    "**/*.{css,ttf,woff,woff2,png,jpeg,ico,jpg,js,html,json}"
  ],
  "swDest": "_site/sw.js",
  "skipWaiting": true,
  "cleanupOutdatedCaches": true
};
