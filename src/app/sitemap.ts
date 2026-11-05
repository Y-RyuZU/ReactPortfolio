import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/labs/easing'].map(path => ({
    url: new URL(path, siteConfig.url).href,
  }));
}
