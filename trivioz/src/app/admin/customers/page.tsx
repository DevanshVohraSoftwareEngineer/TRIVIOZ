'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function CustomersPage() {
  const { adminCustomers, setAdminCustomers } = useStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [draftCustomer, setDraftCustomer] = useState<any>({
    name: '', email: '', segment: 'New', ltv: 0, risk: 'Low'
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === adminCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(adminCustomers.map(c => c.id));
    }
  };

  const createCustomer = () => {
    const newCustomer = {
      id: `C-${Math.floor(1000 + Math.random() * 9000)}`,
      name: draftCustomer.name || 'Anonymous',
      email: draftCustomer.email || 'no-email@example.com',
      segment: draftCustomer.segment || 'New',
      ltv: Number(draftCustomer.ltv) || 0,
      lastOrder: new Date().toISOString().split('T')[0],
      risk: draftCustomer.risk || 'Low'
    };
    setAdminCustomers([newCustomer, ...adminCustomers]);
    setIsCreating(false);
    setDraftCustomer({ name: '', email: '', segment: 'New', ltv: 0, risk: 'Low' });
  };
  return (
    <div className="admin-dashboard">
      <div className="admin-panel">
        <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="admin-kicker">CRM</p>
            <h2>Customer Segments</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Total: {adminCustomers.length}</span>
            <button className="admin-button" onClick={() => setIsCreating(true)}>Add Customer</button>
          </div>
        </div>

        {isCreating && (
          <div style={{ padding: '2rem', background: '#f9f9f9', borderBottom: '1px solid #eaeaea', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Register New Customer</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label>Name<input value={draftCustomer.name} onChange={e => setDraftCustomer({...draftCustomer, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
              <label>Email<input value={draftCustomer.email} onChange={e => setDraftCustomer({...draftCustomer, email: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
              <label>Segment
                <select value={draftCustomer.segment} onChange={e => setDraftCustomer({...draftCustomer, segment: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                  <option>New</option><option>Regular</option><option>VIP</option><option>At Risk</option>
                </select>
              </label>
              <label>LTV (AED)<input type="number" value={draftCustomer.ltv} onChange={e => setDraftCustomer({...draftCustomer, ltv: Number(e.target.value)})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}/></label>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button className="admin-button" onClick={createCustomer}>Save Customer</button>
              <button onClick={() => setIsCreating(false)} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #ccc' }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="admin-filters">
          <input type="text" placeholder="Search by name or email" />
          <select>
            <option value="all">All Segments</option>
            <option value="vip">VIP</option>
            <option value="new">New</option>
            <option value="at-risk">At Risk</option>
          </select>
          <select>
            <option value="ltv-desc">Highest LTV</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div style={{ padding: '0.8rem 1rem', background: '#000', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedIds.length} customers selected</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ background: '#fff', color: '#000', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>Add to Segment</button>
              <button style={{ background: '#fff', color: '#000', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>Email Campaign</button>
              <button style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>Export</button>
            </div>
          </div>
        )}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === adminCustomers.length && adminCustomers.length > 0} 
                    onChange={toggleAll}
                  />
                </th>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Segment</th>
                <th>LTV (AED)</th>
                <th>Last Order</th>
                <th>Risk Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {adminCustomers.map((customer) => (
                <tr key={customer.id} style={{ background: selectedIds.includes(customer.id) ? '#fafafa' : 'transparent' }}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(customer.id)}
                      onChange={() => toggleSelect(customer.id)}
                    />
                  </td>
                  <td><strong>{customer.id}</strong></td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: customer.segment === 'VIP' ? '#000' : '#f5f5f5',
                      color: customer.segment === 'VIP' ? '#fff' : '#000',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {customer.segment}
                    </span>
                  </td>
                  <td><strong>{customer.ltv.toLocaleString()}</strong></td>
                  <td>{customer.lastOrder}</td>
                  <td>
                    <span style={{ color: customer.risk === 'High' ? '#ff0000' : 'inherit' }}>
                      {customer.risk}
                    </span>
                  </td>
                  <td><a href="#" style={{ textDecoration: 'underline', fontSize: '0.75rem', fontWeight: 600 }}>View Profile</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
