'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function PromotionsPage() {
  const { adminPromotions, setAdminPromotions, adminCoupons, setAdminCoupons } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [draftRule, setDraftRule] = useState({ name: '', condition: '', action: '' });
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [draftCoupon, setDraftCoupon] = useState({ code: '', discount: '', usageLimit: 100 });

  const rules = adminPromotions;
  const coupons = adminCoupons;

  const createRule = () => {
    const newRule = {
      id: `PR-${Math.floor(100 + Math.random() * 900)}`,
      name: draftRule.name || 'New Promo',
      condition: draftRule.condition || 'Always',
      action: draftRule.action || 'No Action',
      status: 'Active'
    };
    setAdminPromotions([newRule, ...adminPromotions]);
    setIsCreating(false);
    setDraftRule({ name: '', condition: '', action: '' });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-hero admin-hero-promotions">
        <div>
          <p className="admin-kicker" style={{ color: '#aaa' }}>Growth & Offers</p>
          <h1>Promotions Engine</h1>
          <p style={{ marginTop: '0.5rem', color: '#999' }}>Complex algorithmic discounting and campaign management.</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-panel" style={{ gridColumn: 'span 2' }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Logic Builder</p>
              <h2>Active Promotion Rules</h2>
            </div>
            <button className="admin-button" style={{ background: '#000', color: '#fff' }} onClick={() => setIsCreating(true)}>+ Create Rule</button>
          </div>

          {isCreating && (
            <div style={{ padding: '1.5rem', background: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Create Promotion Rule</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <label>Campaign Name<input value={draftRule.name} onChange={e => setDraftRule({...draftRule, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                <label>Conditions (IF)<input placeholder="e.g. Cart Value > 500" value={draftRule.condition} onChange={e => setDraftRule({...draftRule, condition: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', fontFamily: 'monospace' }}/></label>
                <label>Action (THEN)<input placeholder="e.g. Apply 10% Discount" value={draftRule.action} onChange={e => setDraftRule({...draftRule, action: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', fontFamily: 'monospace' }}/></label>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="admin-button" onClick={createRule}>Save Rule</button>
                <button onClick={() => setIsCreating(false)} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #ccc' }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rule ID</th>
                  <th>Campaign Name</th>
                  <th>Conditions (IF)</th>
                  <th>Action (THEN)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule: any, index: number) => (
                  <tr key={index} onContextMenu={(e) => { e.preventDefault(); setAdminPromotions(adminPromotions.filter((_: any, i: number) => i !== index)); }}>
                    <td><strong>{rule.id}</strong></td>
                    <td>{rule.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#555' }}>{rule.condition}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#555' }}>{rule.action}</td>
                    <td>
                      <span className="admin-status" style={{ background: '#edf7ef', color: '#176b2c' }}>{rule.status}</span>
                    </td>
                  </tr>
                ))}
                {rules.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>No active rules. Right-click a rule to delete it.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel" style={{ gridColumn: 'span 2' }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Attribution</p>
              <h2>Coupon Hashes</h2>
            </div>
            <button style={{ textDecoration: 'underline', fontSize: '0.8rem', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => setIsCreatingCoupon(true)}>+ Generate</button>
          </div>
          {isCreatingCoupon && (
            <div style={{ padding: '1rem', background: '#f9f9f9', borderBottom: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <input placeholder="Coupon Code (e.g. SUMMER20)" value={draftCoupon.code} onChange={e => setDraftCoupon({...draftCoupon, code: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <input placeholder="Discount (e.g. 20% OFF)" value={draftCoupon.discount} onChange={e => setDraftCoupon({...draftCoupon, discount: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Usage Limit" value={draftCoupon.usageLimit} onChange={e => setDraftCoupon({...draftCoupon, usageLimit: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="admin-button" onClick={() => {
                    if (draftCoupon.code) {
                      setAdminCoupons([...adminCoupons, { code: draftCoupon.code, discount: draftCoupon.discount, usageLimit: draftCoupon.usageLimit, used: 0 }]);
                      setDraftCoupon({ code: '', discount: '', usageLimit: 100 });
                      setIsCreatingCoupon(false);
                    }
                  }}>Save</button>
                  <button onClick={() => setIsCreatingCoupon(false)} style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#666' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Offer</th>
                  <th>Usage</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c: any, index: number) => (
                  <tr key={index} onContextMenu={(e) => { e.preventDefault(); setAdminCoupons(adminCoupons.filter((_: any, i: number) => i !== index)); }}>
                    <td><strong>{c.code}</strong></td>
                    <td>{c.discount}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, background: '#eee', height: '4px', borderRadius: '2px' }}>
                          <div style={{ background: '#000', height: '100%', width: `${(c.used / c.usageLimit) * 100}%` }} />
                        </div>
                        <span style={{ fontSize: '0.7rem' }}>{c.used}/{c.usageLimit}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', color: '#888', fontSize: '0.8rem' }}>No coupons active. Right-click to delete.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
