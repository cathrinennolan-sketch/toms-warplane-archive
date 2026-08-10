import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export function getExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

export async function uploadPhotoImage(
  file: File,
  uid: string,
  onProgress?: (progress: number) => void
): Promise<{ imageCleanUrl: string; thumbnailUrl: string }> {
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `photos/${uid}/${filename}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        // Since we don't have server-side processing in this setup, both point to the same URL.
        resolve({ imageCleanUrl: downloadURL, thumbnailUrl: downloadURL });
      }
    );
  });
}

export async function uploadPortraitPhoto(
  file: File,
  uid: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `portraits/${uid}/${filename}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

export async function uploadDocument(
  file: File,
  uid: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `documents/${uid}/${filename}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
