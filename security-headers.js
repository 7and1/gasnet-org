// Security Headers Configuration
// These headers should be configured on your web server (nginx, Apache, Vercel, Netlify)
// See SECURITY.md for implementation details
// This file is for documentation/reference only

export const securityHeaders = {
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://giscus.app; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "img-src 'self' https: data:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://giscus.app; " +
    'frame-src https://giscus.app;',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};
