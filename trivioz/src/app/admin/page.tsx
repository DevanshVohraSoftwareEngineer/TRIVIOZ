'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const { products, adminOrders, adminTasks, setAdminTasks, adminChannels, setAdminChannels, adminSalesHistory } = useStore();
  const [newTask, setNewTask] = useState({ title: '', owner: '', impact: '' });
  const [newChannel, setNewChannel] = useState({ name: '', revenue: 0, orders: 0, conversion: '' });
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  const inventoryValue = products.reduce((total, product) => total + product.price * product.stock, 0);
  const lowStockProducts = products.filter((product) => product.stock < 15);
  const openOrders = adminOrders.filter((order) => !['Fulfilled', 'Returned'].includes(order.status));
  const revenueToday = adminOrders.reduce((total, order) => total + order.value, 0);
  const topCategory = Array.from(new Set(products.map((product) => product.category)))
    .map((category) => ({
      name: category,
      count: products.filter((product) => product.category === category).length,
    }))
    .sort((a, b) => b.count - a.count)[0];

  const totalInventoryUnits = products.reduce((total, product) => total + product.stock, 0);
  const totalItemsSold = adminOrders.length; // Approximating 1 item per order for this basic calc
  const sellThrough = (totalItemsSold + totalInventoryUnits) > 0 ? Math.round((totalItemsSold / (totalItemsSold + totalInventoryUnits)) * 100) : 0;
  
  const totalFulfilled = adminOrders.filter(o => o.status === 'Fulfilled').length;
  const fulfillmentSla = adminOrders.length > 0 ? Math.round((totalFulfilled / adminOrders.length) * 100) : 100;

  return (
    <div className="admin-dashboard">
      <section className="admin-hero admin-hero-dashboard">
        <div>
          <p className="admin-kicker">Enterprise control room</p>
          <h1>Dashboard</h1>
          <p>
            A single operating view for revenue, fulfillment, inventory health, and the highest-priority store actions.
          </p>
        </div>
        <div className="admin-hero-actions">
          <span>Live data workspace</span>
          <Link className="admin-button" href="/admin/inventory">Manage inventory</Link>
        </div>
      </section>

      <section className="admin-metrics">
        <article>
          <span>Today revenue</span>
          <strong>AED {revenueToday.toLocaleString()}</strong>
          <small>Across {adminOrders.length} demo orders</small>
        </article>
        <article>
          <span>Open orders</span>
          <strong>{openOrders.length}</strong>
          <small>{openOrders.filter((order) => order.slaHours <= 5).length} need urgent action</small>
        </article>
        <article>
          <span>Inventory value</span>
          <strong>AED {inventoryValue.toLocaleString()}</strong>
          <small>{products.length} active styles</small>
        </article>
        <article>
          <span>Low-stock risk</span>
          <strong>{lowStockProducts.length}</strong>
          <small>Top category: {topCategory?.name ?? 'None'}</small>
        </article>
      </section>

      <section className="admin-overview-grid">
        <div className="admin-panel admin-command-panel">
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Revenue</p>
              <h2>Sales Overview</h2>
            </div>
            <span>Last 7 months</span>
          </div>
          <div style={{ padding: '1rem', height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminSalesHistory} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '0', border: '1px solid #000' }} />
                <Area type="monotone" dataKey="revenue" stroke="#000" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="admin-health-grid">
            <article>
              <span>Sell-through</span>
              <strong>{sellThrough}%</strong>
              <div><i style={{ width: `${sellThrough}%` }} /></div>
              <small>Calculated from live inventory & orders</small>
            </article>
            <article>
              <span>Fulfillment SLA</span>
              <strong>{fulfillmentSla}%</strong>
              <div><i style={{ width: `${fulfillmentSla}%` }} /></div>
              <small>Based on fulfilled vs open orders</small>
            </article>
            <article>
              <span>Margin signal</span>
              <strong>42%</strong>
              <div><i style={{ width: '42%' }} /></div>
              <small>Standard global markup</small>
            </article>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Action center</p>
              <h2>Priority work</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span>{adminTasks.length} tasks</span>
              <button className="admin-button" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#000', color: '#fff' }} onClick={() => setIsCreatingTask(true)}>+ Task</button>
            </div>
          </div>
          {isCreatingTask && (
            <div style={{ padding: '1rem', background: '#f9f9f9', borderBottom: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <input placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <input placeholder="Owner (e.g. Care)" value={newTask.owner} onChange={e => setNewTask({...newTask, owner: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <input placeholder="Impact (e.g. AED 1.6K)" value={newTask.impact} onChange={e => setNewTask({...newTask, impact: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="admin-button" onClick={() => {
                    if (newTask.title && newTask.owner) {
                      setAdminTasks([...adminTasks, newTask]);
                      setNewTask({ title: '', owner: '', impact: '' });
                      setIsCreatingTask(false);
                    }
                  }}>Save</button>
                  <button onClick={() => setIsCreatingTask(false)} style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#666' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          <div className="admin-task-list">
            {adminTasks.map((task: any, index: number) => (
              <button key={index} onContextMenu={(e) => { e.preventDefault(); setAdminTasks(adminTasks.filter((_: any, i: number) => i !== index)); }}>
                <span>
                  <strong>{task.title}</strong>
                  <small>{task.owner}</small>
                </span>
                <b>{task.impact}</b>
              </button>
            ))}
          </div>
          
          <div className="admin-panel-header" style={{ borderTop: '1px solid var(--gray-200)' }}>
            <div>
              <p className="admin-kicker">Live</p>
              <h2>Real-time Feed</h2>
            </div>
            <span style={{ color: '#ff0000', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'red' }}></div> Active</span>
          </div>
          <div className="admin-order-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {adminOrders.map((order) => (
               <div key={order.id}>
                 <span>
                   <strong>{order.id}</strong>
                   <small>{order.placedAt}</small>
                 </span>
                 <b>AED {order.value}</b>
               </div>
            ))}
          </div>

        </div>
      </section>

      <section className="admin-detail-grid">
        <article className="admin-visual-card">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop"
            alt="Editorial product merchandising"
          />
          <div>
            <span>Merchandising focus</span>
            <strong>Festival edit readiness</strong>
            <small>38 styles checked / 11 need stock depth</small>
          </div>
        </article>
        <article className="admin-ops-card">
          <span>Operations board</span>
          <div>
            <b>Picking</b>
            <strong>{adminOrders.filter((order) => order.fulfillment === 'Picking').length}</strong>
          </div>
          <div>
            <b>Packed</b>
            <strong>{adminOrders.filter((order) => order.fulfillment === 'Packed').length}</strong>
          </div>
          <div>
            <b>Unassigned</b>
            <strong>{adminOrders.filter((order) => order.fulfillment === 'Unassigned').length}</strong>
          </div>
        </article>
        <article className="admin-ops-card">
          <span>Risk controls</span>
          <div>
            <b>Payment pending</b>
            <strong>{adminOrders.filter((order) => order.payment === 'Pending').length}</strong>
          </div>
          <div>
            <b>Low stock</b>
            <strong>{lowStockProducts.length}</strong>
          </div>
          <div>
            <b>Returns</b>
            <strong>{adminOrders.filter((order) => order.status === 'Returned').length}</strong>
          </div>
        </article>
      </section>

      <section className="admin-tools-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Sales channels</p>
              <h2>Performance</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span>Today</span>
              <button className="admin-button" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#000', color: '#fff' }} onClick={() => setIsCreatingChannel(true)}>+ Add Channel</button>
            </div>
          </div>
          {isCreatingChannel && (
            <div style={{ padding: '1rem', background: '#f9f9f9', borderBottom: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <input placeholder="Channel Name" value={newChannel.name} onChange={e => setNewChannel({...newChannel, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Revenue Amount" value={newChannel.revenue || ''} onChange={e => setNewChannel({...newChannel, revenue: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Order Count" value={newChannel.orders || ''} onChange={e => setNewChannel({...newChannel, orders: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <input placeholder="Conversion (e.g. 4.8%)" value={newChannel.conversion} onChange={e => setNewChannel({...newChannel, conversion: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="admin-button" onClick={() => {
                    if (newChannel.name) {
                      setAdminChannels([...adminChannels, newChannel]);
                      setNewChannel({ name: '', revenue: 0, orders: 0, conversion: '' });
                      setIsCreatingChannel(false);
                    }
                  }}>Save</button>
                  <button onClick={() => setIsCreatingChannel(false)} style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#666' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          <div className="admin-channel-list">
            {adminChannels.map((channel: any, index: number) => (
              <article key={index} onContextMenu={(e) => { e.preventDefault(); setAdminChannels(adminChannels.filter((_: any, i: number) => i !== index)); }}>
                <span>{channel.name}</span>
                <strong>AED {channel.revenue.toLocaleString()}</strong>
                <small>{channel.orders} orders / {channel.conversion} conversion</small>
              </article>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Fulfillment</p>
              <h2>Order pulse</h2>
            </div>
            <Link href="/admin/orders">Open orders</Link>
          </div>
          <div className="admin-order-list">
            {adminOrders.slice(0, 4).map((order) => (
              <div key={order.id}>
                <span>
                  <strong>{order.id}</strong>
                  <small>{order.customer}</small>
                </span>
                <b>AED {order.value}</b>
                <em>{order.status}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Replenishment</p>
              <h2>Low-stock queue</h2>
            </div>
            <Link href="/admin/inventory">Review</Link>
          </div>
          <div className="admin-low-stock">
            {lowStockProducts.slice(0, 5).map((product) => (
              <Link key={product.id} href="/admin/inventory">
                <span>{product.name}</span>
                <strong>{product.stock}</strong>
              </Link>
            ))}
            {lowStockProducts.length === 0 && <p>All inventory is healthy.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
