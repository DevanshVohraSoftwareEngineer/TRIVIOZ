'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import DropBanner from '@/components/DropBanner';
import { useSearchParams } from 'next/navigation';

export default function Shop() {
  const searchParams = useSearchParams();
  const category = searchParams ? searchParams.get('category') : null;
  const searchQuery = searchParams ? searchParams.get('search') : null;
  
  const isFilteredView = !!category || !!searchQuery;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {!isFilteredView ? (
        <Hero />
      ) : (
        <>
          <div style={{ flex: 1 }}>
            <ProductGrid category={category || undefined} searchQuery={searchQuery || undefined} />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
