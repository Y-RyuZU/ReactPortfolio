'use client';

import { FEATURED_SKILLS } from '@/lib/constants/skills';
import { styles } from '@/lib/styles';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SkillCard } from '@/components/features/skills/SkillCard';

export default function SkillIcons() {
  return (
    <section id="skills" className={styles.section.base}>
      <div className={styles.container}>
        <div className="text-center mb-12">
          <h2 className={styles.heading.h2}>Technical Skills</h2>
          <p className={styles.text.secondary}>
            <span className="inline-flex items-center gap-2">
              <Image
                src="/images/minecraft/item/spyglass.png"
                alt="Skills"
                width={20}
                height={20}
                className="mc-pixel"
              />
              My Inventory
            </span>
          </p>
        </div>

        {/* Skill cards with real tech icons + Minecraft frames */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {FEATURED_SKILLS.map((skill) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              showDetails={false}
              size="md"
            />
          ))}
        </div>

        {/* View all skills button */}
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/about#skills">
              <Image
                src="/images/minecraft/item/book.png"
                alt="View All"
                width={20}
                height={20}
                className="mc-pixel"
              />
              View All Skills
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}