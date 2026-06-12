'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import DropBanner from '@/components/DropBanner';

export default function LaunchpadPage() {
  const { products, setProducts, adminWaves, setAdminWaves, hypeAnalytics } = useStore();
  const [countdown, setCountdown] = useState(0);
  const [activeWave, setActiveWave] = useState<string | null>(null);
  const [cdnPreheated, setCdnPreheated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [draftWave, setDraftWave] = useState({ 
    id: '', name: '', cohort: '', routing: '', time: '', isGlobal: false, targetTime: null as number | null,
    imageUrl: '', benefit1Title: '', benefit1Desc: '', benefit2Title: '', benefit2Desc: '' 
  });

  const globalWave = adminWaves.find(w => w.isGlobal);

  useEffect(() => {
    const target = globalWave?.targetTime ? globalWave.targetTime : Date.now() + 86400 * 3 * 1000;
    
    const updateTimer = () => {
      setCountdown(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    return { d, h, m, s };
  };

  const time = formatTime(countdown);

  const stagedItems = products.slice(0, 4).map(p => ({ ...p, id: p.id + '-staged' }));

  const executeWave = (waveId: string) => {
    setProducts((prev) => [...stagedItems, ...prev]);
    setActiveWave(waveId);
    setAdminWaves(adminWaves.map(w => w.id === waveId ? { ...w, status: 'EXECUTED' } : w));
  };

  const undoExecute = (waveId: string) => {
    setAdminWaves(adminWaves.map(w => w.id === waveId ? { ...w, status: 'PENDING' } : w));
    if (activeWave === waveId) setActiveWave(null);
  };

  const deleteWave = (waveId: string) => {
    setAdminWaves(adminWaves.filter(w => w.id !== waveId));
  };

  const startEditing = (wave: any) => {
    setDraftWave({
      id: wave.id,
      name: wave.name || '',
      cohort: wave.cohort || '',
      routing: wave.routing || '',
      time: wave.time || '',
      isGlobal: wave.isGlobal || false,
      targetTime: wave.targetTime || null,
      imageUrl: wave.imageUrl || '',
      benefit1Title: wave.benefit1Title || '',
      benefit1Desc: wave.benefit1Desc || '',
      benefit2Title: wave.benefit2Title || '',
      benefit2Desc: wave.benefit2Desc || ''
    });
    setIsCreating(true);
  };

  const saveWave = () => {
    const waveData = {
      id: draftWave.id || `w-${Date.now()}`,
      name: draftWave.name || 'New Wave',
      cohort: draftWave.cohort || 'Public',
      routing: draftWave.routing || 'All Channels',
      time: draftWave.time || 'TBA',
      status: 'PENDING',
      isGlobal: draftWave.isGlobal,
      targetTime: draftWave.isGlobal ? (draftWave.targetTime || Date.now() + 86400 * 3 * 1000) : null,
      imageUrl: draftWave.imageUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
      benefit1Title: draftWave.benefit1Title || 'Early Notification',
      benefit1Desc: draftWave.benefit1Desc || 'Get pinged 15 minutes before the drop.',
      benefit2Title: draftWave.benefit2Title || 'Secure Your Size',
      benefit2Desc: draftWave.benefit2Desc || 'Lock yours in before stockout.'
    };

    if (draftWave.id) {
      setAdminWaves(adminWaves.map(w => w.id === draftWave.id ? { ...w, ...waveData } : w));
    } else {
      setAdminWaves([...adminWaves, waveData]);
    }

    setIsCreating(false);
    setDraftWave({ id: '', name: '', cohort: '', routing: '', time: '', isGlobal: false, targetTime: null, imageUrl: '', benefit1Title: '', benefit1Desc: '', benefit2Title: '', benefit2Desc: '' });
  };

  const cancelEditing = () => {
    setIsCreating(false);
    setDraftWave({ id: '', name: '', cohort: '', routing: '', time: '', isGlobal: false, targetTime: null, imageUrl: '', benefit1Title: '', benefit1Desc: '', benefit2Title: '', benefit2Desc: '' });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-hero" style={{ 
        background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff', 
        minHeight: '200px' 
      }}>
        <div>
          <p className="admin-kicker" style={{ color: '#aaa', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Release Engineering</p>
          <h1 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Hype Engine & Launchpad</h1>
          <p style={{ marginTop: '0.5rem', color: '#eee', maxWidth: '600px', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Execute massive, tiered product drops. Manage wave deployments, channel routing, and pre-launch hype telemetry.
          </p>
        </div>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: '1fr 350px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Wave Deployment Schedule */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p className="admin-kicker">Deployment Strategy</p>
                <h2>Release Waves: Summer Edit 2026</h2>
              </div>
              <button className="admin-button" style={{ background: '#000', color: '#fff' }} onClick={() => setIsCreating(true)}>+ Add Wave</button>
            </div>
            
            {isCreating && (
              <div style={{ padding: '1.5rem', background: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>{draftWave.id ? 'Edit Release Wave' : 'Create Release Wave'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label>Wave Name<input value={draftWave.name} onChange={e => setDraftWave({...draftWave, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                  <label>Target Cohort<input value={draftWave.cohort} onChange={e => setDraftWave({...draftWave, cohort: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                  <label>Channel Routing<input value={draftWave.routing} onChange={e => setDraftWave({...draftWave, routing: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                  <label>Scheduled Time<input value={draftWave.time} onChange={e => setDraftWave({...draftWave, time: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                  
                  <label style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input type="checkbox" checked={draftWave.isGlobal} onChange={e => setDraftWave({...draftWave, isGlobal: e.target.checked})} />
                    <strong>Set as Global Storefront Wave</strong> (This will activate the Storefront Banner)
                  </label>

                  {draftWave.isGlobal && (
                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#eee' }}>
                        <label style={{ gridColumn: 'span 2' }}>Banner Image URL<input value={draftWave.imageUrl} onChange={e => setDraftWave({...draftWave, imageUrl: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                        <label>Benefit 1 Title<input value={draftWave.benefit1Title} onChange={e => setDraftWave({...draftWave, benefit1Title: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                        <label>Benefit 1 Desc<input value={draftWave.benefit1Desc} onChange={e => setDraftWave({...draftWave, benefit1Desc: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                        <label>Benefit 2 Title<input value={draftWave.benefit2Title} onChange={e => setDraftWave({...draftWave, benefit2Title: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                        <label>Benefit 2 Desc<input value={draftWave.benefit2Desc} onChange={e => setDraftWave({...draftWave, benefit2Desc: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#666', marginBottom: '0.5rem' }}>Live Storefront Preview</h4>
                        <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
                          <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '166.66%' }}>
                            <DropBanner previewData={draftWave} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button className="admin-button" onClick={saveWave}>Save Wave</button>
                  <button onClick={cancelEditing} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #ccc' }}>Cancel</button>
                </div>
              </div>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Wave</th>
                    <th>Target Cohort</th>
                    <th>Channel Routing</th>
                    <th>Scheduled Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {adminWaves.map((wave) => (
                    <tr key={wave.id} style={{ background: wave.status === 'EXECUTED' ? '#edf7ef' : 'transparent' }}>
                      <td><strong>{wave.name}</strong></td>
                      <td>{wave.cohort}</td>
                      <td>{wave.routing}</td>
                      <td>{wave.time}</td>
                      <td>
                        <span className="admin-status" style={{ background: wave.status === 'EXECUTED' ? '#176b2c' : '#eee', color: wave.status === 'EXECUTED' ? '#fff' : '#000' }}>
                          {wave.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <button onClick={() => startEditing(wave)} style={{ textDecoration: 'underline', fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6' }}>Edit</button>
                          {wave.status === 'PENDING' ? (
                            <button onClick={() => executeWave(wave.id)} style={{ textDecoration: 'underline', fontSize: '0.75rem', fontWeight: 600 }}>Execute</button>
                          ) : (
                            <button onClick={() => undoExecute(wave.id)} style={{ textDecoration: 'underline', fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>Undo</button>
                          )}
                          <button onClick={() => deleteWave(wave.id)} style={{ textDecoration: 'underline', fontSize: '0.75rem', fontWeight: 600, color: '#d50000' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {adminWaves.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No active waves.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Staged Inventory */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p className="admin-kicker">Catalog Readiness</p>
                <h2>Staged Inventory Allocation</h2>
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Allocated Stock</th>
                    <th>Asset Readiness</th>
                  </tr>
                </thead>
                <tbody>
                  {stagedItems.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          <img src={product.images[0]} alt={product.name} />
                          <span><strong>{product.name}</strong></span>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td><span className="admin-stock">{product.stock} units</span></td>
                      <td><span className="admin-status" style={{ background: '#edf7ef', color: '#176b2c' }}>Verified</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Hype & Infrastructure */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="admin-panel" style={{ overflow: 'hidden', backgroundColor: '#000', color: '#fff', border: 'none' }}>
            <div style={{ position: 'relative', height: '180px' }}>
              <img 
                src={globalWave?.imageUrl || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop"} 
                alt="Exclusive Drop" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                backgroundColor: '#fff',
                color: '#000',
                padding: '0.25rem 0.75rem',
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Global Timer
              </div>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', marginBottom: '0.5rem', fontWeight: 600 }}>
                Target Schedule
              </h2>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', textAlign: 'center' }}>
                {globalWave?.name || 'Wave 3 Drop'}
              </h3>
              
              {countdown === 0 ? (
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#176b2c', letterSpacing: '2px' }}>DEPLOYED</div>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 300, fontFamily: 'monospace' }}>{time.d}</div>
                    <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Days</div>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 100, color: '#444' }}>:</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 300, fontFamily: 'monospace' }}>{time.h.toString().padStart(2, '0')}</div>
                    <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Hrs</div>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 100, color: '#444' }}>:</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 300, fontFamily: 'monospace' }}>{time.m.toString().padStart(2, '0')}</div>
                    <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Min</div>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 100, color: '#444' }}>:</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 300, fontFamily: 'monospace' }}>{time.s.toString().padStart(2, '0')}</div>
                    <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Sec</div>
                  </div>
                </div>
              )}
              <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>
                {countdown === 0 ? 'Global catalog is live.' : 'T-Minus to automatic global sync'}
              </p>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p className="admin-kicker">Demand Forecasting</p>
                <h2>Pre-Launch Hype Analytics</h2>
              </div>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>"Notify Me" Signups</span>
                <strong style={{ fontSize: '1.5rem', color: '#000' }}>{hypeAnalytics.signups.toLocaleString()}</strong>
                <div style={{ width: '100%', background: '#eee', height: '4px', marginTop: '0.5rem' }}>
                  <div style={{ width: `${Math.min(100, (hypeAnalytics.signups / 500) * 100)}%`, background: '#176b2c', height: '100%' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.25rem' }}>Goal: 500 signups</p>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Total Wishlisted</span>
                <strong style={{ fontSize: '1.5rem', color: '#000' }}>{Math.floor(hypeAnalytics.signups * 3.7).toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Expected Sell-Through</span>
                <strong style={{ fontSize: '1.5rem', color: '#d50000' }}>{Math.max(0.5, (10 - (hypeAnalytics.signups * 0.1))).toFixed(1)} Hours</strong>
                <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.25rem' }}>High risk of immediate stockout on M/L sizes.</p>
              </div>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p className="admin-kicker">Infrastructure</p>
                <h2>Asset Pre-Heating</h2>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
                Push high-resolution media assets to edge CDNs prior to launch to prevent bandwidth bottlenecks.
              </p>
              <button 
                className="admin-button" 
                onClick={() => setCdnPreheated(true)}
                disabled={cdnPreheated}
                style={{ width: '100%', background: cdnPreheated ? '#edf7ef' : '#000', color: cdnPreheated ? '#176b2c' : '#fff', border: cdnPreheated ? '1px solid #176b2c' : 'none' }}
              >
                {cdnPreheated ? 'CDN Edges Warmed ✓' : 'Push Assets to CDN'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
