import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that apply to using the hosted Octoflow bot.',
};

const LAST_UPDATED = 'August 25, 2026';

export default function TermsPage() {
  return (
    <main className="flex flex-1 justify-center px-4 py-20">
      <article className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-fd-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <Notice />

        <Section title="Acceptance of terms">
          <p>
            By inviting Octoflow to a Discord server or otherwise using the hosted instance at{' '}
            <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm font-mono">v2.gitlogs.xyz</code>,
            you agree to these terms. If you don&apos;t agree, remove the bot from your server and stop
            using it.
          </p>
        </Section>

        <Section title="What the service does">
          <p>
            Octoflow relays GitHub webhook events into Discord channels you configure. It is provided
            for free, as-is, with no guaranteed uptime or support level. See our{' '}
            <Link href="/status" className="underline hover:text-fd-foreground">status page</Link> for
            current availability.
          </p>
        </Section>

        <Section title="Eligibility and Discord's rules">
          <p>
            You must comply with{' '}
            <a href="https://discord.com/terms" className="underline hover:text-fd-foreground" target="_blank" rel="noreferrer noopener">
              Discord&apos;s Terms of Service
            </a>{' '}
            and{' '}
            <a href="https://discord.com/guidelines" className="underline hover:text-fd-foreground" target="_blank" rel="noreferrer noopener">
              Community Guidelines
            </a>{' '}
            while using Octoflow, including Discord&apos;s minimum age requirement. You&apos;re responsible
            for how members of your server interact with the bot.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
            <li>Use Octoflow to relay content that violates Discord&apos;s or GitHub&apos;s terms of service.</li>
            <li>Attempt to overwhelm, abuse, or disrupt the bot or its API (e.g. deliberately flooding webhook endpoints).</li>
            <li>Attempt to access another server&apos;s webhooks, secrets, or configuration without authorization.</li>
            <li>Use the service in a way that violates applicable law.</li>
          </ul>
          <p>
            We reserve the right to mark a webhook as broken, disable it, or ban a guild from the
            service if it&apos;s used abusively.
          </p>
        </Section>

        <Section title="Your webhook secret is your responsibility">
          <p>
            Octoflow issues each webhook a signing secret used to verify events genuinely came from
            GitHub. You&apos;re responsible for keeping it confidential anyone with your webhook URL and
            secret could send fabricated events to your channels. If you believe a secret has leaked,
            rotate it immediately with{' '}
            <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm font-mono">/resetsecret</code>.
          </p>
        </Section>

        <Section title="No warranty">
          <p>
            The service is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind,
            express or implied, including fitness for a particular purpose, reliability, or
            availability. Octoflow is a community/hobby project event delivery may occasionally be
            delayed, dropped, or malformed, and we make no guarantee otherwise.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, we are not liable for any indirect, incidental, or
            consequential damages arising from your use of, or inability to use, Octoflow including
            missed notifications, misdelivered events, or data loss.
          </p>
        </Section>

        <Section title="Open source and self-hosting">
          <p>
            Octoflow&apos;s source is publicly available on{' '}
            <a href="https://github.com/OctoHubOSS/Octoflow" className="underline hover:text-fd-foreground" target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
            . These terms apply to the hosted instance we operate. If you self-host your own instance
            with your own bot token and database, you're operating your own independent service, and
            these terms don't apply to it.
          </p>
        </Section>

        <Section title="Changes to the service or these terms">
          <p>
            We may change, suspend, or discontinue any part of the service at any time, and may update
            these terms as the bot evolves. Material changes will be reflected here with an updated
            date at the top of this page.
          </p>
        </Section>

        <Section title="Termination">
          <p>
            You may stop using Octoflow at any time by removing it from your server and deleting your
            webhooks. We may suspend or terminate access for a server that violates these terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms? Reach out on our{' '}
            <a href="https://discord.gg/Sj2SWMZe2J" className="underline hover:text-fd-foreground" target="_blank" rel="noreferrer noopener">
              support server
            </a>
            .
          </p>
        </Section>

        <p className="text-sm text-fd-muted-foreground">
          See also our <Link href="/privacy" className="underline hover:text-fd-foreground">Privacy Policy</Link>.
        </p>
      </article>
    </main>
  );
}

function Notice() {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-card px-6 py-4 text-sm leading-relaxed">
      <strong>Octoflow is an independent, community-built project.</strong> It is not affiliated with,
      endorsed by, or sponsored by Discord Inc. or GitHub, Inc. &quot;Discord&quot; and &quot;GitHub&quot; are
      trademarks of their respective owners.
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-sm text-fd-muted-foreground leading-relaxed flex flex-col gap-2">
        {children}
      </div>
    </section>
  );
}
