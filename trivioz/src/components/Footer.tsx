import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ padding: '4rem 5% 2rem', background: '#fafafa', borderTop: '1px solid #eaeaea', marginTop: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <strong style={{ fontSize: '0.9rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal</strong>
            <Link href="/privacy-policy" style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none' }} className="hover:text-black">Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none' }} className="hover:text-black">Terms & Conditions</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <strong style={{ fontSize: '0.9rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Support</strong>
            <span style={{ color: '#666', fontSize: '0.85rem', cursor: 'pointer' }} className="hover:text-black">Contact Us</span>
            <span style={{ color: '#666', fontSize: '0.85rem', cursor: 'pointer' }} className="hover:text-black">Returns</span>
            <span style={{ color: '#666', fontSize: '0.85rem', cursor: 'pointer' }} className="hover:text-black">Shipping FAQs</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid #eaeaea', color: '#999', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <span>&copy; {new Date().getFullYear()} TRIVIOZ. All rights reserved.</span>
        <span>India | English</span>
      </div>
    </footer>
  );
}
