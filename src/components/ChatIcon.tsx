// components/ChatIcon.tsx (updated)
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/chat-icon.module.css';

export default function ChatIcon() {
  const router = useRouter();
  
  // Don't show on chat page
  if (router.pathname === '/chat') return null;

  return (
    <div className={styles.chatIconContainer}>
      <Link href="/chat" className={styles.chatIcon}>
        💬
      </Link>
    </div>
  );
}