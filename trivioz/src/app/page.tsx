'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';

export default function EntryPage() {
  const [selectedLocation, setSelectedLocation] = useState('India');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');
  const [remember, setRemember] = useState(false);
  const { setPreferences } = useStore();

  const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

  return (
    <div className="flex w-full" style={{ height: '100vh', backgroundColor: '#fff', color: '#000', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Left Side: Form Container */}
      <div style={{ flex: 1, padding: '5% 5%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <div>
          <h1 
            style={{ 
              fontSize: '2rem', 
              fontWeight: 900, 
              letterSpacing: '-1px', 
              margin: 0 
            }}
          >
            TRIVIOZ
          </h1>
        </div>
        
        {/* Main Center Block */}
        <div style={{ maxWidth: '420px', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '10%' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Location and language</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                border: '1px solid #000', 
                outline: 'none', 
                backgroundColor: '#fff',
                appearance: 'none',
                fontSize: '1rem',
                color: '#333',
                background: `${chevronSvg} no-repeat right 16px center / 16px`,
                cursor: 'pointer'
              }}
            >
              <option value="India">India</option>
              <option value="UAE">United Arab Emirates</option>
              <option value="Spain">Spain</option>
              <option value="UK">United Kingdom</option>
              <option value="USA">USA</option>
            </select>

            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'ar')}
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                border: '1px solid #000', 
                outline: 'none', 
                backgroundColor: '#fff',
                appearance: 'none',
                fontSize: '1rem',
                color: '#333',
                background: `${chevronSvg} no-repeat right 16px center / 16px`,
                cursor: 'pointer'
              }}
            >
              <option value="en">English</option>
              {selectedLocation === 'UAE' && <option value="ar">العربية (Arabic)</option>}
            </select>

            <div 
              onClick={() => setRemember(!remember)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', marginBottom: '8px', cursor: 'pointer' }}
            >
              <div style={{ 
                width: '20px', 
                height: '20px', 
                border: '1px solid #000', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#fff'
              }}>
                {remember && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '1rem', color: '#000' }}>Remember my selection</span>
            </div>

            <Link 
              href="/shop"
              onClick={() => setPreferences(selectedLanguage, selectedLocation)}
              style={{ 
                backgroundColor: '#000', 
                color: '#fff',
                padding: '16px',
                width: '100%',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                marginTop: '0.5rem',
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              Access
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div style={{ color: '#666', fontSize: '0.85rem', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: '0.75rem', columnGap: '1rem', marginBottom: '2rem', maxWidth: '500px' }}>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">Spain</span>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">United Kingdom</span>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">France</span>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">Germany</span>
            
            <span style={{ cursor: 'pointer' }} className="hover:text-black">Italy</span>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">The Netherlands</span>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">Greece</span>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">Turkey</span>
            
            <span style={{ cursor: 'pointer' }} className="hover:text-black">USA</span>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">Poland</span>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">Mexico</span>
            <span style={{ cursor: 'pointer' }} className="hover:text-black">Portugal</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: '1px solid #ccc', 
              padding: '6px 10px', 
              width: 'fit-content', 
              cursor: 'pointer',
              color: '#333'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              <span style={{ fontSize: '14px' }}>&#10005;</span>
            </div>
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }} className="hover:text-black">Preference Cookies</span>
          </div>
        </div>

      </div>

      {/* Right Side: Full Height Image */}
      <div className="hidden md:block" style={{ width: '50%', height: '100vh' }}>
        <img 
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop" 
          alt="Fashion Model" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

    </div>
  );
}
