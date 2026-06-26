import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip all paths that should not be internationalized
  matcher: [
    '/', 
    '/(tr|en)/:path*', 
    // Tüm klasörleri yakala ama statik asset ve apileri dahil etme
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
