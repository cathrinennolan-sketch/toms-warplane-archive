'use client';

import { useEffect, useRef, useState } from 'react';

interface CaptionOverlayProps {
  imageUrl: string;
  title: string;
  visible: boolean;
  className?: string;
}

export default function CaptionOverlay({ imageUrl, title, visible, className = '' }: CaptionOverlayProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDarkText, setIsDarkText] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const img = imgRef.current;
    if (!img) return;

    const calculateLuminance = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      try {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Sample bottom 15% of the image
        const sampleHeight = Math.floor(canvas.height * 0.15);
        const startY = canvas.height - sampleHeight;
        
        const imageData = ctx.getImageData(0, startY, canvas.width, sampleHeight);
        const data = imageData.data;
        
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        // Sample every 4th pixel to save processing
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        
        r = r / count;
        g = g / count;
        b = b / count;
        
        // HSP equation from http://alienryderflex.com/hsp.html
        const hsp = Math.sqrt(
          0.299 * (r * r) +
          0.587 * (g * g) +
          0.114 * (b * b)
        );
        
        setIsDarkText(hsp > 127.5);
      } catch (e) {
        // Fallback if CORS fails
        console.warn('Could not calculate image luminance, defaulting to light text', e);
        setIsDarkText(false);
      }
      setIsCalculated(true);
    };

    if (img.complete) {
      calculateLuminance();
    } else {
      img.addEventListener('load', calculateLuminance);
      return () => img.removeEventListener('load', calculateLuminance);
    }
  }, [imageUrl, visible]);

  if (!visible) return null;

  return (
    <div className={`caption-overlay ${className}`}>
      <img 
        ref={imgRef}
        src={imageUrl} 
        alt="Hidden source for luminance calculation" 
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div 
        className="caption-bar"
        style={{
          background: isCalculated 
            ? isDarkText 
              ? 'linear-gradient(to top, rgba(255,255,255,0.7), transparent)'
              : 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)'
            : 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
          color: isCalculated ? (isDarkText ? '#1A1918' : '#FFFFFF') : '#FFFFFF'
        }}
      >
        <h2 className="caption-title">{title}</h2>
      </div>

      <style jsx>{`
        .caption-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
        }
        .caption-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 32px 24px 24px;
          transition: all 0.3s ease;
        }
        .caption-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          margin: 0;
          text-shadow: ${isDarkText ? 'none' : '0 1px 3px rgba(0,0,0,0.5)'};
        }
      `}</style>
    </div>
  );
}
