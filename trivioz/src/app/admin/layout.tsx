'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useStore } from '@/context/StoreContext';

const navItems: { href: string; label: string; disabled?: boolean }[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/live-sale', label: 'Live Sale' },
  { href: '/admin/launchpad', label: 'Launchpad' },
  { href: '/admin/promotions', label: 'Promotions' },
  { href: '/admin/inventory', label: 'Inventory (PIM)' },
  { href: '/admin/supply-chain', label: 'Supply Chain' },
  { href: '/admin/logistics', label: 'Logistics' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/shop" className="admin-wordmark">TRIVIOZ</Link>
        <div className="admin-sidebar-title">
          <span>Admin suite</span>
          <strong>Fashion commerce</strong>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            item.disabled ? (
              <span key={item.label} className="is-disabled">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                key={item.label}
                className={pathname === item.href ? 'is-active' : ''}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span>Signed in</span>
          <strong>{user.email}</strong>
          <button onClick={() => { logout(); router.push('/'); }}>Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>Live workspace</span>
            <strong>Store operations</strong>
          </div>
          <Link href="/shop">View storefront</Link>
        </header>
        {children}
      </main>
    </div>
  );
}
