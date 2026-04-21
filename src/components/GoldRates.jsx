import { useState, useEffect } from 'react';

function GoldRates() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRates = async () => {
      const apiUrl = localStorage.getItem('ratesApiUrl') || 'https://api.npoint.io/be02080f625fe3dcf48a';
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const goldRate = data.Gold916 || data.gold;
        const silverRate = data.Silver || data.silver;
        if (goldRate) {
          setRates({
            gold: goldRate,
            silver: silverRate || null,
            date: data.LastUpdated || data.lastUpdated || 'Today'
          });
        }
      } catch (err) {
        console.error('Error loading rates:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRates();
  }, []);

  if (loading) {
    return (
      <div id="rates" className="rate-banner">
        <div className="container">
          <div className="rate-item">
            <span>Loading rates...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!rates || !rates.gold) {
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
            <span className="rate-icon">📞</span>
            <span>Contact for rates</span>
            <strong>+91 99424 40230</strong>
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
      </div>
    </div>
  );
}

export default GoldRates;