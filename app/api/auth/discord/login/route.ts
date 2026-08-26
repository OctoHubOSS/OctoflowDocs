import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { setOAuthStateCookie } from '@/lib/session';

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'Dashboard OAuth is not configured on this deployment.' },
      { status: 503 },
    );
  }

  const state = randomBytes(16).toString('hex');
  await setOAuthStateCookie(state);

  const authorizeUrl = new URL('https://discord.com/api/oauth2/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', 'identify guilds');
  authorizeUrl.searchParams.set('state', state);

  return NextResponse.redirect(authorizeUrl.toString());
}
