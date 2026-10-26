'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/#work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/publications', label: 'Publications' },
  { href: '/cv', label: 'CV' },
  { href: '/contact', label: 'Contact' },
];

export function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      {links.map(link => {
        const isWork = link.href === '/#work';
        const isActive = isWork ? pathname === '/' || pathname.startsWith('/projects/') : pathname === link.href;

        return (
          <Link className={isActive ? 'is-active' : undefined} href={link.href} aria-current={isActive ? 'page' : undefined} key={link.href}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
