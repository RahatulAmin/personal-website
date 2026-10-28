'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { id: 'intro', label: 'Intro' },
  { id: 'work', label: 'Work' },
  { id: 'publications', label: 'Publications' },
  { id: 'cv', label: 'CV' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function MainNavigation() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    if (pathname !== '/') return;

    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const marker = window.innerHeight * 0.32;
      const sections = links
        .map(link => document.getElementById(link.id))
        .filter((section): section is HTMLElement => Boolean(section));
      const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= marker) ?? sections[0];
      if (current) setActiveSection(current.id);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <nav aria-label="Main navigation">
      {links.map(link => {
        const isActive = pathname === '/'
          ? activeSection === link.id
          : pathname.startsWith('/projects/') && link.id === 'work';

        return (
          <Link className={isActive ? 'is-active' : undefined} href={`/#${link.id}`} aria-current={isActive ? 'location' : undefined} key={link.id}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
