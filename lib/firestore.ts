import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { Photo, Person, ArchiveDocument } from '@/lib/types';

export interface PhotoFilters {
  unit?: string;
  planeType?: string;
  planeSerial?: string;
  tags?: string[];
  search?: string;
}

export interface PersonFilters {
  rank?: string;
  unit?: string;
  branch?: string;
  tags?: string[];
  search?: string;
}

export interface DocumentFilters {
  category?: 'Manual' | 'Orders' | 'Certificate' | 'Map' | 'Letter' | 'Other';
  tags?: string[];
  search?: string;
}

// Photos

export async function getPhotos(filters?: PhotoFilters, limitCount = 20, lastDoc?: any): Promise<{ photos: Photo[], lastDoc: any }> {
  let q = query(collection(db, 'photos'));
  const constraints: QueryConstraint[] = [];
  
  if (filters?.unit) constraints.push(where('unit', '==', filters.unit));
  if (filters?.planeType) constraints.push(where('planeType', '==', filters.planeType));
  if (filters?.planeSerial) constraints.push(where('planeSerial', '==', filters.planeSerial));
  if (filters?.tags && filters.tags.length > 0) constraints.push(where('tags', 'array-contains-any', filters.tags));
  
  constraints.push(orderBy('uploadedAt', 'desc'));
  constraints.push(limit(limitCount));
  
  if (lastDoc) constraints.push(startAfter(lastDoc));
  
  q = query(q, ...constraints);
  
  const querySnapshot = await getDocs(q);
  const photos = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Photo));
  const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  
  return { photos, lastDoc: newLastDoc };
}

export async function getPhoto(id: string): Promise<Photo | null> {
  const dSnap = await getDoc(doc(db, 'photos', id));
  return dSnap.exists() ? { id: dSnap.id, ...dSnap.data() } as Photo : null;
}

export async function createPhoto(data: Omit<Photo, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'photos'), {
    ...data,
    uploadedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePhoto(id: string, data: Partial<Photo>): Promise<void> {
  await updateDoc(doc(db, 'photos', id), data as DocumentData);
}

export async function deletePhoto(id: string): Promise<void> {
  await deleteDoc(doc(db, 'photos', id));
}

export async function incrementDownloadCount(id: string): Promise<void> {
  await updateDoc(doc(db, 'photos', id), {
    downloadCount: increment(1)
  });
}

export async function getPhotosByUnit(unit: string): Promise<Photo[]> {
  const q = query(collection(db, 'photos'), where('unit', '==', unit), orderBy('uploadedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Photo));
}

export async function getPhotosBySerial(serial: string): Promise<Photo[]> {
  const q = query(collection(db, 'photos'), where('planeSerial', '==', serial), orderBy('uploadedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Photo));
}

export async function getAllUnits(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, 'photos'));
  const units = new Set<string>();
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.unit) units.add(data.unit);
  });
  return Array.from(units).sort();
}

export async function getAllSerials(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, 'photos'));
  const serials = new Set<string>();
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.planeSerial) serials.add(data.planeSerial);
  });
  return Array.from(serials).sort();
}

export async function getAllPlaneTypes(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, 'photos'));
  const types = new Set<string>();
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.planeType) types.add(data.planeType);
  });
  return Array.from(types).sort();
}

// Persons

export async function getPersons(filters?: PersonFilters, limitCount = 20, lastDoc?: any): Promise<{ persons: Person[], lastDoc: any }> {
  let q = query(collection(db, 'persons'));
  const constraints: QueryConstraint[] = [];
  
  if (filters?.rank) constraints.push(where('rank', '==', filters.rank));
  if (filters?.unit) constraints.push(where('unit', '==', filters.unit));
  if (filters?.branch) constraints.push(where('branch', '==', filters.branch));
  if (filters?.tags && filters.tags.length > 0) constraints.push(where('tags', 'array-contains-any', filters.tags));
  
  constraints.push(orderBy('uploadedAt', 'desc'));
  constraints.push(limit(limitCount));
  
  if (lastDoc) constraints.push(startAfter(lastDoc));
  
  q = query(q, ...constraints);
  
  const querySnapshot = await getDocs(q);
  const persons = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Person));
  const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  
  return { persons, lastDoc: newLastDoc };
}

export async function getPerson(id: string): Promise<Person | null> {
  const dSnap = await getDoc(doc(db, 'persons', id));
  return dSnap.exists() ? { id: dSnap.id, ...dSnap.data() } as Person : null;
}

export async function createPerson(data: Omit<Person, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'persons'), {
    ...data,
    uploadedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePerson(id: string, data: Partial<Person>): Promise<void> {
  await updateDoc(doc(db, 'persons', id), data as DocumentData);
}

export async function deletePerson(id: string): Promise<void> {
  await deleteDoc(doc(db, 'persons', id));
}

export async function getPersonsByIds(ids: string[]): Promise<Person[]> {
  if (!ids || ids.length === 0) return [];
  const chunkedIds = ids.slice(0, 10); // Firestore 'in' max limit is 10
  const q = query(collection(db, 'persons'), where('__name__', 'in', chunkedIds));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Person));
}

// ArchiveDocuments

export async function getDocuments(filters?: DocumentFilters, limitCount = 20, lastDoc?: any): Promise<{ documents: ArchiveDocument[], lastDoc: any }> {
  let q = query(collection(db, 'documents'));
  const constraints: QueryConstraint[] = [];
  
  if (filters?.category) constraints.push(where('category', '==', filters.category));
  if (filters?.tags && filters.tags.length > 0) constraints.push(where('tags', 'array-contains-any', filters.tags));
  
  constraints.push(orderBy('uploadedAt', 'desc'));
  constraints.push(limit(limitCount));
  
  if (lastDoc) constraints.push(startAfter(lastDoc));
  
  q = query(q, ...constraints);
  
  const querySnapshot = await getDocs(q);
  const documents = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as ArchiveDocument));
  const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  
  return { documents, lastDoc: newLastDoc };
}

export async function getDocument(id: string): Promise<ArchiveDocument | null> {
  const dSnap = await getDoc(doc(db, 'documents', id));
  return dSnap.exists() ? { id: dSnap.id, ...dSnap.data() } as ArchiveDocument : null;
}

export async function createDocument(data: Omit<ArchiveDocument, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'documents'), {
    ...data,
    uploadedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDocument(id: string, data: Partial<ArchiveDocument>): Promise<void> {
  await updateDoc(doc(db, 'documents', id), data as DocumentData);
}

export async function deleteDocument(id: string): Promise<void> {
  await deleteDoc(doc(db, 'documents', id));
}

export async function getDocumentsByIds(ids: string[]): Promise<ArchiveDocument[]> {
  if (!ids || ids.length === 0) return [];
  const chunkedIds = ids.slice(0, 10);
  const q = query(collection(db, 'documents'), where('__name__', 'in', chunkedIds));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ArchiveDocument));
}

// Cross-type Search
export async function searchAll(searchQuery: string): Promise<{ photos: Photo[], persons: Person[], documents: ArchiveDocument[] }> {
  // Simple client-side text filtering as Firestore lacks native full-text search.
  const lowerQuery = searchQuery.toLowerCase();
  
  const [photoSnap, personSnap, docSnap] = await Promise.all([
    getDocs(collection(db, 'photos')),
    getDocs(collection(db, 'persons')),
    getDocs(collection(db, 'documents'))
  ]);
  
  const photos = photoSnap.docs
    .map(d => ({ id: d.id, ...d.data() } as Photo))
    .filter(p => p.title.toLowerCase().includes(lowerQuery) || p.description?.toLowerCase().includes(lowerQuery) || p.tags?.some(t => t.toLowerCase().includes(lowerQuery)));
    
  const persons = personSnap.docs
    .map(d => ({ id: d.id, ...d.data() } as Person))
    .filter(p => p.fullName.toLowerCase().includes(lowerQuery) || p.biography?.toLowerCase().includes(lowerQuery) || p.tags?.some(t => t.toLowerCase().includes(lowerQuery)));
    
  const documents = docSnap.docs
    .map(d => ({ id: d.id, ...d.data() } as ArchiveDocument))
    .filter(doc => doc.title.toLowerCase().includes(lowerQuery) || doc.description?.toLowerCase().includes(lowerQuery) || doc.tags?.some(t => t.toLowerCase().includes(lowerQuery)));
    
  return { photos, persons, documents };
}
