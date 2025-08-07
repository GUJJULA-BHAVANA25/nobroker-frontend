// src/components/Layout.tsx
import { useRouter } from 'next/router';
// import Navbar from './Navbar';
import Head from 'next/head';
import ChatIcon from './ChatIcon';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const showChatIcon = router.pathname !== '/logout';
  return (
    <>
      <Head>
        <title>NoBroker - Find Your Perfect Home</title>
        <meta name="description" content="NoBroker - India's Largest No Brokerage Property Site" />
      </Head>
      {/* <Navbar /> */}
      <main>{children}</main>
      {showChatIcon && <ChatIcon />}
    </> 
  );
}