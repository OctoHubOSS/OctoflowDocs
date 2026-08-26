// Behind a reverse proxy (Dokploy), the request Next.js sees often has an
// internal Host (e.g. localhost:48502, the container's own port) rather than
// the real public domain. Building redirect URLs from req.url in that
// situation sends users to the internal host instead of the real site.
// DISCORD_REDIRECT_URI is already required to be the correct public origin
// for OAuth to work at all, so it doubles as a reliable source of truth here
// — NEXT_PUBLIC_SITE_URL is available as an explicit override if the two
// ever need to differ.
export function siteOrigin(requestUrl: string): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.DISCORD_REDIRECT_URI) return new URL(process.env.DISCORD_REDIRECT_URI).origin;
  return new URL(requestUrl).origin;
}
