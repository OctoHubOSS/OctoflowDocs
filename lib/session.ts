import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'octoflow_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24h — re-login required after, on purpose (see plan)

export interface SessionGuild {
  id: string;
  name: string;
  icon: string | null;
}

export interface SessionData {
  discordUserId: string;
  username: string;
  avatar: string | null;
  guilds: SessionGuild[];
}

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET env var is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionCookie(data: SessionData): Promise<void> {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

const STATE_COOKIE = 'octoflow_oauth_state';

export async function setOAuthStateCookie(state: string): Promise<void> {
  const store = await cookies();
  store.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes is plenty for the OAuth round trip
  });
}

export async function consumeOAuthStateCookie(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(STATE_COOKIE)?.value ?? null;
  store.delete(STATE_COOKIE);
  return value;
}
