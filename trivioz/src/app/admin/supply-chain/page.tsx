'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function SupplyChainPage() {
  const { adminSupplyChain, setAdminSupplyChain } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [draftPO, setDraftPO] = useState({ vendor: '', itemCode: '', qty: 0, expected: '' });

  const pos = adminSupplyChain;

  const createPO = () => {
    const newPO = {
      ...draftPO,
      id: `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      qty: Number(draftPO.qty),
      status: 'In Production'
    };
    setAdminSupplyChain([newPO, ...adminSupplyChain]);
    setIsCreating(false);
    setDraftPO({ vendor: '', itemCode: '', qty: 0, expected: '' });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-hero admin-hero-supply">
        <div>
          <p className="admin-kicker" style={{ color: '#95a5a6' }}>Sourcing & Procurement</p>
          <h1>Supply Chain & Vendors</h1>
          <p style={{ marginTop: '0.5rem', color: '#bdc3c7' }}>Manage Purchase Orders, manufacturer lead times, and Advanced Shipping Notices (ASN).</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-panel" style={{ gridColumn: 'span 2' }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Procurement</p>
              <h2>Active Purchase Orders</h2>
            </div>
            <button className="admin-button" style={{ background: '#000', color: '#fff' }} onClick={() => setIsCreating(true)}>+ Raise New PO</button>
          </div>

          {isCreating && (
            <div style={{ padding: '1.5rem', background: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Raise Purchase Order</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label>Vendor<input value={draftPO.vendor} onChange={e => setDraftPO({...draftPO, vendor: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                <label>Item Code<input value={draftPO.itemCode} onChange={e => setDraftPO({...draftPO, itemCode: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                <label>Quantity<input type="number" value={draftPO.qty} onChange={e => setDraftPO({...draftPO, qty: Number(e.target.value)})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                <label>Expected Date<input type="date" value={draftPO.expected} onChange={e => setDraftPO({...draftPO, expected: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="admin-button" onClick={createPO}>Submit PO</button>
                <button onClick={() => setIsCreating(false)} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #ccc' }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor / Manufacturer</th>
                  <th>Master Item Code</th>
                  <th>Quantity</th>
                  <th>Expected Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pos.map((po) => (
                  <tr key={po.id}>
                    <td><strong style={{ fontFamily: 'monospace' }}>{po.id}</strong></td>
                    <td>{po.vendor}</td>
                    <td>{po.itemCode}</td>
                    <td>{po.qty.toLocaleString()}</td>
                    <td>{po.expected}</td>
                    <td>
                      <span className={po.status === 'Delayed' ? 'admin-status is-risk' : 'admin-status'}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Quality Control</p>
              <h2>Vendor Scorecards</h2>
            </div>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Luen Thai Holdings</strong>
                <span style={{ color: '#176b2c', fontWeight: 700 }}>98% SLA</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Defect rate: 0.4% | On-time delivery: High</p>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Crystal International</strong>
                <span style={{ color: '#176b2c', fontWeight: 700 }}>95% SLA</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Defect rate: 1.2% | On-time delivery: Medium</p>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Shenzhou Intl</strong>
                <span style={{ color: '#d50000', fontWeight: 700 }}>82% SLA</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Defect rate: 3.1% | On-time delivery: Needs Review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
