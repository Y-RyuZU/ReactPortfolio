# React Portfolio Project Overview

## Project Purpose
A personal portfolio website for RyuZU (Atsuki Katayama), a university student and engineer with 10 years of programming experience. The portfolio showcases skills, projects, and professional journey from starting with Minecraft in elementary school to becoming a full-stack engineer.

## Tech Stack
- **Framework**: Next.js 15.1.3 with App Router
- **Language**: TypeScript 5
- **Styling**: 
  - Tailwind CSS 3.4.1
  - Radix UI components
  - Framer Motion for animations
  - CSS-in-JS with Kuma UI
- **UI Library**: Custom components using Radix UI primitives
- **Icons**: Lucide React, React Icons, Iconify
- **Forms**: React Hook Form with Zod validation
- **Themes**: next-themes for dark mode support
- **Backend Integration**: Directus SDK for CMS

## Project Structure
```
src/
├── app/          # Next.js app router pages
│   ├── about/    # About page
│   ├── works/    # Portfolio works
│   ├── blog/     # Blog section
│   ├── contact/  # Contact page
│   └── debug/    # Debug utilities
├── components/   # React components
│   ├── sections/ # Page sections (hero, etc.)
│   ├── skills/   # Skills components
│   ├── ui/       # UI primitives
│   └── shared/   # Shared components
├── config/       # Configuration files
├── lib/          # Utility functions and constants
└── assets/       # Static assets
```

## Key Features
- Responsive design with mobile-first approach
- Dark mode support
- Minecraft-inspired visual elements (pixel art, grid patterns)
- Skill showcase with categorized tech stack
- Project portfolio grid
- Blog integration
- Contact form