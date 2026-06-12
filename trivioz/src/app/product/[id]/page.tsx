'use client';

import { useStore } from '@/context/StoreContext';
import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/lib/data';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { products, addToCart, addToWishlist, globalDiscount } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    // Wait for context products to populate from localStorage
    if (products.length > 0) {
      const found = products.find((p) => p.id === id);
      setProduct(found || null);
      setLoading(false);
    } else {
      // Set a short timeout to handle the case where the catalog is empty
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [products, id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '100px' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '100px' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Product Not Found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const discountedPrice = product.price * (1 - globalDiscount / 100);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!selectedSize && product.sizes.length > 0) {
      alert('Please select a size before adding to bag.');
      return;
    }
    addToCart(product, selectedSize || 'One Size');
    alert(`Added ${product.name} (Size: ${selectedSize}) to bag!`);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    alert(`Added ${product.name} to wishlist!`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', color: '#000' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', paddingTop: '80px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        
        {/* Left Side: Accordions (20%) */}
        <div style={{ width: '20%', minWidth: '250px', padding: '4rem 2rem 2rem 4rem' }}>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', paddingBottom: '4rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2rem' }}>Ref. {product.id} · {product.category}</p>
            
            <div style={{ borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea' }}>
              <div style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.85rem' }}>
                <span>Composition and care</span>
                <span>›</span>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid #eaeaea' }}>
              <div style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.85rem' }}>
                <span>Availability in store</span>
                <span>›</span>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid #eaeaea' }}>
              <div style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.85rem' }}>
                <span>Shipping and returns</span>
                <span>›</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Thumbnail Gallery + Main Image (50%) */}
        <div style={{ flex: 1, padding: '4rem 2rem', display: 'flex', gap: '1rem' }}>
          <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {product.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`${product.name} view ${idx + 1}`} 
                onClick={() => setMainImageIndex(idx)}
                style={{ 
                  width: '100%', 
                  aspectRatio: '3/4', 
                  objectFit: 'cover', 
                  cursor: 'pointer',
                  border: mainImageIndex === idx ? '1px solid #000' : '1px solid transparent',
                  opacity: mainImageIndex === idx ? 1 : 0.6
                }}
              />
            ))}
          </div>
          <div style={{ flex: 1 }}>
            {product.images.length > 0 ? (
              <img 
                src={product.images[mainImageIndex] || product.images[0]} 
                alt={product.name} 
                style={{ width: '100%', height: 'calc(100vh - 160px)', objectFit: 'contain', backgroundColor: '#f9f9f9' }}
              />
            ) : (
              <div style={{ width: '100%', height: 'calc(100vh - 160px)', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ color: '#999' }}>No images available</span>
              </div>
            )}
          </div>
          <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
        </div>

        {/* Right Side: Product Detail Panel (30%) */}
        <div style={{ width: '30%', minWidth: '350px', padding: '4rem 4rem 2rem 2rem' }}>
          <div style={{ position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>{product.name}</h1>
              <button onClick={handleAddToWishlist} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
            
            <div style={{ fontSize: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
              {globalDiscount > 0 ? (
                <>
                  <span style={{ textDecoration: 'line-through', color: '#999' }}>AED {product.price.toFixed(2)}</span>
                  <span style={{ color: '#d50000', fontWeight: 600 }}>AED {discountedPrice.toFixed(2)}</span>
                </>
              ) : (
                <span style={{ fontWeight: 600 }}>AED {product.price.toFixed(2)}</span>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#333' }}>
                {product.description || 'Elevate your wardrobe with this essential piece. Designed with modern aesthetics and premium materials for maximum comfort and style.'}
              </p>
              <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: '#666' }}>Model: 178 cm tall and size S</p>
            </div>

            {/* Colors (Mock) */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#d50000', border: '1px solid #eaeaea', cursor: 'pointer', outline: '1px solid #000', outlineOffset: '2px' }}></div>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#fff', border: '1px solid #eaeaea', cursor: 'pointer' }}></div>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#a4b36d', border: '1px solid #eaeaea', cursor: 'pointer' }}></div>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#000', border: '1px solid #eaeaea', cursor: 'pointer' }}></div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}>See measurements</span>
                <span style={{ fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}>Find my size</span>
              </div>
              <div style={{ position: 'relative' }}>
                <style>{`
                  .custom-size-dropdown::-webkit-scrollbar {
                    width: 14px;
                  }
                  .custom-size-dropdown::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .custom-size-dropdown::-webkit-scrollbar-thumb {
                    background-color: #888;
                    border-radius: 10px;
                    border: 4px solid #fff;
                  }
                `}</style>
                <div 
                  onClick={() => !isOutOfStock && setIsDropdownOpen(!isDropdownOpen)}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    border: '1px solid #000', 
                    fontSize: '0.95rem', 
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    color: selectedSize && !isDropdownOpen ? '#000' : '#666',
                  }}
                >
                  <span>{selectedSize && !isDropdownOpen ? selectedSize : 'Select a size'}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {isDropdownOpen && !isOutOfStock && (
                  <div 
                    className="custom-size-dropdown"
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      left: 0, 
                      width: '100%', 
                      border: '1px solid #000', 
                      borderTop: '1px solid #eaeaea',
                      backgroundColor: '#fff', 
                      zIndex: 20,
                      maxHeight: '180px',
                      overflowY: 'auto',
                    }}
                  >
                    {product.sizes.map((size, index) => (
                      <div 
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setIsDropdownOpen(false);
                        }}
                        style={{ 
                          padding: '1rem', 
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          color: '#000',
                          borderBottom: index < product.sizes.length - 1 ? '1px solid #eaeaea' : 'none',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ flex: 1, padding: '1rem', backgroundColor: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                See Look
              </button>
              {isOutOfStock ? (
                <div style={{ flex: 1, padding: '1rem', backgroundColor: '#f5f5f5', color: '#d50000', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', border: '1px solid #f5f5f5' }}>
                  OUT OF STOCK
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  style={{ flex: 1, padding: '1rem', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  Add
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
