'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, isUserAdmin } from '@/lib/auth';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        router.push('/admin/login');
        return;
      }

      try {
        const isAdmin = await isUserAdmin(user.uid);
        if (isAdmin) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Error verifying admin status:', err);
        setAuthorized(false);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
        color: 'var(--text-muted)'
      }}>
        <div className="spinner"></div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>Verifying security permissions...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}

export { AdminGuard };
