import type { IconType } from 'react-icons';
import type { SkillName } from '@/lib/types/skill';

// Backend icons
import { DiJava } from 'react-icons/di';
import {
  SiKotlin,
  SiTypescript,
  SiPython,
  SiSpring,
} from 'react-icons/si';

// Frontend icons
import {
  SiReact,
  SiVuedotjs,
  SiNextdotjs,
  SiTailwindcss,
} from 'react-icons/si';

// Infrastructure icons
import {
  SiKubernetes,
  SiDocker,
  SiGooglecloud,
  SiGithubactions,
} from 'react-icons/si';
import {
  FaAws,
  FaServer,
} from 'react-icons/fa';

// Database icons
import {
  SiMysql,
  SiPostgresql,
  SiRedis,
} from 'react-icons/si';

// ML/DS icons
import {
  FaBrain,
  FaChartBar,
} from 'react-icons/fa';

// Other Technology icons
import {
  SiTauri,
  SiNuxtdotjs,
} from 'react-icons/si';
import {
  FaMicrochip,
} from 'react-icons/fa';
import { TbBrandCSharp } from 'react-icons/tb';

// 型安全なアイコンマッピング
export const SKILL_ICONS: Record<SkillName, IconType> = {
  // Backend
  'Java': DiJava,
  'Kotlin': SiKotlin,
  'TypeScript': SiTypescript,
  'Python': SiPython,
  'Spring Boot': SiSpring,
  'Ktor': SiKotlin, // Ktorは専用アイコンがないためKotlinを使用
  'C#': TbBrandCSharp,

  // Frontend
  'React': SiReact,
  'Vue.js': SiVuedotjs,
  'Next.js': SiNextdotjs,
  'Nuxt.js': SiNuxtdotjs,
  'TailwindCSS': SiTailwindcss,
  'Tauri': SiTauri,

  // Infrastructure
  'Proxmox': FaServer, // Proxmoxは専用アイコンがないためサーバーアイコン
  'Kubernetes': SiKubernetes,
  'Docker': SiDocker,
  'AWS': FaAws,
  'GCP': SiGooglecloud,
  'GitHub Actions': SiGithubactions,

  // Database
  'MySQL/MariaDB': SiMysql,
  'PostgreSQL': SiPostgresql,
  'Redis': SiRedis,

  // ML/DS
  'LLM Integration': FaBrain,
  'Data Analysis': FaChartBar,

  // Other Technologies
  'Hardware': FaMicrochip,
} as const;

// Special badges for skills
export const SKILL_BADGES: Partial<Record<SkillName, string>> = {
  'Ktor': 'Ktor',
  'Proxmox': 'PVE',
} as const;