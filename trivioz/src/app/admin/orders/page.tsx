'use client';

import { useMemo, useState } from 'react';
import { AdminOrder, AdminOrderStatus } from '@/lib/adminData';
import { useStore } from '@/context/StoreContext';

type OrderFilter = 'all' | AdminOrderStatus;

const fulfillmentSteps: AdminOrder['fulfillment'][] = ['Unassigned', 'Picking', 'Packed', 'Shipped', 'Delivered'];

export default function OrdersPage() {
  const { adminOrders, setAdminOrders } = useStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderFilter>('all');
  const [selectedOrderId, setSelectedOrderId] = useState(adminOrders[0]?.id ?? '');
  const [isCreating, setIsCreating] = useState(false);
  const [draftOrder, setDraftOrder] = useState<Partial<AdminOrder>>({
    customer: '', email: '', market: 'UAE', channel: 'Web', value: 0, items: 1,
    status: 'Paid', payment: 'Captured', fulfillment: 'Unassigned', slaHours: 24
  });
  const [notice, setNotice] = useState('Order queue synced locally.');

  const orders = adminOrders;

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0];
  const openOrders = orders.filter((order) => !['Fulfilled', 'Returned'].includes(order.status));
  const riskOrders = orders.filter((order) => order.status === 'Priority' || order.status === 'Review');
  const capturedRevenue = orders
    .filter((order) => order.payment === 'Captured')
    .reduce((total, order) => total + order.value, 0);
  const averageOrderValue = orders.length
    ? orders.reduce((total, order) => total + order.value, 0) / orders.length
    : 0;

  const statusOptions = useMemo(
    () => Array.from(new Set(orders.map((order) => order.status))),
    [orders]
  );

  const filteredOrders = orders.filter((order) => {
    const matchesQuery =
      order.id.toLowerCase().includes(query.toLowerCase()) ||
      order.customer.toLowerCase().includes(query.toLowerCase()) ||
      order.email.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const updateOrder = (orderId: string, patch: Partial<AdminOrder>) => {
    setAdminOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, ...patch } : order))
    );
    setNotice(`${orderId} updated.`);
  };

  const advanceFulfillment = (order: AdminOrder) => {
    const currentIndex = fulfillmentSteps.indexOf(order.fulfillment);
    const nextFulfillment = fulfillmentSteps[Math.min(currentIndex + 1, fulfillmentSteps.length - 1)];
    const nextStatus = nextFulfillment === 'Delivered' ? 'Fulfilled' : nextFulfillment === 'Packed' ? 'Packed' : order.status;

    updateOrder(order.id, {
      fulfillment: nextFulfillment,
      status: nextStatus,
      slaHours: Math.max(0, order.slaHours - 2),
    });
  };

  const markPriority = (order: AdminOrder) => {
    updateOrder(order.id, { status: 'Priority', slaHours: Math.min(order.slaHours, 2) });
  };

  const refundOrder = (order: AdminOrder) => {
    updateOrder(order.id, { status: 'Returned', payment: 'Refunded' });
  };

  const createOrder = () => {
    const newOrder: AdminOrder = {
      id: `#TVZ-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: draftOrder.customer || 'Guest',
      email: draftOrder.email || 'guest@example.com',
      market: draftOrder.market || 'UAE',
      channel: draftOrder.channel as any || 'Web',
      value: Number(draftOrder.value) || 0,
      items: Number(draftOrder.items) || 1,
      status: draftOrder.status as any || 'Paid',
      payment: draftOrder.payment as any || 'Captured',
      fulfillment: draftOrder.fulfillment as any || 'Unassigned',
      placedAt: 'Just now',
      slaHours: Number(draftOrder.slaHours) || 24,
    };
    setAdminOrders([newOrder, ...adminOrders]);
    setIsCreating(false);
    setSelectedOrderId(newOrder.id);
    setNotice('Manual order created.');
  };

  return (
    <div className="admin-dashboard">
      <section className="admin-hero admin-hero-orders">
        <div>
          <p className="admin-kicker">Order operations</p>
          <h1>Orders</h1>
          <p>Run payment review, fulfillment progression, SLA risk, and customer order triage from one queue.</p>
        </div>
        <div className="admin-hero-actions">
          <span>{notice}</span>
          <button className="admin-button" onClick={() => setIsCreating(true)}>
            Create manual order
          </button>
        </div>
      </section>

      <section className="admin-metrics">
        <article>
          <span>Open orders</span>
          <strong>{openOrders.length}</strong>
          <small>{riskOrders.length} risk flagged</small>
        </article>
        <article>
          <span>Captured revenue</span>
          <strong>AED {capturedRevenue.toLocaleString()}</strong>
          <small>Paid orders only</small>
        </article>
        <article>
          <span>Average order</span>
          <strong>AED {averageOrderValue.toFixed(0)}</strong>
          <small>{orders.reduce((total, order) => total + order.items, 0)} items in queue</small>
        </article>
        <article>
          <span>Review needed</span>
          <strong>{orders.filter((order) => order.status === 'Review').length}</strong>
          <small>Payment or fraud checks</small>
        </article>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Fulfillment queue</p>
              <h2>Order ledger</h2>
            </div>
            <span>{filteredOrders.length} shown</span>
          </div>

          <div className="admin-filters">
            <input
              type="search"
              placeholder="Search orders, customers, email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderFilter)}>
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option value={status} key={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table admin-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Market</th>
                  <th>Value</th>
                  <th>Payment</th>
                  <th>Fulfillment</th>
                  <th>SLA</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={selectedOrder?.id === order.id && !isCreating ? 'is-selected' : ''}>
                    <td>
                      <button className="admin-product-cell" onClick={() => { setSelectedOrderId(order.id); setIsCreating(false); }}>
                        <span>
                          <strong>{order.id}</strong>
                          <small>{order.customer} / {order.channel}</small>
                        </span>
                      </button>
                    </td>
                    <td>{order.market}</td>
                    <td>AED {order.value.toFixed(2)}</td>
                    <td><span className={order.payment === 'Pending' ? 'admin-status is-risk' : 'admin-status'}>{order.payment}</span></td>
                    <td>{order.fulfillment}</td>
                    <td><span className={order.slaHours <= 5 && order.slaHours > 0 ? 'admin-stock is-low' : 'admin-stock'}>{order.slaHours || 'Done'}{order.slaHours ? 'h' : ''}</span></td>
                    <td>
                      <div className="admin-row-actions">
                        <button onClick={() => advanceFulfillment(order)}>Advance</button>
                        <button onClick={() => markPriority(order)}>Priority</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel admin-editor">
          {isCreating ? (
            <div className="admin-order-detail">
              <div className="admin-panel-header">
                <div>
                  <p className="admin-kicker">New Entry</p>
                  <h2>Create Order</h2>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <label>Customer Name<input value={draftOrder.customer} onChange={e => setDraftOrder({...draftOrder, customer: e.target.value})} /></label>
                <label>Email<input value={draftOrder.email} onChange={e => setDraftOrder({...draftOrder, email: e.target.value})} /></label>
                <label>Value (AED)<input type="number" value={draftOrder.value} onChange={e => setDraftOrder({...draftOrder, value: Number(e.target.value)})} /></label>
                <label>Items<input type="number" value={draftOrder.items} onChange={e => setDraftOrder({...draftOrder, items: Number(e.target.value)})} /></label>
                <div className="admin-order-actions" style={{ marginTop: '2rem' }}>
                  <button className="admin-button" onClick={createOrder}>Save Order</button>
                  <button onClick={() => setIsCreating(false)}>Cancel</button>
                </div>
              </div>
            </div>
          ) : selectedOrder ? (
            <div className="admin-order-detail">
              <div className="admin-panel-header">
                <div>
                  <p className="admin-kicker">Order detail</p>
                  <h2>{selectedOrder?.id ?? 'No order'}</h2>
                </div>
              </div>
              <div className="admin-detail-hero">
                <span>{selectedOrder.status}</span>
                <strong>{selectedOrder.customer}</strong>
                <small>{selectedOrder.email}</small>
              </div>
              <dl>
                <div><dt>Placed</dt><dd>{selectedOrder.placedAt}</dd></div>
                <div><dt>Market</dt><dd>{selectedOrder.market}</dd></div>
                <div><dt>Channel</dt><dd>{selectedOrder.channel}</dd></div>
                <div><dt>Items</dt><dd>{selectedOrder.items}</dd></div>
                <div><dt>Payment</dt><dd>{selectedOrder.payment}</dd></div>
                <div><dt>Fulfillment</dt><dd>{selectedOrder.fulfillment}</dd></div>
              </dl>
              <div className="admin-order-actions">
                <button className="admin-button" onClick={() => advanceFulfillment(selectedOrder)}>Advance fulfillment</button>
                <button onClick={() => markPriority(selectedOrder)}>Mark priority</button>
                <button onClick={() => refundOrder(selectedOrder)}>Refund / return</button>
              </div>
            </div>
          ) : (
            <div className="admin-order-detail">
              <p>No order selected or created.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
