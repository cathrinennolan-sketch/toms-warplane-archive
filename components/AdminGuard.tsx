'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, verifyAdminStatus, signOutUser, auth, AdminVerificationResult, User } from '@/lib/auth';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [verification, setVerification] = useState<AdminVerificationResult | null>(null);
  const router = useRouter();

  const checkUser = useCallback(async (user: User | null) => {
    if (!user) {
      setCurrentUser(null);
      setVerification(null);
      setLoading(false);
      router.push('/admin/login');
      return;
    }

    setCurrentUser(user);
    setLoading(true);
    const result = await verifyAdminStatus(user.uid);
    setVerification(result);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkUser(user);
    });

    return () => unsubscribe();
  }, [checkUser]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/admin/login');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  const handleRetry = () => {
    if (currentUser) {
      setLoading(true);
      checkUser(currentUser);
    } else {
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        gap: '16px',
        color: 'var(--text-muted)'
      }}>
        <div className="spinner"></div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>Verifying administrator credentials...</p>
      </div>
    );
  }

  // Not logged in (router is redirecting to login)
  if (!currentUser) {
    return null;
  }

  // Logged in, but NOT verified as active admin in Firestore
  if (!verification?.isAdmin) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '24px',
        backgroundColor: 'var(--bg)'
      }}>
        <div className="card" style={{
          maxWidth: '580px',
          width: '100%',
          padding: '36px 32px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #C4CBD6',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFF4E5',
            color: '#B76E00',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <span>⚠️</span>
            <span>ADMIN ACCESS SETUP REQUIRED</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.6rem',
            color: '#121417',
            marginBottom: '12px'
          }}>
            Administrator Record Not Found
          </h2>

          <p style={{ fontSize: '0.92rem', color: '#4F5866', lineHeight: 1.6, marginBottom: '24px' }}>
            You are successfully signed in as <strong>{currentUser.email}</strong>, but your account does not have an active administrator record in the database yet.
          </p>

          <div style={{
            backgroundColor: '#F4F6F9',
            border: '1px solid #D2D7E0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '0.85rem'
          }}>
            <p style={{ fontWeight: 700, color: '#121417', marginBottom: '8px' }}>Your Firebase User UID:</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD1DC',
              borderRadius: '4px',
              padding: '8px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#121417',
              wordBreak: 'break-all'
            }}>
              {currentUser.uid}
            </div>
            
            <div style={{ marginTop: '14px', color: '#4F5866', lineHeight: 1.5 }}>
              {verification?.code === 'permission_denied' ? (
                <p style={{ color: '#C0392B' }}>
                  <strong>Firestore Security Rules Blocked:</strong> Your database security rules are currently denying access. In Firebase Console → Firestore Database → Rules tab, make sure rules are published.
                </p>
              ) : verification?.code === 'not_found' ? (
                <p>
                  <strong>Next step:</strong> In Firebase Console → Firestore Database, make sure the document in the <code>admins</code> collection has its <strong>Document ID</strong> set exactly to the UID above.
                </p>
              ) : verification?.code === 'inactive' ? (
                <p style={{ color: '#D97706' }}>
                  <strong>Account Inactive:</strong> Your record was found in <code>admins</code>, but the <code>active</code> field is set to <code>false</code>. Change it to <code>true</code>.
                </p>
              ) : (
                <p>{verification?.error || 'Unknown authorization check error.'}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleRetry}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: '140px', padding: '12px', backgroundColor: '#121417', color: '#FFFFFF' }}
            >
              🔄 Check Again
            </button>
            <button
              onClick={handleSignOut}
              className="btn btn-secondary"
              style={{ flex: 1, minWidth: '140px', padding: '12px' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized admin
  return <>{children}</>;
}

export { AdminGuard };
