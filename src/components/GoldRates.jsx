import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/logo.png';

function GoldRates({ logoUrl }) {
  const [rates, setRates] = useState(null);

  useEffect(() => {
    const loadRates = async () => {
      try {
        let apiUrl = 'https://api.npoint.io/be02080f625fe3dcf48a';
        
        if (db) {
          const configSnap = await getDoc(doc(db, 'config', 'ratesApi'));
          if (configSnap.exists() && configSnap.data().url) {
            apiUrl = configSnap.data().url;
          }
        }
        
        // Fetch with no-store and timestamp to bypass any browser or proxy cache
        const response = await fetch(`${apiUrl}?nocache=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const data = await response.json();
        const goldRate = data.Gold916 || data.gold;
        const silverRate = data.Silver || data.silver;
        if (goldRate) {
          setRates({
            gold: goldRate,
            silver: silverRate || null,
            date: data.LastUpdated || data.lastUpdated || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          });
        }
      } catch (err) {
        console.error('Error loading rates:', err);
        setRates({ gold: '6,250', silver: '82', date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) });
      }
    };
    loadRates();
  }, []);

  if (!rates) {
    return (
      <div id="rates" className="rate-banner">
        <div className="container" style={{maxWidth: '1600px'}}>
          <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: 'auto' }}>
            <img src={logoUrl || logo} className="logo-img" alt="Logo" style={{ height: '30px', width: 'auto' }} />
            <span className="logo-text" style={{ color: '#D4AF37', fontWeight: '600', fontSize: '1.1rem', letterSpacing: '1px' }}>A H JEWELLERS</span>
          </Link>
          <div className="rate-item rate-item--gold">
            <span className="rate-icon">🥇</span>
            <span>Gold 916 / Gram</span>
            <strong>₹ --</strong>
          </div>
          <div className="rate-item rate-item--silver">
            <span className="rate-icon">🥈</span>
            <span>Silver / Gram</span>
            <strong>₹ --</strong>
          </div>
            <div className="rate-item rate-item--time">
            <span className="rate-icon">🕐</span>
            <span>Last Updated</span>
            <span style={{color: 'white'}}>--</span>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div id="rates" className="rate-banner">
      <div className="container" style={{maxWidth: '1600px'}}>
        <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: 'auto' }}>
          <img src={logoUrl || logo} className="logo-img" alt="Logo" style={{ height: '30px', width: 'auto' }} />
          <span className="logo-text" style={{ color: '#D4AF37', fontWeight: '600', fontSize: '1.1rem', letterSpacing: '1px' }}>A H JEWELLERS</span>
        </Link>
        <div className="rate-item rate-item--gold">
          <span className="rate-icon">🥇</span>
          <span>Gold 916 / Gram</span>
          <strong>₹ {rates.gold}</strong>
        </div>
        <div className="rate-item rate-item--silver">
          <span className="rate-icon">🥈</span>
          <span>Silver / Gram</span>
          <strong>₹ {rates.silver || '--'}</strong>
        </div>
          <div className="rate-item rate-item--time">
          <span className="rate-icon">🕐</span>
          <span>Last Updated</span>
          <span style={{color: 'white'}}>{rates.date}</span>
        </div>
      </div>
    </div>
  );
}

export default GoldRates;