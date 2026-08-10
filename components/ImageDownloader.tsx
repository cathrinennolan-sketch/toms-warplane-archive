'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface ImageDownloaderProps {
  imageUrl: string;
  filename: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export default function ImageDownloader({ 
  imageUrl, 
  filename, 
  label = 'Download High-Res', 
  variant = 'primary',
  className = '' 
}: ImageDownloaderProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(imageUrl, { mode: 'cors' });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button 
      className={`btn btn-${variant} ${className}`} 
      onClick={handleDownload}
      disabled={downloading}
    >
      {downloading ? (
        <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      )}
      {label}
    </button>
  );
}
