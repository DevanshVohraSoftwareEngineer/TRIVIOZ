'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import SaleBanner from '@/components/SaleBanner';

export default function Navbar() {
  const { cart, wishlist, removeFromCart, updateCartQuantity, removeFromWishlist, addToCart, t, globalDiscount, adminTaxonomy, products } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTab, setCartTab] = useState<'bag' | 'wishlist'>('bag');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Woman' | 'Man'>('Woman');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const isProductPage = pathname?.includes('/product/');
  const isCartPage = pathname?.includes('/cart');
  const isMainPage = pathname === '/' || pathname === '/shop';
  const isTrulyMainPage = isMainPage && !search && !category;
  
  const isLightMode = !!category || !!search || isProductPage || isCartPage || isSearchOpen || (isScrolled && !isMainPage);
  
  const navTextColor = isLightMode ? '#000' : '#fff';
  const navBgColor = isLightMode ? '#fff' : 'transparent';
  const headerPosition = isTrulyMainPage ? 'absolute' : 'fixed';
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initialize on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header style={{ position: headerPosition as any, top: 0, left: 0, width: '100%', zIndex: 9999, backgroundColor: navBgColor, borderBottom: isLightMode ? '1px solid #eaeaea' : 'none', transition: 'background-color 0.3s ease' }}>
        <SaleBanner />
        <div style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          
          {/* Left Side: Hamburger */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setIsMenuOpen(true)}
              style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: navTextColor }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Center: Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Link href="/shop" style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px', color: navTextColor, textDecoration: 'none' }}>
              TRIVIOZ
            </Link>
          </div>

          {/* Right Side: Search / Account / Cart */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
            {isSearchOpen ? (
              <button 
                onClick={() => setIsSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: navTextColor, display: 'flex', alignItems: 'center' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            ) : (
              <div 
                onClick={() => setIsSearchOpen(true)}
                style={{ display: 'flex', alignItems: 'center', color: navTextColor, cursor: 'pointer', borderBottom: `1px solid ${navTextColor}`, paddingBottom: '2px' }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Search</span>
              </div>
            )}
            
            <Link href="/login" style={{ color: navTextColor, display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
            
            <div 
              onClick={() => setIsCartOpen(true)}
              style={{ color: navTextColor, display: 'flex', alignItems: 'center', position: 'relative', cursor: 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: navTextColor, color: isLightMode ? '#fff' : '#000', fontSize: '0.65rem', fontWeight: 'bold', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex' }}>
          {/* Dimmed Background */}
          <div 
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Drawer */}
          <div style={{ position: 'relative', width: '450px', maxWidth: '85vw', backgroundColor: '#fff', height: '100%', display: 'flex', flexDirection: 'column', animation: 'slideRight 0.3s ease-out' }}>
            
            {/* Header in Drawer */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #eee' }}>
              <button 
                onClick={() => setIsMenuOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', marginRight: '1rem' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }}>
                <button 
                  onClick={() => setActiveTab('Woman')}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    fontSize: '1rem', fontWeight: activeTab === 'Woman' ? 700 : 400,
                    color: activeTab === 'Woman' ? '#000' : '#888'
                  }}
                >
                  Woman
                </button>
                <button 
                  onClick={() => setActiveTab('Man')}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    fontSize: '1rem', fontWeight: activeTab === 'Man' ? 700 : 400,
                    color: activeTab === 'Man' ? '#000' : '#888'
                  }}
                >
                  Man
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '2rem 2.5rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.5rem' }}>
                {adminTaxonomy.filter((t: any) => t.department === activeTab && t.group === 'Featured').map((tax: any) => (
                  <Link onClick={() => setIsMenuOpen(false)} key={tax.id} href={`/shop?category=${encodeURIComponent(tax.name)}`} style={{ fontWeight: tax.isBold ? 700 : 400, fontSize: '0.9rem', color: tax.isSpecial ? '#3b82f6' : '#000', textDecoration: 'none' }}>{tax.name}</Link>
                ))}
              </div>

              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', color: '#000' }}>Collection</h3>
                  {adminTaxonomy.filter((t: any) => t.department === activeTab && t.group === 'Collection').map((tax: any) => (
                    <Link onClick={() => setIsMenuOpen(false)} key={tax.id} href={`/shop?category=${encodeURIComponent(tax.name)}`} style={{ fontSize: '0.9rem', color: tax.isSpecial ? '#3b82f6' : '#333', textDecoration: 'none' }}>{tax.name}</Link>
                  ))}
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', color: '#000' }}>Be Inspired</h3>
                  {adminTaxonomy.filter((t: any) => t.department === activeTab && t.group === 'Be Inspired').map((tax: any) => (
                    <Link onClick={() => setIsMenuOpen(false)} key={tax.id} href={`/shop?category=${encodeURIComponent(tax.name)}`} style={{ fontSize: '0.9rem', color: tax.isSpecial ? '#3b82f6' : '#333', textDecoration: 'none' }}>{tax.name}</Link>
                  ))}
                  
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {adminTaxonomy.filter((t: any) => t.department === activeTab && t.group === 'Be Inspired Sub').map((tax: any) => (
                      <Link onClick={() => setIsMenuOpen(false)} key={tax.id} href={`/shop?category=${encodeURIComponent(tax.name)}`} style={{ fontSize: '0.9rem', color: tax.isSpecial ? '#3b82f6' : '#333', textDecoration: 'none' }}>{tax.name}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Full-Screen Search Overlay (Below Header) */}
      {isSearchOpen && (
        <div style={{ position: 'fixed', top: '80px', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 9998, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          <div style={{ padding: '0 2rem' }}>
            <form onSubmit={handleSearchSubmit} style={{ width: '100%', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eaeaea', padding: '1.5rem 0' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '1rem' }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search" 
                  style={{ 
                    flex: 1,
                    border: 'none', 
                    fontSize: '1rem', 
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: '#000',
                  }} 
                />
                <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2rem' }}>Suggested for you</h3>
            
            <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {products.slice(0, 5).map((product: any) => (
                <div key={product.id} style={{ width: '160px', flex: '0 0 auto', cursor: 'pointer' }} onClick={() => { setIsSearchOpen(false); router.push(`/product/${product.id}`); }}>
                  <div style={{ aspectRatio: '3/4', backgroundColor: '#f5f5f5', marginBottom: '0.5rem', position: 'relative' }}>
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.75rem', color: '#000', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#666' }}>AED {product.price.toFixed(2)}</p>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 0.5rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
          </div>

        </div>
      )}

      {/* Mini Cart / Wishlist Overlay */}
      {isCartOpen && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 10000 }} 
            onClick={() => setIsCartOpen(false)}
          />
          <div style={{ 
            position: 'fixed', 
            top: '1rem', 
            right: '1rem', 
            bottom: '1rem', 
            width: '400px', 
            backgroundColor: '#fff', 
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            
            {/* Header / Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eaeaea', padding: '1rem 1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button 
                  onClick={() => setCartTab('bag')}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: cartTab === 'bag' ? 700 : 400, color: cartTab === 'bag' ? '#000' : '#666', borderBottom: cartTab === 'bag' ? '2px solid #000' : 'none', paddingBottom: '0.25rem' }}
                >
                  Shopping bag ({cartCount})
                </button>
                <button 
                  onClick={() => setCartTab('wishlist')}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: cartTab === 'wishlist' ? 700 : 400, color: cartTab === 'wishlist' ? '#000' : '#666', borderBottom: cartTab === 'wishlist' ? '2px solid #000' : 'none', paddingBottom: '0.25rem' }}
                >
                  Wishlist ({wishlist.length})
                </button>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              
              {cartTab === 'bag' && (
                <>
                  {cart.length === 0 ? (
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Your shopping basket is empty</h3>
                      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '3rem' }}>Why not fill it with some of our suggestions?</p>
                      
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'left' }}>Suggested for you</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                        {products.slice(0, 6).map((p: any) => (
                          <div key={p.id} style={{ position: 'relative', cursor: 'pointer' }}>
                            <img src={p.images[0]} alt={p.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', backgroundColor: '#f5f5f5' }} />
                            <div style={{ padding: '0.5rem 0' }}>
                              <p style={{ fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                              <p style={{ fontSize: '0.7rem', color: '#666' }}>AED {p.price}</p>
                            </div>
                            <button 
                              onClick={() => { addToCart(p, p.sizes[0] || 'One Size'); }}
                              style={{ position: 'absolute', bottom: '45px', left: '10%', width: '80%', padding: '0.25rem', backgroundColor: '#fff', border: '1px solid #000', fontSize: '0.7rem', opacity: 0.9 }}
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {cart.map((item) => (
                        <div key={`${item.product.id}-${item.size}`} style={{ display: 'flex', gap: '1rem' }}>
                          <img src={item.product.images[0]} style={{ width: '80px', height: '110px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.product.name}</p>
                              <button onClick={() => removeFromCart(item.product.id, item.size)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>Size: {item.size}</p>
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eaeaea' }}>
                                <button onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity - 1)} style={{ padding: '0.2rem 0.5rem', background: 'none', border: 'none' }}>-</button>
                                <span style={{ fontSize: '0.85rem' }}>{item.quantity}</span>
                                <button onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity + 1)} style={{ padding: '0.2rem 0.5rem', background: 'none', border: 'none' }}>+</button>
                              </div>
                              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>AED {(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {cartTab === 'wishlist' && (
                <>
                  {wishlist.length === 0 ? (
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Your wishlist is empty</h3>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>Save your favourite items here.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {wishlist.map((p) => (
                        <div key={p.id} style={{ display: 'flex', gap: '1rem' }}>
                          <img src={p.images[0]} style={{ width: '80px', height: '110px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.name}</p>
                              <button onClick={() => removeFromWishlist(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 'auto' }}>AED {p.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {cartTab === 'bag' && cart.length > 0 && (
              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #eaeaea', backgroundColor: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ fontWeight: 600 }}>Total</span>
                  <span style={{ fontWeight: 700 }}>
                    AED {cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); router.push('/cart'); }}
                  style={{ width: '100%', padding: '1rem', backgroundColor: '#000', color: '#fff', border: 'none', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Go to checkout
                </button>
              </div>
            )}
            
          </div>
        </>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulseOpacity {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}} />
    </>
  );
}
