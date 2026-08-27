export interface CommandInfo {
  name: string;
  description: string;
  /** Omit for commands with no dedicated deep-dive docs page (e.g. /help). */
  href?: string;
}

export interface CommandGroup {
  category: string;
  description: string;
  commands: CommandInfo[];
}

// Mirrors content/docs/commands/index.mdx's organization - kept as a plain
// data file (not parsed from the MDX) since this also needs to power a
// client-side search/filter UI, same tradeoff the rest of the site makes
// (stats/status pages are hand-rolled data too, not derived from a single
// generated source).
export const commandGroups: CommandGroup[] = [
  {
    category: 'Core',
    description: 'Manage webhooks and repositories.',
    commands: [
      { name: '/list', description: 'List all webhooks in the server.', href: '/docs/commands/core/list' },
      { name: '/newhook', description: 'Create a new webhook.', href: '/docs/commands/core/newhook' },
      {
        name: '/edithook',
        description: "Edit a webhook's comment, broken flag, secret, or burst-batching toggle.",
        href: '/docs/commands/core/edithook',
      },
      { name: '/newrepo', description: 'Link a repository to a webhook.', href: '/docs/commands/core/newrepo' },
      {
        name: '/editrepo',
        description: "Rename a linked repository, change its channel, or toggle thread-per-PR/issue mode.",
        href: '/docs/commands/core/editrepo',
      },
      { name: '/delhook', description: 'Delete a webhook.', href: '/docs/commands/core/delhook' },
      { name: '/delrepo', description: 'Delete a repository.', href: '/docs/commands/core/delrepo' },
      {
        name: '/setrepochannel',
        description: "Change a repository's notification channel.",
        href: '/docs/commands/core/setrepochannel',
      },
      {
        name: '/resetsecret',
        description: "Reset a webhook's signing secret.",
        href: '/docs/commands/core/resetsecret',
      },
    ],
  },
  {
    category: 'Event Modifiers',
    description: 'Filter, redirect, or suppress specific GitHub event types.',
    commands: [
      {
        name: '/eventmod create',
        description: 'Create an event modifier on a webhook.',
        href: '/docs/commands/modifiers/create',
      },
      {
        name: '/eventmod edit',
        description: "Change an existing event modifier's settings.",
        href: '/docs/commands/modifiers/edit',
      },
      {
        name: '/eventmod list',
        description: 'List event modifiers in the server.',
        href: '/docs/commands/modifiers/list',
      },
      {
        name: '/eventmod delete',
        description: 'Delete an event modifier by ID.',
        href: '/docs/commands/modifiers/delete',
      },
    ],
  },
  {
    category: 'Backups',
    description: 'Export and restore your configuration.',
    commands: [
      {
        name: '/backup',
        description: 'Export a webhook configuration to a JSON file.',
        href: '/docs/commands/backups/backup',
      },
      {
        name: '/restore',
        description: 'Restore a webhook configuration from a backup file.',
        href: '/docs/commands/backups/restore',
      },
    ],
  },
  {
    category: 'Help',
    description: 'Find your way around the bot.',
    commands: [
      { name: '/help', description: 'Browse every command as an interactive, paginated list with quick links.' },
      { name: '/simplehelp', description: 'A plain, non-paginated command list - useful in restricted channels.' },
    ],
  },
];

export const allCommands: CommandInfo[] = commandGroups.flatMap((g) => g.commands);
