'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function LogisticsPage() {
  const { adminLogistics, setAdminLogistics, logisticsMetrics, setLogisticsMetrics } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [draftParcel, setDraftParcel] = useState({ awb: '', orderId: '', courier: 'Delhivery', zone: 'North Hub' });
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [draftMetrics, setDraftMetrics] = useState({ activeShipments: 0, avgSla: 0, rtoRate: 0 });

  const parcels = adminLogistics;

  const createParcel = () => {
    const newParcel = {
      ...draftParcel,
      status: 'In Transit',
      rto: false
    };
    setAdminLogistics([newParcel, ...adminLogistics]);
    setIsCreating(false);
    setDraftParcel({ awb: '', orderId: '', courier: 'Delhivery', zone: 'North Hub' });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-hero admin-hero-logistics">
        <div>
          <p className="admin-kicker" style={{ color: '#8fb8ed' }}>Fulfillment & Freight</p>
          <h1>Logistics Command</h1>
          <p style={{ marginTop: '0.5rem', color: '#d0e1f9' }}>Route packages, manage 3PL integrations, and process RTOs.</p>
        </div>
        <div className="admin-hero-actions">
          <button className="admin-button" style={{ background: '#fff', color: '#0a2342' }} onClick={() => setIsCreating(true)}>
            Register Shipment
          </button>
        </div>
      </div>

      <div className="admin-metrics">
        <article>
          <span>Active Shipments</span>
          {isEditingMetrics ? (
            <input type="number" value={draftMetrics.activeShipments} onChange={e => setDraftMetrics({...draftMetrics, activeShipments: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '0.2rem', marginTop: '0.2rem', fontWeight: 'bold' }} />
          ) : (
            <strong>{logisticsMetrics.activeShipments.toLocaleString()}</strong>
          )}
          <small>Live Data</small>
        </article>
        <article>
          <span>Avg. Delivery SLA</span>
          {isEditingMetrics ? (
            <input type="number" step="0.1" value={draftMetrics.avgSla} onChange={e => setDraftMetrics({...draftMetrics, avgSla: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '0.2rem', marginTop: '0.2rem', fontWeight: 'bold' }} />
          ) : (
            <strong>{logisticsMetrics.avgSla} Days</strong>
          )}
          <small>Monitored</small>
        </article>
        <article>
          <span>RTO Rate</span>
          {isEditingMetrics ? (
            <input type="number" step="0.1" value={draftMetrics.rtoRate} onChange={e => setDraftMetrics({...draftMetrics, rtoRate: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '0.2rem', marginTop: '0.2rem', fontWeight: 'bold', color: '#d50000' }} />
          ) : (
            <strong style={{ color: '#d50000' }}>{logisticsMetrics.rtoRate}%</strong>
          )}
          <small>Needs attention</small>
        </article>
        <article style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
          {isEditingMetrics ? (
            <>
              <button className="admin-button" style={{ padding: '0.4rem 0.8rem', background: '#000', color: '#fff', fontSize: '0.8rem' }} onClick={() => {
                setLogisticsMetrics(draftMetrics);
                setIsEditingMetrics(false);
              }}>Save</button>
              <button onClick={() => setIsEditingMetrics(false)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'none', border: '1px solid #ccc' }}>Cancel</button>
            </>
          ) : (
            <button 
              className="admin-button" 
              style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff' }}
              onClick={() => {
                setDraftMetrics(logisticsMetrics);
                setIsEditingMetrics(true);
              }}
            >
              Edit Metrics
            </button>
          )}
        </article>
      </div>

      <div className="admin-grid">
        <div className="admin-panel" style={{ gridColumn: 'span 2' }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Live Tracking</p>
              <h2>Outbound & Returns Ledger</h2>
            </div>
          </div>

          {isCreating && (
            <div style={{ padding: '1.5rem', background: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Register New Shipment</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label>AWB<input value={draftParcel.awb} onChange={e => setDraftParcel({...draftParcel, awb: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                <label>Order ID<input value={draftParcel.orderId} onChange={e => setDraftParcel({...draftParcel, orderId: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                <label>Courier<input value={draftParcel.courier} onChange={e => setDraftParcel({...draftParcel, courier: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                <label>Zone<input value={draftParcel.zone} onChange={e => setDraftParcel({...draftParcel, zone: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="admin-button" onClick={createParcel}>Save Shipment</button>
                <button onClick={() => setIsCreating(false)} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #ccc' }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>AWB / Tracking</th>
                  <th>Reference Order</th>
                  <th>Logistics Partner</th>
                  <th>Current Zone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((p: any, index: number) => (
                  <tr key={index} style={{ background: p.rto ? '#fff0f0' : 'transparent' }} onContextMenu={(e) => { e.preventDefault(); setAdminLogistics(adminLogistics.filter((_: any, i: number) => i !== index)); }}>
                    <td><strong style={{ fontFamily: 'monospace' }}>{p.awb}</strong></td>
                    <td><a href="#" style={{ textDecoration: 'underline' }}>{p.orderId}</a></td>
                    <td>{p.courier}</td>
                    <td>{p.zone}</td>
                    <td>
                      <span className={p.rto ? 'admin-status is-risk' : 'admin-status'}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {parcels.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>No active parcels. Right-click a parcel to delete.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Warehouse Operations</p>
              <h2>RTO Processing Bay</h2>
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
              Scan returned AWB to initiate QA grading and inventory restock workflow.
            </p>
            <input 
              type="text" 
              placeholder="Scan Barcode / AWB..." 
              style={{ width: '100%', padding: '0.8rem', fontFamily: 'monospace', border: '2px solid #000', fontSize: '1rem', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ flex: 1, padding: '0.8rem', background: '#176b2c', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Grade: Pass (Restock)</button>
              <button style={{ flex: 1, padding: '0.8rem', background: '#d50000', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Grade: Fail (Scrap)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
