import { NextRequest, NextResponse } from 'next/server';
import { consumeOAuthStateCookie, createSessionCookie, type SessionGuild } from '@/lib/session';

const MANAGE_GUILD = 0x20;

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
}

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string; // Discord sends this as a stringified bitfield
}

function hasManageGuild(permissions: string): boolean {
  // BigInt because permission bitfields exceed Number.MAX_SAFE_INTEGER
  return (BigInt(permissions) & BigInt(MANAGE_GUILD)) === BigInt(MANAGE_GUILD);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/dashboard?error=access_denied', req.url));
  }

  const expectedState = await consumeOAuthStateCookie();
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL('/dashboard?error=invalid_state', req.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: 'Dashboard OAuth is not configured on this deployment.' },
      { status: 503 },
    );
  }

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
  }

  const { access_token: accessToken } = (await tokenRes.json()) as { access_token: string };

  const [userRes, guildsRes] = await Promise.all([
    fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);

  if (!userRes.ok || !guildsRes.ok) {
    return NextResponse.redirect(new URL('/dashboard?error=profile_fetch_failed', req.url));
  }

  const user = (await userRes.json()) as DiscordUser;
  const guilds = (await guildsRes.json()) as DiscordGuild[];

  const manageable: SessionGuild[] = guilds
    .filter((g) => g.owner || hasManageGuild(g.permissions))
    .map((g) => ({ id: g.id, name: g.name, icon: g.icon }));

  await createSessionCookie({
    discordUserId: user.id,
    username: user.username,
    avatar: user.avatar,
    guilds: manageable,
  });

  return NextResponse.redirect(new URL('/dashboard', req.url));
}
