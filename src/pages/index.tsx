// src/pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      localStorage.setItem('userId', res.data.user.id);
      router.push('/home');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) return <RegisterForm goBack={() => setShowRegister(false)} />;

  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Login | NoBroker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img 
            src="/nobroker-logo.png" 
            alt="NoBroker Logo" 
            className={styles.logo}
          />
          <h2 className={styles.tagline}>Find Your Perfect Home</h2>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />
        </div>
        
        <button 
          onClick={handleLogin} 
          disabled={loading}
          className={`${styles.loginButton} ${loading ? styles.loadingButton : ''}`}
        >
          {loading ? (
            <div className={styles.spinner}></div>
          ) : 'Login'}
        </button>
        
        <div className={styles.divider}>OR</div>
        
        {/* <button className={styles.otpButton}>
          Login with OTP
        </button> */}
        
        <p className={styles.registerText}>
          New to NoBroker?{' '}
          <span onClick={() => setShowRegister(true)} className={styles.registerLink}>
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}

function RegisterForm({ goBack }: { goBack: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        name,
        phone,
      });

      localStorage.setItem('userId', res.data.user.id);
      router.push('/home');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img 
            src="/nobroker-logo.png" 
            alt="NoBroker Logo" 
            className={styles.logo}
          />
          <h2 className={styles.tagline}>Join NoBroker</h2>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Full Name</label>
          <input
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Phone Number</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.inputField}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />
        </div>
        
        <button 
          onClick={handleRegister} 
          disabled={loading}
          className={`${styles.loginButton} ${loading ? styles.loadingButton : ''}`}
        >
          {loading ? (
            <div className={styles.spinner}></div>
          ) : 'Register'}
        </button>
        
        <p className={styles.registerText}>
          Already have an account?{' '}
          <span onClick={goBack} className={styles.registerLink}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}