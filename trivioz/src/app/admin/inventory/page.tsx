'use client';

import { useMemo, useState } from 'react';
import { Product } from '@/lib/data';
import { useStore } from '@/context/StoreContext';
import AdminLayout from '../layout';

type StockFilter = 'all' | 'low' | 'healthy' | 'out';

function emptyDraft(productsLength: number): Product {
  return {
    id: `p${productsLength + 1}`,
    name: '',
    price: 149,
    description: '',
    category: 'Girls',
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 18,
  };
}

export default function InventoryPage() {
  const { products, setProducts, adminTaxonomy, setAdminTaxonomy, adminHero, setAdminHero } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? '');
  const [draft, setDraft] = useState<Product | null>(products[0] ?? null);
  const [notice, setNotice] = useState('Inventory synced locally.');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [auditLog, setAuditLog] = useState<{time: string, action: string}[]>([
    { time: '10:42 AM', action: 'System: Initialized daily catalog sync.' }
  ]);

  const logAction = (action: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLog(prev => [{ time, action }, ...prev].slice(0, 10));
  };

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products]
  );

  const taxonomyCategories = useMemo(
    () => Array.from(new Set(adminTaxonomy.map((t) => t.name))).sort(),
    [adminTaxonomy]
  );

  const [newTaxonomy, setNewTaxonomy] = useState({ id: '', department: 'Girls', group: 'Collection', name: '' });


  const lowStockProducts = products.filter((product) => product.stock < 15 && product.stock > 0);
  const outOfStockProducts = products.filter((product) => product.stock === 0);
  const inventoryValue = products.reduce((total, product) => total + product.price * product.stock, 0);
  const averagePrice = products.length
    ? products.reduce((total, product) => total + product.price, 0) / products.length
    : 0;

  const filteredProducts = products.filter((product) => {
    const primaryImage = product.images[0];
    if (!primaryImage || brokenImages.has(primaryImage)) {
      return false;
    }

    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && product.stock < 15 && product.stock > 0) ||
      (stockFilter === 'healthy' && product.stock >= 15) ||
      (stockFilter === 'out' && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const syncSelectedProduct = (product: Product) => {
    setSelectedId(product.id);
    setDraft({ ...product, images: [...product.images], sizes: [...product.sizes] });
  };

  const updateStock = (productId: string, delta: number) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, stock: Math.max(0, product.stock + delta) } : product
      )
    );
    setDraft((current) =>
      current && current.id === productId ? { ...current, stock: Math.max(0, current.stock + delta) } : current
    );
    setNotice('Stock movement recorded.');
    logAction(`Updated stock for ${productId} by ${delta}`);
  };

  const markOutOfStock = (productId: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, stock: 0 } : product
      )
    );
    setDraft((current) =>
      current && current.id === productId ? { ...current, stock: 0 } : current
    );
    setNotice('Product zeroed out.');
    logAction(`Forced Out-of-Stock: ${productId}`);
  };

  const restockLowItems = () => {
    setProducts((current) =>
      current.map((product) => (product.stock < 15 ? { ...product, stock: product.stock + 20 } : product))
    );
    setDraft((current) => (current && current.stock < 15 ? { ...current, stock: current.stock + 20 } : current));
    setNotice('Low-stock replenishment draft applied.');
    logAction('Bulk action: Restocked all low inventory items.');
  };

  const saveDraft = () => {
    if (!draft) return;

    const finalName = draft.name.trim() || `Untitled Product ${Math.floor(Math.random() * 1000)}`;

    const normalizedDraft = {
      ...draft,
      name: finalName,
      description: draft.description.trim() || 'High-quality fashion item perfect for everyday wear.',
      images: draft.images.filter(Boolean).length ? draft.images.filter(Boolean) : emptyDraft(products.length).images,
      sizes: draft.sizes.filter(Boolean).length ? draft.sizes.filter(Boolean) : ['S', 'M', 'L'],
      price: Math.max(1, Number(draft.price)),
      stock: Math.max(0, Number(draft.stock)),
    };

    setProducts((current) => {
      const exists = current.some((product) => product.id === normalizedDraft.id);
      return exists
        ? current.map((product) => (product.id === normalizedDraft.id ? normalizedDraft : product))
        : [normalizedDraft, ...current];
    });
    setSelectedId(normalizedDraft.id);
    setDraft(normalizedDraft);
    setNotice(`${normalizedDraft.name} saved.`);
    logAction(`Saved product draft: ${normalizedDraft.name}`);
  };

  const createProduct = () => {
    const next = emptyDraft(products.length);
    syncSelectedProduct(next);
    setNotice('New product draft ready.');
  };

  const deleteProduct = (productId: string) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
    const fallback = products.find((product) => product.id !== productId) ?? null;
    setSelectedId(fallback?.id ?? '');
    setDraft(fallback);
    setNotice('Product removed from the local catalog.');
    logAction(`Deleted product: ${productId}`);
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const applyBulkDiscount = () => {
    setProducts(current => current.map(p => 
      selectedProducts.includes(p.id) ? { ...p, price: Math.floor(p.price * 0.8) } : p
    ));
    setNotice('Applied 20% clearance discount to selected items.');
    logAction(`Bulk action: Applied 20% discount to ${selectedProducts.length} items.`);
    setSelectedProducts([]);
  };

  return (
    <div className="admin-dashboard">
      <section className="admin-hero admin-hero-inventory">
        <div>
          <p className="admin-kicker">Inventory operations</p>
          <h1>Inventory</h1>
          <p>Control stock health, catalog readiness, pricing, sizing, and replenishment actions from one operating grid.</p>
        </div>
        <div className="admin-hero-actions">
          <span>{notice}</span>
          <button className="admin-button" onClick={createProduct}>New product</button>
        </div>
      </section>

      <section className="admin-metrics">
        <article>
          <span>Active styles</span>
          <strong>{products.length}</strong>
          <small>{categories.length} categories</small>
        </article>
        <article>
          <span>Inventory value</span>
          <strong>AED {inventoryValue.toLocaleString()}</strong>
          <small>Current on-hand value</small>
        </article>
        <article>
          <span>Low stock</span>
          <strong>{lowStockProducts.length}</strong>
          <small>Under 15 units</small>
        </article>
        <article>
          <span>Average price</span>
          <strong>AED {averagePrice.toFixed(0)}</strong>
          <small>{outOfStockProducts.length} out of stock</small>
        </article>
      </section>

      {draft && draft.images[0] && !brokenImages.has(draft.images[0]) && (
        <section className="admin-detail-grid">
          <article className="admin-visual-card">
            <img
              src={draft.images[0]}
              alt={draft.name || 'Selected product'}
              onError={() => setBrokenImages((prev) => new Set(prev).add(draft.images[0]))}
            />
            <div>
              <span>Selected product</span>
              <strong>{draft.name || 'New product draft'}</strong>
              <small>{draft.category} / AED {Number(draft.price).toFixed(2)} / {draft.stock} units</small>
            </div>
          </article>
          <article className="admin-ops-card">
            <span>Stock allocation</span>
            <div><b>Warehouse</b><strong>{Math.ceil(draft.stock * 0.55)}</strong></div>
            <div><b>Store reserve</b><strong>{Math.floor(draft.stock * 0.25)}</strong></div>
            <div><b>Online buffer</b><strong>{Math.max(0, draft.stock - Math.ceil(draft.stock * 0.8))}</strong></div>
          </article>
          <article className="admin-ops-card">
            <span>Catalog checks</span>
            <div><b>Images</b><strong>{draft.images.filter(Boolean).length}</strong></div>
            <div><b>Sizes</b><strong>{draft.sizes.filter(Boolean).length}</strong></div>
            <div><b>Status</b><strong>{draft.stock === 0 ? 'Hold' : draft.stock < 15 ? 'Risk' : 'Live'}</strong></div>
          </article>
        </section>
      )}

      <section className="admin-grid">
        <div className="admin-panel admin-inventory-panel" style={{ gridColumn: 'span 2', order: 2 }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Stock ledger</p>
              <h2>Product catalog</h2>
            </div>
            <div className="admin-panel-actions">
              <span>{filteredProducts.length} shown</span>
              <button onClick={restockLowItems}>Restock lows</button>
            </div>
          </div>

          <div className="admin-filters">
            <input
              type="search"
              placeholder="Search products"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>
            <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value as StockFilter)}>
              <option value="all">All stock</option>
              <option value="low">Low stock</option>
              <option value="healthy">Healthy stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>

          {selectedProducts.length > 0 && (
            <div style={{ padding: '0.8rem 1rem', background: '#000', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedProducts.length} items selected</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={applyBulkDiscount} style={{ background: '#fff', color: '#d50000', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>Mark 20% Clearance</button>
                <button style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>Export Data</button>
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
                      onChange={() => {
                        if (selectedProducts.length === filteredProducts.length) setSelectedProducts([]);
                        else setSelectedProducts(filteredProducts.map(p => p.id));
                      }}
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    />
                  </th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Readiness</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={selectedId === product.id ? 'is-selected' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                      />
                    </td>
                    <td>
                      <button className="admin-product-cell" onClick={() => syncSelectedProduct(product)}>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          onError={() => setBrokenImages((prev) => new Set(prev).add(product.images[0]))}
                        />
                        <span>
                          <strong>{product.name}</strong>
                          <small>{product.sizes.join(' / ')}</small>
                        </span>
                      </button>
                    </td>
                    <td>{product.category}</td>
                    <td>AED {product.price.toFixed(2)}</td>
                    <td>
                      <span className={product.stock < 15 ? 'admin-stock is-low' : 'admin-stock'}>
                        {product.stock} units
                      </span>
                    </td>
                    <td>
                      <span className={product.stock === 0 ? 'admin-status is-risk' : 'admin-status'}>
                        {product.stock === 0 ? 'Blocked' : product.stock < 15 ? 'Replenish' : 'Ready'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button aria-label={`Reduce ${product.name} stock`} onClick={() => updateStock(product.id, -1)}>-</button>
                        <button aria-label={`Increase ${product.name} stock`} onClick={() => updateStock(product.id, 1)}>+</button>
                        <button style={{ color: '#8b0000', fontWeight: 'bold' }} onClick={() => markOutOfStock(product.id)}>OOS</button>
                        <button onClick={() => deleteProduct(product.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="admin-panel admin-editor" style={{ gridColumn: 'span 2', order: 1 }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Product studio</p>
              <h2>{draft && products.some((product) => product.id === draft.id) ? 'Edit item' : 'Create item'}</h2>
            </div>
          </div>

          {draft && (
            <div className="admin-form">
              {draft.images[0] && !brokenImages.has(draft.images[0]) && (
                <img
                  className="admin-editor-image"
                  src={draft.images[0]}
                  alt={draft.name || 'Product preview'}
                  onError={() => setBrokenImages((prev) => new Set(prev).add(draft.images[0]))}
                  style={{ maxWidth: '240px', height: 'auto', margin: '0 auto 1.5rem', display: 'block', borderRadius: '8px', objectFit: 'cover', aspectRatio: '3/4' }}
                />
              )}
              <label>
                Image URLs (one per line)
                <textarea
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  value={draft.images.join('\n')} 
                  onChange={(event) => setDraft({ ...draft, images: event.target.value.split('\n').map(u => u.trim()).filter(Boolean) })}
                  rows={4}
                />
              </label>
              <label>
                Product name
                <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
              </label>
              <div className="admin-form-row">
                <label>
                  Category
                  <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
                    <option value="">Select Category...</option>
                    {taxonomyCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    value={draft.price}
                    onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })}
                  />
                </label>
              </div>
              <div className="admin-form-row">
                <label>
                  Stock
                  <input
                    type="number"
                    value={draft.stock}
                    onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })}
                  />
                </label>
                <label>
                  Sizes
                  <input
                    value={draft.sizes.join(', ')}
                    onChange={(event) =>
                      setDraft({ ...draft, sizes: event.target.value.split(',').map((size) => size.trim()) })
                    }
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                />
              </label>
              <button className="admin-button admin-button-wide" onClick={saveDraft}>Save product</button>
            </div>
          )}

          <div className="admin-panel-header" style={{ marginTop: '2rem', borderTop: '1px solid var(--gray-200)' }}>
            <div>
              <p className="admin-kicker">Security & Compliance</p>
              <h2>Audit Log</h2>
            </div>
          </div>
          <div style={{ padding: '1rem', fontSize: '0.8rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {auditLog.map((log, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#000' }}>{log.time}</span>
                <span>{log.action}</span>
              </div>
            ))}
          </div>

        </aside>
      </section>

      {/* Taxonomy Manager Section */}
      <section className="admin-grid" style={{ marginTop: '2rem' }}>
        <div className="admin-panel" style={{ gridColumn: 'span 4' }}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">Taxonomy Control</p>
              <h2>Storefront Navigation Links</h2>
            </div>
          </div>
          <div style={{ padding: '1.5rem', background: '#fafafa', borderBottom: '1px solid #eaeaea', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <label style={{ flex: 1 }}>Department
              <select value={newTaxonomy.department} onChange={e => setNewTaxonomy({...newTaxonomy, department: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                <option value="Girls">Girls</option>
                <option value="Boys">Boys</option>
              </select>
            </label>
            <label style={{ flex: 1 }}>Group
              <input 
                list="taxonomy-groups" 
                value={newTaxonomy.group} 
                onChange={e => setNewTaxonomy({...newTaxonomy, group: e.target.value})} 
                placeholder="e.g. Featured"
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} 
              />
              <datalist id="taxonomy-groups">
                <option value="Featured" />
                <option value="Collection" />
                <option value="Be Inspired" />
                <option value="Be Inspired Sub" />
              </datalist>
            </label>
            <label style={{ flex: 2 }}>Category Name
              <input value={newTaxonomy.name} onChange={e => setNewTaxonomy({...newTaxonomy, name: e.target.value})} placeholder="e.g. Winter Jackets" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="admin-button" onClick={() => {
                if (newTaxonomy.name.trim()) {
                  if (newTaxonomy.id) {
                    setAdminTaxonomy(adminTaxonomy.map((t: any) => t.id === newTaxonomy.id ? { ...t, ...newTaxonomy } : t));
                  } else {
                    setAdminTaxonomy([...adminTaxonomy, { ...newTaxonomy, id: 't' + Date.now() }]);
                  }
                  setNewTaxonomy({ id: '', department: 'Girls', group: 'Collection', name: '' });
                }
              }}>
                {newTaxonomy.id ? 'Save Changes' : 'Add Navigation Link'}
              </button>
              {newTaxonomy.id && (
                <button 
                  onClick={() => setNewTaxonomy({ id: '', department: 'Girls', group: 'Collection', name: '' })} 
                  style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #ccc', cursor: 'pointer', height: '100%' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Group</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminTaxonomy.map((tax, index) => (
                  <tr key={tax.id || `fallback-${index}`} onClick={() => setNewTaxonomy({ id: tax.id, department: tax.department, group: tax.group, name: tax.name })} style={{ cursor: 'pointer' }} className="hover:bg-gray-50">
                    <td><strong>{tax.department}</strong></td>
                    <td>{tax.group}</td>
                    <td><span style={{ fontWeight: tax.isBold ? 'bold' : 'normal', color: tax.isSpecial ? '#3b82f6' : 'inherit' }}>{tax.name}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => setNewTaxonomy({ 
                            id: tax.id, 
                            department: tax.department, 
                            group: tax.group, 
                            name: tax.name 
                          })}
                          style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', padding: 0 }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setAdminTaxonomy(adminTaxonomy.filter((t: any) => t.id !== tax.id))}
                          style={{ color: '#d50000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', padding: 0 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Storefront Hero Assets Settings */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Storefront Assets: Hero Split Banner</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Hero */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eaeaea' }}>Left Panel</h3>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Heading Text</label>
                <input 
                  type="text" 
                  value={adminHero?.left?.text || ''} 
                  onChange={(e) => setAdminHero({ ...adminHero, left: { ...adminHero.left, text: e.target.value } })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Image URL</label>
                <input 
                  type="text" 
                  value={adminHero?.left?.image || ''} 
                  onChange={(e) => setAdminHero({ ...adminHero, left: { ...adminHero.left, image: e.target.value } })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Target Category Link</label>
                <input 
                  type="text" 
                  value={adminHero?.left?.link || ''} 
                  onChange={(e) => setAdminHero({ ...adminHero, left: { ...adminHero.left, link: e.target.value } })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                  placeholder="e.g. Girls"
                />
              </div>
            </div>

            {/* Right Hero */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eaeaea' }}>Right Panel</h3>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Heading Text</label>
                <input 
                  type="text" 
                  value={adminHero?.right?.text || ''} 
                  onChange={(e) => setAdminHero({ ...adminHero, right: { ...adminHero.right, text: e.target.value } })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Image URL</label>
                <input 
                  type="text" 
                  value={adminHero?.right?.image || ''} 
                  onChange={(e) => setAdminHero({ ...adminHero, right: { ...adminHero.right, image: e.target.value } })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Target Category Link</label>
                <input 
                  type="text" 
                  value={adminHero?.right?.link || ''} 
                  onChange={(e) => setAdminHero({ ...adminHero, right: { ...adminHero.right, link: e.target.value } })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                  placeholder="e.g. Boys"
                />
              </div>
            </div>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>Changes are saved instantly and pushed to the live storefront.</p>
        </div>

      </div>
  );
}
