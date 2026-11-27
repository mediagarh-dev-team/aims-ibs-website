import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Clone the request headers and inject the pathname
  // so the root layout can detect admin routes without
  // relying on client-side logic.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// Run on every route EXCEPT:
//   - static files and Next.js internals (_next/*)
//   - upload API routes — these receive large multipart bodies (video,
//     PDF, images) and must NOT pass through middleware buffering so the
//     10 MB middleware body cap doesn't truncate them.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/admin/upload|api/admin/upload-local).*)',
  ],
};
