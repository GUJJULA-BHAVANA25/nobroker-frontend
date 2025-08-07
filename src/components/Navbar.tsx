// src/components/Navbar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/navbar.module.css';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include' // if using cookies
      });
      
      // Clear client-side storage
      localStorage.clear();
      
      // Redirect
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        {/* <Link href="/home" className={styles.logo}>
          <img src="/nobroker-logo.png" alt="NoBroker Logo" />
        </Link> */}

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <Link href="/home" className={router.pathname === '/home' ? styles.activeLink : ''}>
            Home
          </Link>
          {/* <Link href="/search" className={router.pathname === '/search' ? styles.activeLink : ''}>
            Search Properties
          </Link> */}
          <Link href="/add-property" className={router.pathname === '/add-property' ? styles.activeLink : ''}>
            Add Property
          </Link>
          <Link href="/chat" className={router.pathname === '/chat' ? styles.activeLink : ''}>
            Chat
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link href="/home" className={router.pathname === '/home' ? styles.activeLink : ''}>
              Home
            </Link>
            <Link href="/search" className={router.pathname === '/search' ? styles.activeLink : ''}>
              Search Properties
            </Link>
            <Link href="/add-property" className={router.pathname === '/add-property' ? styles.activeLink : ''}>
              Add Property
            </Link>
            <Link href="/chat" className={router.pathname === '/chat' ? styles.activeLink : ''}>
              Chat
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}