'use client';

import { useStore } from '@/context/StoreContext';
import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ProductGridProps {
  category?: string;
  searchQuery?: string;
}

export default function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const { products, addToCart, addToWishlist, wishlist, removeFromWishlist, t, globalDiscount } = useStore();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  
  // View mode
  const [view4, setView4] = useState(false);
  
  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'under100' | '100to200' | 'over200'>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'inStock'>('all');

  // Compute displayed products based on category, search, and filters
  const displayedProducts = useMemo(() => {
    let filtered = products;

    // 1. Category
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // 2. Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    // 3. Price Filter
    if (priceFilter === 'under100') {
      filtered = filtered.filter(p => p.price < 100);
    } else if (priceFilter === '100to200') {
      filtered = filtered.filter(p => p.price >= 100 && p.price <= 200);
    } else if (priceFilter === 'over200') {
      filtered = filtered.filter(p => p.price > 200);
    }

    // 4. Size Filter
    if (sizeFilter !== 'all') {
      filtered = filtered.filter(p => p.sizes.includes(sizeFilter));
    }

    // 5. Availability Filter
    if (availabilityFilter === 'inStock') {
      filtered = filtered.filter(p => p.stock > 0);
    }

    return filtered;
  }, [products, category, searchQuery, priceFilter, sizeFilter, availabilityFilter]);

  const title = searchQuery ? `Search Results for "${searchQuery}"` : (category || t('trendingNow'));
  const isFilteredView = !!category || !!searchQuery;

  // Render blank state for category if no inventory
  if (isFilteredView && displayedProducts.length === 0 && !searchQuery && priceFilter === 'all' && sizeFilter === 'all' && availabilityFilter === 'all') {
    return (
      <div className="container" style={{ padding: '4rem 2rem', paddingTop: '10rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem' }}>{title}</h1>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 2rem', paddingTop: isFilteredView ? '10rem' : '4rem', minHeight: isFilteredView ? '80vh' : 'auto', position: 'relative' }}>
      
      {/* Header section: Title and Controls */}
      {isFilteredView ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div style={{ flex: 1 }}></div>
          <h3 className="text-sm" style={{ flex: 1, textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>{title}</h3>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>
            <span onClick={() => setView4(!view4)} style={{ cursor: 'pointer', borderBottom: '1px solid #000' }}>
              {view4 ? 'View 2' : 'View 4'}
            </span>
            <span onClick={() => setIsFilterOpen(true)} style={{ cursor: 'pointer', borderBottom: '1px solid #000' }}>Filter</span>
          </div>
        </div>
      ) : (
        <h3 className="uppercase font-bold text-xl mb-8" style={{ marginBottom: '2rem' }}>{title}</h3>
      )}

      {/* Zero results message for search or aggressive filtering */}
      {displayedProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
          No products found matching your criteria. Try adjusting your filters or search term.
        </div>
      )}
      
      {/* Product Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(auto-fill, minmax(${view4 ? '180px' : '300px'}, 1fr))`, 
        gap: view4 ? '1rem' : '2rem' 
      }}>
        {displayedProducts.map((product) => {
          const primaryImage = product.images[0];
          const hoverImage = product.images[1];
          const primaryImageFailed = !primaryImage || brokenImages.has(primaryImage);
          const currentImage =
            hoveredProduct === product.id && hoverImage && !brokenImages.has(hoverImage)
              ? hoverImage
              : primaryImage;

          if (primaryImageFailed) return null;
          const imageSrc = currentImage || primaryImage;
          if (!imageSrc) return null;

          return (
            <div
              key={product.id}
              className="flex flex-col animate-fade-in"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{ position: 'relative' }}
            >
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: 'var(--gray-100)' }}>
                <Link href={`/product/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                  <img
                    src={imageSrc}
                    alt={product.name}
                    onError={() => setBrokenImages((prev) => new Set(prev).add(imageSrc))}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                </Link>
                
                {product.stock === 0 && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <span style={{ background: '#000', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>OUT OF STOCK</span>
                  </div>
                )}

                {/* Wishlist Icon */}
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (wishlist.some(w => w.id === product.id)) {
                      removeFromWishlist(product.id);
                    } else {
                      addToWishlist(product);
                    }
                  }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10, padding: '0.5rem' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlist.some(w => w.id === product.id) ? "#000" : "none"} stroke="#000" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                {hoveredProduct === product.id && product.stock > 0 && !view4 && (
                  <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.85)', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: '#000' }}>{t('quickAdd') || 'Quick Add'}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            addToCart(product, size); 
                            alert(`Added ${product.name} (Size: ${size}) to bag!`);
                          }}
                          style={{ border: '1px solid #000', padding: '0.3rem', fontSize: '0.75rem', minWidth: '35px', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 500 }}
                          className="hover:bg-black hover:text-white transition-colors"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-start" style={{ marginTop: '1rem' }}>
                <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}>
                  <h4 className="font-medium" style={{ fontSize: view4 ? '0.8rem' : '0.875rem' }}>{product.name}</h4>
                  <div style={{ fontSize: view4 ? '0.75rem' : '0.875rem', color: 'var(--gray-500)', display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                    {globalDiscount > 0 ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: '#999' }}>AED {product.price.toFixed(2)}</span>
                        <span style={{ color: '#d50000', fontWeight: 700 }}>AED {(product.price * (1 - globalDiscount / 100)).toFixed(2)}</span>
                      </>
                    ) : (
                      <span>AED {product.price.toFixed(2)}</span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Sidebar Overlay */}
      {isFilterOpen && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000 }} 
            onClick={() => setIsFilterOpen(false)}
          />
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            right: 0, 
            bottom: 0, 
            width: '100%', 
            maxWidth: '350px', 
            backgroundColor: '#fff', 
            zIndex: 10001,
            padding: '2rem',
            overflowY: 'auto',
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase' }}>Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>Price</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['all', 'under100', '100to200', 'over200'].map((opt) => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceFilter === opt} 
                      onChange={() => setPriceFilter(opt as any)} 
                    />
                    {opt === 'all' ? 'All Prices' : opt === 'under100' ? 'Under 100 AED' : opt === '100to200' ? '100 - 200 AED' : 'Over 200 AED'}
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>Size</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['all', 'XS', 'S', 'M', 'L', 'XL'].map((s) => (
                  <button 
                    key={s}
                    onClick={() => setSizeFilter(s)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      border: sizeFilter === s ? '2px solid #000' : '1px solid #eaeaea', 
                      backgroundColor: sizeFilter === s ? '#000' : '#fff', 
                      color: sizeFilter === s ? '#fff' : '#000',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      minWidth: '40px'
                    }}
                  >
                    {s === 'all' ? 'All' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>Availability</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input 
                    type="radio" 
                    name="availability" 
                    checked={availabilityFilter === 'all'} 
                    onChange={() => setAvailabilityFilter('all')} 
                  />
                  Show All
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input 
                    type="radio" 
                    name="availability" 
                    checked={availabilityFilter === 'inStock'} 
                    onChange={() => setAvailabilityFilter('inStock')} 
                  />
                  In Stock Only
                </label>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
              <button 
                onClick={() => { setPriceFilter('all'); setSizeFilter('all'); setAvailabilityFilter('all'); }}
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem' }}
              >
                Clear Filters
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                style={{ width: '100%', padding: '1rem', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}
              >
                View {displayedProducts.length} Results
              </button>
            </div>
            
          </div>
        </>
      )}

    </div>
  );
}
