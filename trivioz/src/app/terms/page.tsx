import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', flex: 1, maxWidth: '800px', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>Terms & Conditions</h1>
        
        <div style={{ color: '#444', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>Last updated: June 2026</p>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000', marginBottom: '0.5rem' }}>1. Agreement to Terms</h2>
            <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and TRIVIOZ ("we," "us" or "our"), concerning your access to and use of the TRIVIOZ website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000', marginBottom: '0.5rem' }}>2. Intellectual Property Rights</h2>
            <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000', marginBottom: '0.5rem' }}>3. Products and Purchases</h2>
            <p>We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.</p>
            <p style={{ marginTop: '0.5rem' }}>All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000', marginBottom: '0.5rem' }}>4. Return Policy</h2>
            <p>Please review our Return Policy posted on the Site prior to making any purchases. All returns must be processed through our authorized RTO command center logistics flow.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
