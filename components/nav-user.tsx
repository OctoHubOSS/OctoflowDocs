import Image from 'next/image';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { getSession } from '@/lib/session';
import { checkIsAdmin } from '@/lib/admin-api';

export async function NavUser() {
  const session = await getSession();
  if (!session) return null;

  const isAdmin = await checkIsAdmin(session.discordUserId);

  return (
    <Link
      href={isAdmin ? '/admin' : '/dashboard'}
      title={isAdmin ? `Signed in as ${session.username} - admin access` : `Signed in as ${session.username}`}
      className="flex items-center gap-1.5 rounded-full border border-fd-border py-1 pl-1 pr-2.5 text-xs font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground hover:bg-fd-muted max-md:hidden"
    >
      {session.avatar ? (
        <Image
          src={`https://cdn.discordapp.com/avatars/${session.discordUserId}/${session.avatar}.png?size=32`}
          alt=""
          width={20}
          height={20}
          className="rounded-full"
        />
      ) : (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fd-muted text-[10px] font-semibold">
          {session.username.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="max-w-[100px] truncate">{session.username}</span>
      {isAdmin && <Shield className="size-3 text-fd-primary shrink-0" aria-label="Admin access" />}
    </Link>
  );
}
