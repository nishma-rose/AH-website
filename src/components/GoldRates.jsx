import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const socialLinks = {
  instagram: 'https://www.instagram.com/ahjewellers_vly?igsh=MWV6YTRjNnVyemZrYg==',
  facebook: 'https://www.facebook.com/share/18DDtX4BxC/',
  youtube: 'https://youtube.com/@ahjewellers?si=75d-fPDgEbta89cL',
  linkedin: 'https://www.linkedin.com/company/ah-jewellers',
  googleMap: 'https://maps.app.goo.gl/xyz123'
};

function GoldRates() {
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
        
        const response = await fetch(apiUrl);
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
        <div className="container">
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
            <strong>--</strong>
          </div>
          <div className="rate-social">
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href={socialLinks.googleMap} target="_blank" rel="noopener noreferrer" aria-label="Location"><i className="fas fa-map-marker-alt"></i></a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="rates" className="rate-banner">
      <div className="container">
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
          <strong>{rates.date}</strong>
        </div>
        <div className="rate-social">
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          <a href={socialLinks.googleMap} target="_blank" rel="noopener noreferrer" aria-label="Location"><i className="fas fa-map-marker-alt"></i></a>
        </div>
      </div>
    </div>
  );
}

export default GoldRates;