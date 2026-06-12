'use client';

import { useStore } from '@/context/StoreContext';
import { useState, useEffect } from 'react';
import SaleBanner from '@/components/SaleBanner';

export default function LiveSalePage() {
  const { globalDiscount, setGlobalDiscount, adminLiveEvents, setAdminLiveEvents, adminOrders } = useStore();
  const realGmv = adminOrders.reduce((sum, order) => sum + (Number(order.value) || 0), 0);

  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({ 
    id: '', cohort: '', discount: '', throttle: '', status: 'STANDBY',
    bannerText: '', bannerColor: '#8b0000', bannerButtonText: ''
  });

  const isSaleActive = globalDiscount > 0;

  const toggleSale = () => {
    if (isSaleActive) {
      setGlobalDiscount(0);
    } else {
      setGlobalDiscount(25); // default to 25% for the primary event
    }
  };

  return (
    <div className="admin-dashboard">
      <div className={`admin-hero admin-hero-live`} style={{ minHeight: '140px' }}>
        <div>
          <p className="admin-kicker" style={{ color: 'rgba(255,255,255,0.7)' }}>Operations Control</p>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isSaleActive && <span style={{ width: 16, height: 16, background: '#fff', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>}
            Flash Event War Room
          </h1>
          <p style={{ marginTop: '0.5rem', opacity: 0.9, maxWidth: '600px' }}>
            Multi-event controller with inventory throttling, granular pricing matrices, and deep telemetry for high-traffic sales.
          </p>
        </div>
        <div className="admin-hero-actions">
          <button 
            onClick={toggleSale}
            style={{ 
              background: '#fff', 
              color: isSaleActive ? '#8b0000' : '#000', 
              padding: '0.8rem 2rem', 
              fontSize: '1rem', 
              fontWeight: 900, 
              textTransform: 'uppercase',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            {isSaleActive ? 'KILL SWITCH (END EVENT)' : 'INITIALIZE PRIMARY EVENT'}
          </button>
        </div>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: '1fr 300px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Multi-Event Matrix */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p className="admin-kicker">Event Matrix</p>
                <h2>Concurrent Sales</h2>
              </div>
              <button style={{ textDecoration: 'underline', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setIsCreating(true)}>+ Schedule Event</button>
            </div>
            
            {isCreating && (
              <div style={{ padding: '1.5rem', background: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>{adminLiveEvents.find(e => e.id === newEvent.id) ? 'Edit Flash Event' : 'Schedule Flash Event'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label>Event ID<input value={newEvent.id} onChange={e => setNewEvent({...newEvent, id: e.target.value})} placeholder="EVT-SOMETHING" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                  <label>Target Cohort<input value={newEvent.cohort} onChange={e => setNewEvent({...newEvent, cohort: e.target.value})} placeholder="e.g. Category: Tops" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                  <label>Discount Engine<input value={newEvent.discount} onChange={e => setNewEvent({...newEvent, discount: e.target.value})} placeholder="e.g. 20% OFF" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                  <label>Inventory Throttle<input value={newEvent.throttle} onChange={e => setNewEvent({...newEvent, throttle: e.target.value})} placeholder="e.g. Drip Feed" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                  
                  <div style={{ gridColumn: 'span 2', marginTop: '0.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: '#666' }}>Storefront Banner Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <label style={{ gridColumn: 'span 2' }}>Banner Text<input value={newEvent.bannerText} onChange={e => setNewEvent({...newEvent, bannerText: e.target.value})} placeholder="LIVE FLASH EVENT: 25% OFF STOREWIDE" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                      <label>Banner Color<input type="color" value={newEvent.bannerColor} onChange={e => setNewEvent({...newEvent, bannerColor: e.target.value})} style={{ width: '100%', padding: '0.25rem', marginTop: '0.2rem', height: '40px' }}/></label>
                      <label>Button Text<input value={newEvent.bannerButtonText} onChange={e => setNewEvent({...newEvent, bannerButtonText: e.target.value})} placeholder="SHOP NOW" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#666', marginBottom: '0.5rem' }}>Live Storefront Preview</h4>
                  <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
                    <div style={{ width: '100%', overflowX: 'hidden' }}>
                      <SaleBanner previewData={newEvent} />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button className="admin-button" onClick={() => {
                    if (newEvent.id) {
                      const existingIndex = adminLiveEvents.findIndex(e => e.id === newEvent.id);
                      if (existingIndex >= 0) {
                        const newEvents = [...adminLiveEvents];
                        newEvents[existingIndex] = newEvent;
                        setAdminLiveEvents(newEvents);
                      } else {
                        setAdminLiveEvents([...adminLiveEvents, newEvent]);
                      }
                      setNewEvent({ id: '', cohort: '', discount: '', throttle: '', status: 'STANDBY', bannerText: '', bannerColor: '#8b0000', bannerButtonText: '' });
                      setIsCreating(false);
                    }
                  }}>Save Event</button>
                  <button onClick={() => {
                    setIsCreating(false);
                    setNewEvent({ id: '', cohort: '', discount: '', throttle: '', status: 'STANDBY', bannerText: '', bannerColor: '#8b0000', bannerButtonText: '' });
                  }} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #ccc', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event ID</th>
                    <th>Target Cohort / Category</th>
                    <th>Discount Engine</th>
                    <th>Inventory Throttle</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminLiveEvents.map((evt, idx) => {
                    const isPrimary = evt.id === 'EVT-PRIMARY';
                    const activeState = isPrimary && isSaleActive ? 'LIVE' : evt.status;
                    return (
                      <tr key={idx} style={{ background: isPrimary && isSaleActive ? '#fff0f0' : 'transparent' }} onContextMenu={(e) => { e.preventDefault(); setAdminLiveEvents(adminLiveEvents.filter((_, i) => i !== idx)); }}>
                        <td><strong>{evt.id}</strong></td>
                        <td>{evt.cohort}</td>
                        <td>{evt.discount}</td>
                        <td>{evt.throttle}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span className={isPrimary && isSaleActive ? "admin-status is-risk" : "admin-status"} style={activeState === 'ACTIVE (SILENT)' ? { background: '#edf7ef', color: '#176b2c' } : {}}>
                              {activeState}
                            </span>
                            <button 
                              onClick={() => {
                                setNewEvent({
                                  id: evt.id || '', cohort: evt.cohort || '', discount: evt.discount || '', throttle: evt.throttle || '', status: evt.status || 'STANDBY',
                                  bannerText: (evt as any).bannerText || '', bannerColor: (evt as any).bannerColor || '#8b0000', bannerButtonText: (evt as any).bannerButtonText || ''
                                });
                                setIsCreating(true);
                              }} 
                              style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: '0' }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => setAdminLiveEvents(adminLiveEvents.filter((_, i) => i !== idx))} 
                              style={{ background: 'none', border: 'none', color: '#d50000', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: '0' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {adminLiveEvents.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>No events scheduled.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scarcity & Throttling */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p className="admin-kicker">Scarcity Engine</p>
                <h2>Inventory Throttling</h2>
              </div>
            </div>
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>Global Release Flow</label>
                <input type="range" min="0" max="100" defaultValue="100" style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                  <span>0% (Halted)</span>
                  <span style={{ fontWeight: 800, color: '#000' }}>100% (Unrestricted)</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '1rem' }}>
                  Restricting flow artificially prolongs sale duration by locking deep inventory and showing "Few left" on storefront.
                </p>
              </div>
              <div style={{ background: '#fafafa', padding: '1.5rem', border: '1px solid #eee' }}>
                <strong style={{ display: 'block', marginBottom: '1rem' }}>Active Constraints</strong>
                {adminLiveEvents.length > 0 ? (
                  adminLiveEvents.map((evt, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span>{evt.id} Throttle</span>
                      <strong>{evt.throttle}</strong>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>No active constraints</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
                  <span>Bot Mitigation</span>
                  <strong style={{ color: '#176b2c' }}>Active</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Deep Telemetry */}
        <div className="admin-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Deep Telemetry</p>
              <h2>Live Pulse</h2>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--gray-200)', gap: '1px' }}>
            <div style={{ background: '#fff', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Gross Merchandise Value</span>
              <strong style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1, marginTop: '0.5rem', color: isSaleActive ? '#8b0000' : '#000', wordBreak: 'break-word' }}>
                AED {realGmv.toLocaleString()}
              </strong>
            </div>
            
            <div style={{ background: '#fff', padding: '1.5rem', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Active Carts</span>
              <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginTop: '0.5rem', wordBreak: 'break-word' }}>
                {isSaleActive ? '0' : '-'}
              </strong>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Checkout Velocity</span>
              <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginTop: '0.5rem', wordBreak: 'break-word' }}>
                {isSaleActive ? `0/min` : '-'}
              </strong>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Gateway Health (Success Rate)</span>
              <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginTop: '0.5rem', color: '#176b2c', wordBreak: 'break-word' }}>
                {isSaleActive ? `100%` : '-'}
              </strong>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Cart Abandonment Spike</span>
              <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginTop: '0.5rem', color: '#000', wordBreak: 'break-word' }}>
                {isSaleActive ? `0%` : '-'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
      `}} />
    </div>
  );
}
