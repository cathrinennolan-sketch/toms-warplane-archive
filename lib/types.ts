export interface Photo {
  id: string;
  title: string;
  imageUrl: string;        // with caption overlay
  imageCleanUrl: string;   // original, no overlay
  thumbnailUrl: string;
  year?: number;
  dateApprox?: string;
  unit?: string;
  planeType?: string;
  planeSerial?: string;
  pilotName?: string;
  personIds: string[];
  photographer?: string;
  source?: string;
  description?: string;
  peopleInPhoto: string[];
  tags: string[];
  downloadCount: number;
  uploadedAt: any;
  uploadedBy: string;
}

export interface Person {
  id: string;
  fullName: string;
  portraitUrl?: string;
  birthYear?: number;
  deathYear?: number;
  rank?: string;
  unit?: string;
  branch?: string;
  biography?: string;
  relatedPhotoIds: string[];
  relatedDocIds: string[];
  tags: string[];
  uploadedAt: any;
  uploadedBy: string;
}

export interface ArchiveDocument {
  id: string;
  title: string;
  fileUrl: string;
  category: 'Manual' | 'Orders' | 'Certificate' | 'Map' | 'Letter' | 'Other';
  year?: number;
  description?: string;
  relatedPersonIds: string[];
  relatedPhotoIds: string[];
  tags: string[];
  uploadedAt: any;
  uploadedBy: string;
}

export interface Admin {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin';
  invitedBy: string;
  invitedAt: any;
  active: boolean;
}
