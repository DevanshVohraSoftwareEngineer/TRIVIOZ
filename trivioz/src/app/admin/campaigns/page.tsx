'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function CampaignsPage() {
  const { adminCampaigns, setAdminCampaigns } = useStore();
  const campaigns = adminCampaigns;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSpend, setEditSpend] = useState<number>(0);
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', spend: 0, revenue: 0 });

  const toggleStatus = (id: string) => {
    setAdminCampaigns(campaigns.map((c: any) => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c
    ));
  };

  const startEdit = (id: string, spend: number) => {
    setEditingId(id);
    setEditSpend(spend);
  };

  const saveEdit = (id: string) => {
    setAdminCampaigns(campaigns.map((c: any) => {
      if (c.id === id) {
        // Mock ROAS recalculation based on new spend
        const newRoas = c.revenue > 0 ? (c.revenue / editSpend).toFixed(2) : 0;
        return { ...c, spend: editSpend, roas: Number(newRoas) };
      }
      return c;
    }));
    setEditingId(null);
  };
  return (
    <div className="admin-dashboard">
      <div className="admin-hero admin-hero-campaigns">
        <div>
          <p className="admin-kicker" style={{ color: '#aaa' }}>Marketing</p>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Campaign Control</h1>
        </div>
        <div className="admin-hero-actions">
          <button className="admin-button" style={{ background: '#fff', color: '#000' }} onClick={() => setIsCreating(true)}>+ New Campaign</button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Active & Recent Campaigns</h2>
          </div>
          <span>Updated Now</span>
        </div>

        {isCreating && (
          <div style={{ padding: '1rem', background: '#f9f9f9', borderBottom: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <input placeholder="Campaign Name" value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
              <input type="number" placeholder="Initial Spend (AED)" value={newCampaign.spend || ''} onChange={e => setNewCampaign({...newCampaign, spend: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
              <input type="number" placeholder="Tracked Revenue (AED)" value={newCampaign.revenue || ''} onChange={e => setNewCampaign({...newCampaign, revenue: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="admin-button" onClick={() => {
                if (newCampaign.name) {
                  const newRoas = newCampaign.spend > 0 ? (newCampaign.revenue / newCampaign.spend).toFixed(2) : 0;
                  setAdminCampaigns([...adminCampaigns, { id: `CAMP-${Math.floor(100+Math.random()*900)}`, name: newCampaign.name, status: 'Active', spend: newCampaign.spend, revenue: newCampaign.revenue, roas: Number(newRoas) }]);
                  setNewCampaign({ name: '', spend: 0, revenue: 0 });
                  setIsCreating(false);
                }
              }}>Save Campaign</button>
              <button onClick={() => setIsCreating(false)} style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#666' }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Campaign Name</th>
                <th>Status</th>
                <th>Spend (AED)</th>
                <th>Revenue (AED)</th>
                <th>ROAS</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp: any, index: number) => (
                <tr key={index} onContextMenu={(e) => { e.preventDefault(); setAdminCampaigns(adminCampaigns.filter((_: any, i: number) => i !== index)); }}>
                  <td><strong>{camp.id}</strong></td>
                  <td>{camp.name}</td>
                  <td>
                    <button 
                      onClick={() => toggleStatus(camp.id)}
                      style={{ 
                        display: 'inline-block',
                        padding: '4px 8px', 
                        backgroundColor: camp.status === 'Active' ? '#edf7ef' : '#f2f2f2',
                        color: camp.status === 'Active' ? '#176b2c' : '#555',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        border: '1px solid transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {camp.status}
                    </button>
                  </td>
                  <td>
                    {editingId === camp.id ? (
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <input 
                          type="number" 
                          value={editSpend} 
                          onChange={(e) => setEditSpend(Number(e.target.value))}
                          style={{ width: '80px', padding: '2px', border: '1px solid #000' }}
                        />
                        <button onClick={() => saveEdit(camp.id)} style={{ padding: '2px 6px', background: '#000', color: '#fff', fontSize: '0.7rem' }}>Save</button>
                      </div>
                    ) : (
                      <span onClick={() => startEdit(camp.id, camp.spend)} style={{ cursor: 'pointer', borderBottom: '1px dashed #999' }}>
                        {camp.spend.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td><strong>{camp.revenue.toLocaleString()}</strong></td>
                  <td>
                    <span style={{ color: camp.roas > 3 ? '#176b2c' : 'inherit', fontWeight: camp.roas > 3 ? 800 : 400 }}>
                      {camp.roas}x
                    </span>
                  </td>
                  <td>
                    <button onClick={() => startEdit(camp.id, camp.spend)} style={{ textDecoration: 'underline', fontSize: '0.75rem', fontWeight: 600 }}>Edit Budget</button>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>No active campaigns. Right-click a campaign to delete.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
