import type { SocialLinks, ContactLinks } from '@/lib/types/common';

export const SOCIAL_LINKS: SocialLinks = {
  github: 'Y-RyuZU',
  twitter: 'MC_Y_RyuZU',
  linkedin: 'atsukikatayama',
  discord: 'DM via Twitter/GitHub',
  email: undefined, // Prefer social media contact
};

export const GITHUB_URL = `https://github.com/${SOCIAL_LINKS.github}`;
export const TWITTER_URL = `https://twitter.com/${SOCIAL_LINKS.twitter}`;
export const LINKEDIN_URL = SOCIAL_LINKS.linkedin ? `https://linkedin.com/in/${SOCIAL_LINKS.linkedin}` : null;
// Unified contact links array for ContactSection
export const CONTACT_LINKS: ContactLinks = [
  {
    id: 'github',
    type: 'github',
    label: 'GitHub',
    href: GITHUB_URL,
    external: true,
    available: true,
  },
  {
    id: 'twitter',
    type: 'twitter',
    label: 'X (Twitter)',
    href: TWITTER_URL,
    external: true,
    available: true,
  },
  {
    id: 'linkedin',
    type: 'linkedin',
    label: 'LinkedIn',
    href: LINKEDIN_URL!,
    external: true,
    available: true,
  },
  {
    id: 'discord',
    type: 'discord',
    label: 'Discord',
    href: '#',
    external: false,
    available: true,
  },
] as const satisfies ContactLinks;
