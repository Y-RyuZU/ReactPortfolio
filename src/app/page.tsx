import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import ScrollNav from '@/components/features/navigation/ScrollNav';

export default function HomePage() {
  return (
    <>
      <ScrollNav />
      <div className="py-8 md:py-12 lg:py-16 space-y-8 md:space-y-12 lg:space-y-16">
        <div data-build-section><AboutSection /></div>
        <div data-build-section><SkillsSection /></div>
        <div data-build-section><ProjectsSection /></div>
        <div data-build-section><ContactSection /></div>
      </div>
    </>
  );
}
