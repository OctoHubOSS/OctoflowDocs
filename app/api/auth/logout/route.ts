import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/session';
import { siteOrigin } from '@/lib/site';

export async function GET(req: NextRequest) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL('/', siteOrigin(req.url)));
}
