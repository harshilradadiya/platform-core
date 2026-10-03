import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BAD_BOTS = [
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'mj12bot',
  'petalbot',
  'bytespider',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const isProd = process.env.NODE_ENV === 'production';

  // 1. Block aggressive scrapers & bad bots in production
  if (isProd) {
    const isBadBot = BAD_BOTS.some((bot) => userAgent.includes(bot));
    if (isBadBot) {
      return new NextResponse('Access forbidden for automated indexer bot.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  // 2. Redirect HTTP -> HTTPS in production
  const proto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host');
  if (isProd && proto === 'http' && host && !host.includes('localhost')) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, 301);
  }

  // 3. Prepare response with strict security headers
  const response = NextResponse.next();

  // Content-Security-Policy (allows Google Fonts, AdSense, ytimg, pinimg)
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https: http://localhost:8000 http://127.0.0.1:8000",
    "frame-src 'self' https://googleads.g.doubleclick.net",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  if (isProd) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (handled independently)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
