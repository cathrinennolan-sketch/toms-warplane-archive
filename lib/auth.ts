import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs, updateDoc } from 'firebase/firestore';
import { Admin } from '@/lib/types';

export interface AdminVerificationResult {
  isAdmin: boolean;
  admin: Admin | null;
  error?: string;
  code?: 'authorized' | 'not_found' | 'inactive' | 'permission_denied' | 'unknown_error';
}

export async function signIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function verifyAdminStatus(uid: string): Promise<AdminVerificationResult> {
  try {
    const docRef = doc(db, 'admins', uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return {
        isAdmin: false,
        admin: null,
        code: 'not_found',
        error: `No document found in 'admins' collection with Document ID: ${uid}`
      };
    }
    const data = docSnap.data() as Admin;
    if (!data.active) {
      return {
        isAdmin: false,
        admin: data,
        code: 'inactive',
        error: `Administrator record exists, but 'active' field is set to false.`
      };
    }
    return { isAdmin: true, admin: data, code: 'authorized' };
  } catch (error: any) {
    console.error('Error verifying admin in Firestore:', error);
    const isPermission = error?.code === 'permission-denied' || (error?.message && error.message.includes('permission'));
    return {
      isAdmin: false,
      admin: null,
      code: isPermission ? 'permission_denied' : 'unknown_error',
      error: error?.message || 'Error communicating with Firestore'
    };
  }
}

export async function getCurrentAdmin(uid: string): Promise<Admin | null> {
  const res = await verifyAdminStatus(uid);
  return res.admin;
}

export async function isUserAdmin(uid: string): Promise<boolean> {
  const res = await verifyAdminStatus(uid);
  return res.isAdmin;
}

export async function isUserSuperAdmin(uid: string): Promise<boolean> {
  const res = await verifyAdminStatus(uid);
  return !!res.admin?.active && res.admin?.role === 'super_admin';
}

export async function createAdminRecord(
  uid: string, 
  email: string, 
  displayName: string, 
  role: 'super_admin' | 'admin', 
  invitedBy: string
): Promise<void> {
  const adminRef = doc(db, 'admins', uid);
  const adminData: Admin = {
    uid,
    email,
    displayName,
    role,
    invitedBy,
    invitedAt: serverTimestamp(),
    active: true,
  };
  await setDoc(adminRef, adminData);
}

export async function getAllAdmins(): Promise<Admin[]> {
  try {
    const adminsCol = collection(db, 'admins');
    const adminSnapshot = await getDocs(adminsCol);
    return adminSnapshot.docs.map(doc => doc.data() as Admin);
  } catch (error) {
    console.error('Error fetching all admins:', error);
    return [];
  }
}

export async function deactivateAdmin(uid: string): Promise<void> {
  const adminRef = doc(db, 'admins', uid);
  await updateDoc(adminRef, { active: false });
}

export async function reactivateAdmin(uid: string): Promise<void> {
  const adminRef = doc(db, 'admins', uid);
  await updateDoc(adminRef, { active: true });
}

export { onAuthStateChanged, auth };
export type { User };
