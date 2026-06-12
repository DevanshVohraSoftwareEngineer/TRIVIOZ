'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import { demoUsers } from '@/lib/data';

export default function LoginPage() {
  const [email, setEmail] = useState(demoUsers.admin.email);
  const [password, setPassword] = useState(demoUsers.admin.password);
  const [error, setError] = useState('');
  const { login } = useStore();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === demoUsers.admin.email && password.trim() === demoUsers.admin.password) {
      login(email, 'admin');
      router.push('/admin');
    } else {
      setError('Invalid credentials. Use admin@trivioz.com / password123');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full" style={{ minHeight: '100vh' }}>
      <div className="flex flex-col gap-8 w-full" style={{ maxWidth: '400px', padding: '2rem' }}>
        <h1 className="text-2xl font-bold uppercase text-center">Admin Login</h1>
        
        {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.75rem', border: '1px solid var(--gray-300)' }}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.75rem', border: '1px solid var(--gray-300)' }}
            required
          />
          <button type="submit" className="btn w-full">Sign In</button>
        </form>
        
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          <p>Demo Admin: admin@trivioz.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}
