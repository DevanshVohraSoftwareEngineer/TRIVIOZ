'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function SettingsPage() {
  const { adminWebhooks, setAdminWebhooks, adminRoles, setAdminRoles, adminApiKey, setAdminApiKey } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [draftHook, setDraftHook] = useState({ url: '', events: '' });
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', desc: '', users: 0 });

  const webhooks = adminWebhooks;

  const createWebhook = () => {
    const newHook = {
      id: `wh_${Math.floor(1000 + Math.random() * 9000)}`,
      url: draftHook.url || 'https://api.example.com/webhook',
      events: draftHook.events || 'all',
      active: true
    };
    setAdminWebhooks([newHook, ...adminWebhooks]);
    setIsCreating(false);
    setDraftHook({ url: '', events: '' });
  };

  const rollApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newKey = 'sk_live_51M';
    for (let i = 0; i < 24; i++) {
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminApiKey(newKey);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-hero admin-hero-settings">
        <div>
          <p className="admin-kicker" style={{ color: '#aaa' }}>System & Infrastructure</p>
          <h1>Settings & Integrations</h1>
          <p style={{ marginTop: '0.5rem', color: '#ccc' }}>Role-Based Access Control, API Keys, and Webhook configuration.</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-panel" style={{ gridColumn: 'span 2' }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Access Management</p>
              <h2>Role-Based Access Control (RBAC)</h2>
            </div>
            <button style={{ textDecoration: 'underline', fontSize: '0.8rem', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => setIsCreatingRole(true)}>+ Add Role</button>
          </div>
          {isCreatingRole && (
            <div style={{ padding: '1rem', background: '#f9f9f9', borderBottom: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <input placeholder="Role Name" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <input placeholder="Role Description" value={newRole.desc} onChange={e => setNewRole({...newRole, desc: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Number of Users Assigned" value={newRole.users || ''} onChange={e => setNewRole({...newRole, users: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="admin-button" onClick={() => {
                    if (newRole.name) {
                      setAdminRoles([...adminRoles, newRole]);
                      setNewRole({ name: '', desc: '', users: 0 });
                      setIsCreatingRole(false);
                    }
                  }}>Save</button>
                  <button onClick={() => setIsCreatingRole(false)} style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#666' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {adminRoles.map((role: any, index: number) => (
              <div key={index} style={{ background: '#fafafa', padding: '1rem', border: '1px solid #eee' }} onContextMenu={(e) => { e.preventDefault(); setAdminRoles(adminRoles.filter((_: any, i: number) => i !== index)); }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{role.name}</strong>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>{role.desc}</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>{role.users} Users Assigned</div>
              </div>
            ))}
            {adminRoles.length === 0 && <p style={{ fontSize: '0.8rem', color: '#666' }}>No roles defined. Right-click a role to delete.</p>}
          </div>
        </div>

        <div className="admin-panel" style={{ gridColumn: 'span 2' }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Developer Tools</p>
              <h2>API & Webhooks</h2>
            </div>
            <button className="admin-button" style={{ background: '#000', color: '#fff' }} onClick={() => setIsCreating(true)}>+ Add Endpoint</button>
          </div>

          {isCreating && (
            <div style={{ padding: '1.5rem', background: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Register Webhook</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <label>Payload URL<input value={draftHook.url} onChange={e => setDraftHook({...draftHook, url: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
                <label>Events to Subscribe<input value={draftHook.events} onChange={e => setDraftHook({...draftHook, events: e.target.value})} placeholder="e.g. order.created" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="admin-button" onClick={createWebhook}>Save Webhook</button>
                <button onClick={() => setIsCreating(false)} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #ccc' }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Endpoint ID</th>
                  <th>Payload URL</th>
                  <th>Events</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((wh: any, index: number) => (
                  <tr key={index} onContextMenu={(e) => { e.preventDefault(); setAdminWebhooks(adminWebhooks.filter((_: any, i: number) => i !== index)); }}>
                    <td><strong style={{ fontFamily: 'monospace' }}>{wh.id}</strong></td>
                    <td style={{ fontSize: '0.8rem', color: '#555', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wh.url}</td>
                    <td style={{ fontSize: '0.8rem' }}>{wh.events}</td>
                    <td>
                      <button 
                        style={{ 
                          padding: '4px 8px', 
                          backgroundColor: wh.active ? '#edf7ef' : '#f2f2f2',
                          color: wh.active ? '#176b2c' : '#555',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          border: 'none'
                        }}
                      >
                        {wh.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                ))}
                {webhooks.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>No webhooks configured.</td></tr>}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '1.5rem', borderTop: '1px solid #eee' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Active API Keys</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#000', color: '#fff', padding: '0.8rem 1rem', gap: '1rem' }}>
              <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{adminApiKey}</span>
              <button onClick={rollApiKey} style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '2px 8px', fontSize: '0.75rem', flexShrink: 0, cursor: 'pointer' }}>Roll Key</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
