'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function CACStrategyPage() {
  const [budgets, setBudgets] = useState({
    meta: 5000,
    google: 3000,
    tiktok: 1500,
    email: 500,
  });

  // Simple mock algorithm to project results based on sliding budgets
  const getProjections = () => {
    const totalSpend = budgets.meta + budgets.google + budgets.tiktok + budgets.email;
    
    // Diminishing returns mock logic
    const metaCustomers = Math.floor(budgets.meta / 40 * (1 - (budgets.meta/20000)));
    const googleCustomers = Math.floor(budgets.google / 35 * (1 - (budgets.google/15000)));
    const tiktokCustomers = Math.floor(budgets.tiktok / 25 * (1 - (budgets.tiktok/10000)));
    const emailCustomers = Math.floor(budgets.email / 5); // Constant high ROAS but low volume scale
    
    const totalCustomers = metaCustomers + googleCustomers + tiktokCustomers + emailCustomers;
    const blendedCAC = totalCustomers > 0 ? (totalSpend / totalCustomers).toFixed(2) : 0;
    const projectedRevenue = totalCustomers * 135; // AOV = 135
    const projectedROAS = totalSpend > 0 ? (projectedRevenue / totalSpend).toFixed(2) : 0;

    return { totalSpend, totalCustomers, blendedCAC, projectedRevenue, projectedROAS };
  };

  const p = getProjections();

  const chartData = [
    { name: 'Meta', CAC: 40 + (budgets.meta/500), ROAS: (135 / (40 + (budgets.meta/500))).toFixed(2) },
    { name: 'Google', CAC: 35 + (budgets.google/500), ROAS: (135 / (35 + (budgets.google/500))).toFixed(2) },
    { name: 'TikTok', CAC: 25 + (budgets.tiktok/250), ROAS: (135 / (25 + (budgets.tiktok/250))).toFixed(2) },
    { name: 'Email', CAC: 5, ROAS: 27.0 },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <p className="admin-kicker">Simulation</p>
            <h2>CAC Strategy & Budget Simulator</h2>
          </div>
          <span>Interactive</span>
        </div>

        <div className="admin-grid" style={{ padding: '1.5rem', alignItems: 'stretch' }}>
          
          {/* Controls Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: '1px solid var(--gray-200)', paddingRight: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Channel Budget Allocations</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Meta Ads</label>
                  <span style={{ fontSize: '0.85rem' }}>AED {budgets.meta}</span>
                </div>
                <input type="range" min="0" max="15000" step="100" value={budgets.meta} onChange={(e) => setBudgets({...budgets, meta: Number(e.target.value)})} style={{ width: '100%' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Google Search</label>
                  <span style={{ fontSize: '0.85rem' }}>AED {budgets.google}</span>
                </div>
                <input type="range" min="0" max="15000" step="100" value={budgets.google} onChange={(e) => setBudgets({...budgets, google: Number(e.target.value)})} style={{ width: '100%' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>TikTok Ads</label>
                  <span style={{ fontSize: '0.85rem' }}>AED {budgets.tiktok}</span>
                </div>
                <input type="range" min="0" max="10000" step="100" value={budgets.tiktok} onChange={(e) => setBudgets({...budgets, tiktok: Number(e.target.value)})} style={{ width: '100%' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Retention Email</label>
                  <span style={{ fontSize: '0.85rem' }}>AED {budgets.email}</span>
                </div>
                <input type="range" min="0" max="2000" step="100" value={budgets.email} onChange={(e) => setBudgets({...budgets, email: Number(e.target.value)})} style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '1rem', background: '#f5f5f5', borderLeft: '3px solid #000' }}>
              <p style={{ fontSize: '0.8rem', color: '#333' }}>
                <strong>Model Info:</strong> Channels experience diminishing returns. As you push budget higher, marginal CAC increases. Email has high ROAS but limited scale.
              </p>
            </div>
          </div>

          {/* Projection Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--gray-200)', border: '1px solid var(--gray-200)' }}>
              <div style={{ background: '#fff', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Total Spend</span>
                <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginTop: '0.5rem' }}>AED {p.totalSpend.toLocaleString()}</strong>
              </div>
              <div style={{ background: '#fff', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Projected Revenue</span>
                <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginTop: '0.5rem' }}>AED {p.projectedRevenue.toLocaleString()}</strong>
              </div>
              <div style={{ background: '#fff', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Blended CAC</span>
                <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginTop: '0.5rem' }}>AED {p.blendedCAC}</strong>
              </div>
              <div style={{ background: '#fff', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 800 }}>Projected ROAS</span>
                <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginTop: '0.5rem', color: Number(p.projectedROAS) > 3 ? '#176b2c' : '#000' }}>{p.projectedROAS}x</strong>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Marginal CAC by Channel</h3>
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip contentStyle={{ borderRadius: '0', border: '1px solid #000' }} />
                    <Legend />
                    <Bar dataKey="CAC" fill="#000" name="Projected CAC (AED)" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
