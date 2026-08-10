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

export async function getCurrentAdmin(uid: string): Promise<Admin | null> {
  try {
    const docRef = doc(db, 'admins', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Admin;
    }
    return null;
  } catch (error) {
    console.error('Error fetching admin:', error);
    return null;
  }
}

export async function isUserAdmin(uid: string): Promise<boolean> {
  const admin = await getCurrentAdmin(uid);
  return !!admin?.active;
}

export async function isUserSuperAdmin(uid: string): Promise<boolean> {
  const admin = await getCurrentAdmin(uid);
  return !!admin?.active && admin?.role === 'super_admin';
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
