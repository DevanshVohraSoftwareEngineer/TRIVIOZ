export type AdminOrderStatus = 'Paid' | 'Packed' | 'Priority' | 'Review' | 'Fulfilled' | 'Returned';

export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  market: string;
  channel: 'Web' | 'App' | 'Marketplace';
  value: number;
  items: number;
  status: AdminOrderStatus;
  payment: 'Captured' | 'Pending' | 'Refunded';
  fulfillment: 'Unassigned' | 'Picking' | 'Packed' | 'Shipped' | 'Delivered';
  placedAt: string;
  slaHours: number;
};

export const adminOrders: AdminOrder[] = [];

export const adminChannels: any[] = [];
export const adminTasks: any[] = [];
export const adminSalesHistory: any[] = [];
export const adminCohorts: any[] = [];
export const adminRegionalSales: any[] = [];
export const adminLtvCacTrend: any[] = [];
