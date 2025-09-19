import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { GITHUB_URL, TWITTER_URL, LINKEDIN_URL } from '@/lib/constants/contacts';
import { siteConfig } from '@/config/site';
import { styles } from '@/lib/styles';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="w-full mt-auto border-t border-gray-200/20 dark:border-gray-800/20">
      <div className={`${styles.container} py-12`}>
        <div className="flex flex-col items-center gap-6">
          {/* Social Links */}
          <div className="flex gap-6">
            {GITHUB_URL && (
              <Link
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </Link>
            )}
            {TWITTER_URL && (
              <Link
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </Link>
            )}
            {LINKEDIN_URL && (
              <Link
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-800 dark:text-gray-400">
              &copy; {currentYear} {siteConfig.author.penName}
            </p>
            <p className="mt-1 text-xs text-gray-700 dark:text-gray-500">
              Built with Next.js & TypeScript
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}