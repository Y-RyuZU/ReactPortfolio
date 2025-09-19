import type { SiteConfig } from '@/lib/types/common';
import { SOCIAL_LINKS } from '@/lib/constants/contacts';

export const siteConfig: SiteConfig = {
  name: 'RyuZU Portfolio',
  description: 'Full-stack Software Engineer',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ryuzu.dev',
  author: {
    name: 'Atsuki Katayama',
    penName: 'RyuZU',
  },
  links: SOCIAL_LINKS,
};