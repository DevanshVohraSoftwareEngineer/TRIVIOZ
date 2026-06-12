'use client';

import { useStore } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, addToWishlist, globalDiscount, setGlobalDiscount } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'TRIVIOZ10') {
      setGlobalDiscount(10);
      setPromoMessage('Promo code applied: 10% off');
    } else if (promoCode.toUpperCase() === 'SUMMER20') {
      setGlobalDiscount(20);
      setPromoMessage('Promo code applied: 20% off');
    } else {
      setPromoMessage('Invalid promo code');
      setGlobalDiscount(0);
    }
  };

  const handleMoveToWishlist = (item: any) => {
    addToWishlist(item.product);
    removeFromCart(item.product.id, item.size);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * (globalDiscount / 100);
  const total = subtotal - discountAmount;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', color: '#000', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '120px 5% 4rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2rem', letterSpacing: '-0.5px' }}>Shopping Bag ({cart.length})</h1>
        
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ marginBottom: '2rem', color: '#666' }}>Your shopping bag is empty.</p>
            <Link href="/shop" style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '1rem 3rem', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start' }}>
            
            {/* Left: Cart Items */}
            <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {cart.map(item => (
                <div key={`${item.product.id}-${item.size}`} style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #eaeaea', paddingBottom: '2rem' }}>
                  <img src={item.product.images[0]} alt={item.product.name} style={{ width: '120px', height: '160px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{item.product.name}</h3>
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>Size: {item.size}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {globalDiscount > 0 ? (
                          <>
                            <p style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem' }}>AED {(item.product.price * item.quantity).toFixed(2)}</p>
                            <p style={{ color: '#d50000', fontWeight: 700 }}>AED {((item.product.price * (1 - globalDiscount / 100)) * item.quantity).toFixed(2)}</p>
                          </>
                        ) : (
                          <p style={{ fontWeight: 600 }}>AED {(item.product.price * item.quantity).toFixed(2)}</p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eaeaea', borderRadius: '4px' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity - 1)}
                          style={{ padding: '0.5rem 0.8rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#333' }}
                        >-</button>
                        <span style={{ padding: '0 0.5rem', fontSize: '0.9rem', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          style={{ padding: '0.5rem 0.8rem', background: 'none', border: 'none', cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer', fontSize: '1.2rem', color: item.quantity >= item.product.stock ? '#ccc' : '#333' }}
                        >+</button>
                      </div>

                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                        <button 
                          onClick={() => handleMoveToWishlist(item)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', textDecoration: 'underline' }}
                        >
                          Move to Wishlist
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d50000', textDecoration: 'underline' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {item.quantity >= item.product.stock && (
                      <p style={{ color: '#d50000', fontSize: '0.75rem', marginTop: '0.5rem' }}>Max stock reached.</p>
                    )}

                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary */}
            <div style={{ flex: '1 1 30%', backgroundColor: '#fafafa', padding: '2rem', border: '1px solid #eaeaea' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span>AED {subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: '#d50000' }}>
                  <span>Discount ({globalDiscount}%)</span>
                  <span>- AED {discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#666' }}>Shipping</span>
                <span>Free</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 700, borderTop: '1px solid #eaeaea', paddingTop: '1.5rem' }}>
                <span>Total</span>
                <span>AED {total.toFixed(2)}</span>
              </div>

              {/* Promo Code Input */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>Promotional Code</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code" 
                    style={{ flex: 1, padding: '0.75rem', border: '1px solid #eaeaea', outline: 'none', fontSize: '0.85rem' }} 
                  />
                  <button 
                    onClick={handleApplyPromo}
                    style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '0 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                  >
                    APPLY
                  </button>
                </div>
                {promoMessage && <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: promoMessage.includes('Invalid') ? '#d50000' : '#10b981' }}>{promoMessage}</p>}
              </div>

              <button 
                onClick={() => alert('Mock checkout completed!')}
                style={{ width: '100%', padding: '1rem', backgroundColor: '#000', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textTransform: 'uppercase' }}
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
