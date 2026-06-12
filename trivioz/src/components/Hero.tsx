'use client';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';

export default function Hero() {
  const { t, adminHero } = useStore();

  // Fallbacks if not set
  const left = adminHero?.left || { text: 'Woman', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop', link: 'Woman' };
  const right = adminHero?.right || { text: 'Man', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop', link: 'Man' };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', display: 'flex', overflow: 'hidden' }}>
      
      {/* Left Section */}
      <Link href={`/shop?category=${encodeURIComponent(left.link)}`} style={{ flex: 1, position: 'relative', height: '100%', cursor: 'pointer', display: 'block' }} className="group">
        <img 
          src={left.image} 
          alt={left.text} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)', transition: 'background-color 0.3s' }} className="group-hover:bg-black/20" />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontWeight: 800, fontSize: '5rem', letterSpacing: '-1.5px', textShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>{left.text}</h2>
        </div>
        
        {/* Accessibility Icon */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', backgroundColor: '#fff', padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2"></circle>
            <path d="M4 9h16"></path>
            <path d="M12 9v8"></path>
            <path d="M8 22l4-5 4 5"></path>
          </svg>
          <span style={{ color: '#000', fontSize: '1rem', lineHeight: 1 }}>|</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      </Link>

      {/* Right Section */}
      <Link href={`/shop?category=${encodeURIComponent(right.link)}`} style={{ flex: 1, position: 'relative', height: '100%', cursor: 'pointer', display: 'block' }} className="group">
        <img 
          src={right.image} 
          alt={right.text} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)', transition: 'background-color 0.3s' }} className="group-hover:bg-black/20" />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontWeight: 800, fontSize: '5rem', letterSpacing: '-1.5px', textShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>{right.text}</h2>
        </div>
      </Link>

    </div>
  );
}
