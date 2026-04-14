import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

function GoldRates() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRates = async () => {
      try {
        if (db) {
          const rateDoc = await getDoc(doc(db, 'rates', 'current'));
          if (rateDoc.exists()) {
            const data = rateDoc.data();
            setRates({
              gold: data.gold || 'Unavailable',
              silver: data.silver || 'Unavailable',
              date: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : 'Today'
            });
            setLoading(false);
            return;
          }
        }
      } catch (err) { console.error('Firebase error:', err); }
      setLoading(false);
    };
    loadRates();
  }, []);

  if (loading) {
    return (
      <div id="rates" className="rate-banner">
        <div className="container">
          <div className="rate-item"><span>Loading rates...</span></div>
        </div>
      </div>
    );
  }

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
            <span className="rate-icon">📞</span>
            <span>Contact for rates</span>
            <strong>94863 94863</strong>
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
          <strong>₹ {rates.silver}</strong>
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