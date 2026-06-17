import Image from 'next/image';
import { BookOpen, Heart } from 'lucide-react';
import { SiGithub, SiDiscord } from 'react-icons/si';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { MdAutoGraph } from "react-icons/md";
import { BsTwitter } from 'react-icons/bs';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Octoflow" width={24} height={24} />
        <span className="font-semibold text-sm">Octoflow</span>
      </div>
    ),
    transparentMode: 'top',
  },
  links: [
    {
      icon: <BookOpen />,
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
    {
      icon: <MdAutoGraph />,
      text: 'Status',
      url: 'https://status.octoflow.ca',
      active: 'nested-url',
      external: true,
    },
    {
      type: 'icon',
      url: 'https://discord.gg/Sj2SWMZe2J',
      text: 'Discord',
      icon: <SiDiscord />,
      external: true,
    },
    {
      type: 'icon',
      url: 'https://github.com/OctoHubOSS/Octoflow',
      text: 'GitHub',
      icon: <SiGithub />,
      external: true,
    },
    {
      type: 'icon',
      url: 'https://twitter.com/TryOctoflow',
      text: 'Twitter',
      icon: <BsTwitter />,
      external: true,
    },
  ],
};
