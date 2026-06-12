'use client';

import { useStore } from '@/context/StoreContext';
import { usePathname } from 'next/navigation';

export default function SaleBanner({ previewData }: { previewData?: any } = {}) {
  const { globalDiscount, adminLiveEvents } = useStore();
  const pathname = usePathname();
  
  const primaryEvent = previewData || adminLiveEvents.find(e => e.id === 'EVT-PRIMARY');
  const isSaleActive = previewData ? true : globalDiscount > 0;
  
  const isFooterPage = ['/privacy', '/terms'].some(p => pathname?.includes(p));

  if ((!isSaleActive || !primaryEvent || isFooterPage) && !previewData) return null;

  return (
    <div style={{
      background: primaryEvent.bannerColor || '#8b0000',
      color: '#fff',
      padding: '1.25rem',
      textAlign: 'center',
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      zIndex: 100
    }}>
      <span style={{ 
        animation: previewData ? 'none' : 'pulse 1.5s infinite', 
        display: 'inline-block', 
        width: '12px', 
        height: '12px', 
        background: '#fff', 
        borderRadius: '50%' 
      }}></span>
      <span style={{ fontSize: '1.1rem' }}>
        {primaryEvent.bannerText || `LIVE FLASH EVENT: ${primaryEvent.discount} ON ${primaryEvent.cohort}`}
      </span>
      <button style={{
        background: '#fff',
        color: primaryEvent.bannerColor || '#8b0000',
        border: 'none',
        padding: '0.5rem 1.25rem',
        fontWeight: 800,
        cursor: 'pointer',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {primaryEvent.bannerButtonText || 'SHOP NOW'}
      </button>
      <span style={{ 
        animation: previewData ? 'none' : 'pulse 1.5s infinite', 
        display: 'inline-block', 
        width: '12px', 
        height: '12px', 
        background: '#fff', 
        borderRadius: '50%' 
      }}></span>
    </div>
  );
}
