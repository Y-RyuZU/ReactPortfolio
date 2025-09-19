# ポートフォリオ実装計画書

## 🏗️ アーキテクチャ設計

### 技術スタック
- **Framework**: Next.js 15.1.3 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS + shadcn/ui
- **Type Safety**: TypeScript + Zod
- **Animation**: Framer Motion (Phase 2)
- **Icons**: React Icons + Iconify
- **Form**: React Hook Form + Zod
- **CMS**: Directus (Phase 3)

## 📁 ディレクトリ構造

```
src/
├── app/                      # App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   ├── about/
│   │   └── page.tsx         # Aboutページ
│   ├── projects/
│   │   ├── page.tsx         # プロジェクト一覧
│   │   └── [slug]/
│   │       └── page.tsx     # プロジェクト詳細
│   └── api/                 # API Routes
│       └── contact/
│
├── components/
│   ├── layout/              # レイアウト系
│   │   ├── header/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   └── footer/
│   │       ├── Footer.tsx
│   │       └── SocialLinks.tsx
│   │
│   ├── sections/            # ページセクション
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TypewriterText.tsx
│   │   │   └── SkillIcons.tsx
│   │   ├── skills/
│   │   │   ├── SkillsGrid.tsx
│   │   │   ├── SkillCard.tsx
│   │   │   └── ConfidenceBar.tsx
│   │   ├── projects/
│   │   │   ├── ProjectsGrid.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── TechBadge.tsx
│   │   └── about/
│   │       ├── Timeline.tsx
│   │       └── VisionCard.tsx
│   │
│   ├── ui/                  # shadcn/ui components
│   │   └── (既存のshadcn components)
│   │
│   └── common/              # 共通コンポーネント
│       ├── SectionTitle.tsx
│       ├── Container.tsx
│       └── LoadingSpinner.tsx
│
├── lib/
│   ├── constants/          # 定数
│   │   ├── skills.ts
│   │   ├── projects.ts
│   │   ├── navigation.ts
│   │   └── contacts.ts
│   │
│   ├── types/              # 型定義
│   │   ├── project.ts
│   │   ├── skill.ts
│   │   └── common.ts
│   │
│   ├── hooks/              # カスタムフック
│   │   ├── useScrollspy.ts
│   │   ├── useMediaQuery.ts
│   │   └── useTheme.ts
│   │
│   ├── validations/        # Zodスキーマ
│   │   └── contact.ts
│   │
│   └── utils/              # ユーティリティ
│       ├── cn.ts           # clsx helper
│       └── metadata.ts
│
├── config/                  # 設定
│   ├── site.ts            # サイト設定
│   └── env.ts             # 環境変数
│
└── styles/
    └── globals.css         # グローバルCSS
```

## 📄 ページ設計とコンポーネント構成

### 1. **ホームページ** (`/`)

#### セクション構成
1. **Hero Section**
   - コンポーネント: `<HeroSection />`
   - 内容: 名前、キャッチコピー、アニメーション
   - shadcn: なし（カスタム実装）

2. **Skills Overview**
   - コンポーネント: `<SkillIcons />`
   - 内容: 技術スタックのアイコン表示
   - shadcn: `Tooltip`, `Badge`

3. **Featured Projects**
   - コンポーネント: `<ProjectsGrid featured />`
   - 内容: 主要3プロジェクトのカード
   - shadcn: `Card`, `Badge`, `Button`

4. **Call to Action**
   - コンポーネント: `<CTASection />`
   - 内容: 詳細ページへの誘導
   - shadcn: `Button`

```typescript
// app/page.tsx の構成
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SkillsOverview />
      <FeaturedProjects />
      <CTASection />
    </>
  );
}
```

### 2. **Aboutページ** (`/about`)

#### セクション構成
1. **Profile Section**
   - コンポーネント: `<ProfileCard />`
   - 内容: 写真、所属、簡単な紹介
   - shadcn: `Card`, `Avatar`

2. **Timeline**
   - コンポーネント: `<Timeline />`
   - 内容: 経歴のビジュアル表示
   - shadcn: カスタム実装

3. **Vision Section**
   - コンポーネント: `<VisionCard />`
   - 内容: 将来のビジョン
   - shadcn: `Card`

### 3. **Projectsページ** (`/projects`)

#### セクション構成
1. **Filter Bar**
   - コンポーネント: `<ProjectFilter />`
   - 内容: 技術スタックでフィルタ
   - shadcn: `Select`, `Badge`

2. **Projects Grid**
   - コンポーネント: `<ProjectsGrid />`
   - 内容: 全プロジェクトのグリッド表示
   - shadcn: `Card`, `Badge`

### 4. **Project詳細ページ** (`/projects/[slug]`)

#### セクション構成
1. **Hero Banner**
   - コンポーネント: `<ProjectHero />`
   - 内容: プロジェクト画像、タイトル
   - shadcn: なし

2. **Details Section**
   - コンポーネント: `<ProjectDetails />`
   - 内容: 詳細説明、技術スタック
   - shadcn: `Tabs`, `Badge`

3. **Links Section**
   - コンポーネント: `<ProjectLinks />`
   - 内容: GitHub、デモへのリンク
   - shadcn: `Button`

## 🎨 コンポーネント詳細設計

### 共通レイアウトコンポーネント

#### Header
```typescript
// components/layout/header/Header.tsx
- ナビゲーション（デスクトップ/モバイル）
- ロゴ/名前
- テーマ切り替え（Phase 3）
使用shadcn: NavigationMenu, Sheet (mobile), Button
```

#### Footer
```typescript
// components/layout/footer/Footer.tsx
- ソーシャルリンク
- コピーライト
使用shadcn: なし（アイコンのみ）
```

### セクションコンポーネント

#### HeroSection
```typescript
// components/sections/hero/HeroSection.tsx
interface HeroSectionProps {
  name: string;
  tagline: string;
  yearsOfExperience: number;
}

使用shadcn: なし（Framer Motion使用予定）
子コンポーネント:
- TypewriterText (タイピングアニメーション)
- SkillIcons (技術スタックアイコン)
```

#### ProjectCard
```typescript
// components/sections/projects/ProjectCard.tsx
interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

使用shadcn:
- Card (ベース)
- Badge (技術タグ)
- AspectRatio (画像)
```

#### SkillCard
```typescript
// components/sections/skills/SkillCard.tsx
interface SkillCardProps {
  category: SkillCategory;
  skills: Skill[];
  confidence: number;
}

使用shadcn:
- Card
- Progress (自信度表示)
- Tooltip (詳細表示)
```

## 🔧 型定義

### Project型
```typescript
// lib/types/project.ts
export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  thumbnail: string;
  images?: string[];
  techStack: TechStack[];
  category: ProjectCategory;
  metrics?: ProjectMetrics;
  links?: ProjectLinks;
  featured: boolean;
  order: number;
  year: number;
}

export interface TechStack {
  name: string;
  icon: string;
  category: 'language' | 'framework' | 'database' | 'tool';
}

export interface ProjectMetrics {
  users?: number;
  performance?: string;
  scale?: string;
}
```

### Skill型
```typescript
// lib/types/skill.ts
export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  confidence: 1 | 2 | 3 | 4 | 5;
  skills: Skill[];
  order: number;
}

export interface Skill {
  name: string;
  icon?: string;
  yearsOfExperience?: number;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}
```

## 📦 必要なパッケージ

### 追加インストール
```bash
# 型安全性
npm install zod react-hook-form @hookform/resolvers

# アイコン
npm install react-icons @iconify/react

# ユーティリティ
npm install date-fns

# 開発ツール
npm install -D @types/node
```

### shadcn/ui コンポーネント
```bash
# 必要なコンポーネントをインストール
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add button
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add aspect-ratio
npx shadcn-ui@latest add separator
```

## 🚀 実装フェーズ

### Phase 1: MVP (1週間)
1. [ ] 型定義・定数の作成
2. [ ] レイアウトコンポーネント (Header/Footer)
3. [ ] ホームページ実装
   - [ ] HeroSection
   - [ ] SkillIcons (簡易版)
   - [ ] ProjectCards (3枚)
4. [ ] レスポンシブ対応

### Phase 2: 機能拡充 (2-3週間)
1. [ ] Aboutページ実装
2. [ ] Projectsページ実装
3. [ ] プロジェクト詳細ページ
4. [ ] スキルセクション強化
5. [ ] アニメーション追加 (Framer Motion)

### Phase 3: 差別化 (1ヶ月後)
1. [ ] ダークモード
2. [ ] 国際化 (i18n)
3. [ ] ブログ機能 (Directus連携)
4. [ ] アナリティクス

## 📝 コーディング規約

### ファイル命名
- コンポーネント: PascalCase (例: `ProjectCard.tsx`)
- ユーティリティ: camelCase (例: `formatDate.ts`)
- 定数: UPPER_SNAKE_CASE (例: `SKILL_CATEGORIES`)

### インポート順序
1. React/Next.js
2. 外部ライブラリ
3. 内部コンポーネント
4. ユーティリティ/型
5. スタイル

### コンポーネント構造
```typescript
// 1. インポート
import { FC } from 'react';

// 2. 型定義
interface Props {}

// 3. コンポーネント
export const Component: FC<Props> = (props) => {
  // 4. hooks
  // 5. ハンドラー
  // 6. レンダリング
  return <div></div>;
};
```

---

*最終更新: 2025-01-18*