export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  author: {
    name: string;
    penName: string;
    email?: string;
  };
  links: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  discord?: string;
  email?: string;
}

// Contact link types for unified contact section
export type ContactType = 'github' | 'twitter' | 'linkedin' | 'discord' | 'email';

export interface ContactLink {
  id: string;
  type: ContactType;
  label: string;
  href: string;
  icon?: string; // Optional Minecraft icon path
  external?: boolean; // Whether it's an external link
  available?: boolean; // Whether the contact method is currently available
}

export type ContactLinks = readonly ContactLink[];

export interface NavigationItem {
  text: string;
  href: string;
  icon?: string;
}