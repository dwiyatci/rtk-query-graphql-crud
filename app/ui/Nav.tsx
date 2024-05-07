'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from '@/app/ui/layout.module.css';

export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link className={`${styles.link} ${pathname === '/' ? styles.active : ''}`} href="/">
        Home
      </Link>
      <Link
        className={`${styles.link} ${pathname === '/verify' ? styles.active : ''}`}
        href="/verify"
      >
        Verify
      </Link>
    </nav>
  );
};
