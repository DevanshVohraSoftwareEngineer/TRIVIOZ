'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function DropBanner({ previewData }: { previewData?: any } = {}) {
  const { adminWaves, hypeAnalytics, setHypeAnalytics } = useStore();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [globalWave, setGlobalWave] = useState<any>(null);
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    if (previewData) return;
    const wave = adminWaves.find(w => w.isGlobal && w.status === 'PENDING');
    setGlobalWave(wave);

    if (wave && wave.targetTime) {
      const updateTimer = () => {
        setCountdown(Math.max(0, Math.floor((wave.targetTime - Date.now()) / 1000)));
      };
      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [adminWaves, previewData]);

  const activeWave = previewData || globalWave;

  if (!activeWave && !previewData) return null;
  if (!previewData && (countdown === null || countdown <= 0)) return null;

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    return { d, h, m, s };
  };

  const time = previewData ? { d: 3, h: 12, m: 30, s: 0 } : formatTime(countdown || 0);

  const handleNotify = () => {
    if (!hasNotified) {
      setHypeAnalytics({ ...hypeAnalytics, signups: hypeAnalytics.signups + 1 });
      setHasNotified(true);
    }
  };

  return (
    <section style={{ padding: previewData ? '1rem' : '2rem 2rem', backgroundColor: previewData ? '#fff' : '#fafafa', color: '#000' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        backgroundColor: '#000',
        color: '#fff',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Left Side: Image Box */}
        <div style={{ position: 'relative', minHeight: '500px' }}>
          <img 
            src={activeWave.imageUrl || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"} 
            alt="Exclusive Drop" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
          <div style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            backgroundColor: '#fff',
            color: '#000',
            padding: '0.5rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Exclusive Release
          </div>
        </div>

        {/* Right Side: Content */}
        <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#aaa', marginBottom: '1rem', fontWeight: 600 }}>
            Upcoming Drop
          </h2>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-1px' }}>
            {activeWave.name || 'New Wave'}
          </h3>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 300, fontFamily: 'monospace' }}>{time.d}</div>
              <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Days</div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 100, color: '#444' }}>:</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 300, fontFamily: 'monospace' }}>{time.h.toString().padStart(2, '0')}</div>
              <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Hours</div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 100, color: '#444' }}>:</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 300, fontFamily: 'monospace' }}>{time.m.toString().padStart(2, '0')}</div>
              <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Mins</div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 100, color: '#444' }}>:</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 300, fontFamily: 'monospace' }}>{time.s.toString().padStart(2, '0')}</div>
              <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Secs</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{activeWave.benefit1Title || 'Early Notification'}</strong>
                <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{activeWave.benefit1Desc || 'Get pinged 15 minutes before the drop goes live globally.'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🔒</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{activeWave.benefit2Title || 'Secure Your Size'}</strong>
                <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{activeWave.benefit2Desc || 'High risk of immediate stockout on core sizes. Lock yours in.'}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleNotify}
            disabled={hasNotified}
            style={{
              background: hasNotified ? '#333' : '#fff',
              color: hasNotified ? '#aaa' : '#000',
              border: 'none',
              padding: '1.25rem 2rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: hasNotified ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
            {hasNotified ? '✓ Notifications Enabled' : 'Notify Me First'}
          </button>
        </div>
      </div>
    </section>
  );
}
