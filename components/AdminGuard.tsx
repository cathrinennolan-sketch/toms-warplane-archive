'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Note: Actual implementation would import Firebase auth and firestore here.
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Stub implementation for authentication
    const checkAuth = async () => {
      // In a real implementation, you would:
      // 1. Get Firebase Auth user via onAuthStateChanged
      // 2. Fetch doc(db, 'admins', user.uid)
      // 3. Verify admin.active === true
      
      // Stub logic:
      const isAuth = false; // default to false for stub
      
      if (!isAuth) {
        // router.push('/admin/login');
        setLoading(false);
        setAuthorized(false); // keep false so we don't render children
      } else {
        setAuthorized(true);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Verifying access...</p>
        <style jsx>{`
          .admin-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            gap: 16px;
            color: var(--text-muted);
          }
        `}</style>
      </div>
    );
  }

  // If not authorized, ideally it redirected, but return null just in case
  if (!authorized) {
    return (
      <div className="empty-state">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
