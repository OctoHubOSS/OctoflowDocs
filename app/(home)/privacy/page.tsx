import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What data Octoflow collects, why, and how to have it removed.',
};

const LAST_UPDATED = 'August 25, 2026';

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 justify-center px-4 py-20">
      <article className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-fd-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <Notice />

        <Section title="What Octoflow is">
          <p>
            Octoflow (&quot;we&quot;, &quot;the bot&quot;, &quot;the service&quot;) is a Discord bot that
            relays GitHub webhook events into Discord channels. This policy describes what data the
            hosted instance at <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm font-mono">v2.gitlogs.xyz</code>{' '}
            collects when you use it, and how it&apos;s handled. If you run your own self-hosted
            instance from the{' '}
            <a
              href="https://github.com/OctoHubOSS/Octoflow"
              className="underline hover:text-fd-foreground"
              target="_blank"
              rel="noreferrer noopener"
            >
              open-source repository
            </a>
            , this policy doesn&apos;t apply to your instance you control that data yourself.
          </p>
        </Section>

        <Section title="Data we store">
          <p>When you use commands like <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm font-mono">/newhook</code> or <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm font-mono">/newrepo</code>, we store:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
            <li>Your Discord server (guild) ID.</li>
            <li>Webhook IDs and their signing secrets (used to verify that incoming requests really came from GitHub).</li>
            <li>A comment/label you set for a webhook.</li>
            <li>The GitHub repository owner/name and Discord channel ID for each linked repository.</li>
            <li>Event modifier configuration (which event types are filtered, redirected, and at what priority).</li>
            <li>The Discord user ID of whoever created or last edited a webhook, repository link, or event modifier.</li>
            <li>Short text logs of how a given GitHub event was processed (repository name, event type, and the routing/permission checks applied) used for the{' '}
              <Link href="/status" className="underline hover:text-fd-foreground">/audit debugging tool</Link>.
            </li>
          </ul>
        </Section>

        <Section title="Data we don't store">
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>We do not read, log, or store the content of your Discord messages.</li>
            <li>We do not store your GitHub account, GitHub token, or any GitHub login credentials Octoflow never authenticates as you on GitHub. You add the webhook URL to your repository settings yourself.</li>
            <li>We do not collect email addresses, IP addresses, or analytics/tracking data about who uses the bot.</li>
            <li>Full GitHub webhook payloads (commit messages, diffs, author emails, etc.) are used transiently to build the Discord message and are not retained afterward, beyond the short processing summary described above.</li>
          </ul>
        </Section>

        <Section title="How we use this data">
          <p>
            Stored data is used exclusively to operate the bot: matching incoming GitHub events to the
            right server and channel, enforcing your event modifier rules, verifying webhook
            signatures, and helping you debug delivery issues. We do not sell, rent, or share this
            data with third parties, and we don&apos;t use it for advertising.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Webhook, repository, and event modifier data is kept for as long as the webhook exists.
            Deleting a webhook with <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm font-mono">/delhook</code>{' '}
            immediately and permanently deletes its repositories and event modifiers along with it.
            Processing logs are retained until the associated webhook is deleted; there is currently
            no separate automatic expiry for them.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            Octoflow necessarily communicates with the Discord API (to operate as a bot) and receives
            webhook requests from GitHub&apos;s servers. Your use of Discord and GitHub is separately
            governed by{' '}
            <a href="https://discord.com/privacy" className="underline hover:text-fd-foreground" target="_blank" rel="noreferrer noopener">
              Discord&apos;s Privacy Policy
            </a>{' '}
            and{' '}
            <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" className="underline hover:text-fd-foreground" target="_blank" rel="noreferrer noopener">
              GitHub&apos;s Privacy Statement
            </a>
            . We don&apos;t control, and aren&apos;t responsible for, how those platforms handle your data.
          </p>
        </Section>

        <Section title="Your choices">
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>Delete a webhook (and everything tied to it) at any time with <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm font-mono">/delhook</code>.</li>
            <li>Remove a single repository link with <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm font-mono">/delrepo</code>.</li>
            <li>Remove the bot from your server at any time this stops any further data collection for that server.</li>
            <li>Contact us via the support server below to request deletion of any remaining data we hold about your server.</li>
          </ul>
        </Section>

        <Section title="Children's privacy">
          <p>
            Octoflow is a Discord bot and inherits Discord&apos;s own minimum age requirement. We don&apos;t
            knowingly collect data from anyone who doesn&apos;t meet Discord&apos;s eligibility requirements.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy as the bot changes. Material changes will be reflected here with
            an updated date at the top of this page.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy or a data deletion request? Reach out on our{' '}
            <a href="https://discord.gg/Sj2SWMZe2J" className="underline hover:text-fd-foreground" target="_blank" rel="noreferrer noopener">
              support server
            </a>
            .
          </p>
        </Section>

        <p className="text-sm text-fd-muted-foreground">
          See also our <Link href="/terms" className="underline hover:text-fd-foreground">Terms of Service</Link>.
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
