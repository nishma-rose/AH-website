import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

function GoldRates() {
  const [rates, setRates] = useState({ gold: '...', silver: '...', date: '...' });

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
          return;
        }
      }
      const res = await fetch("https://api.npoint.io/8e171dca95f244037d66");
      const data = await res.json();
      setRates({
        gold: data.Gold916 || 'Unavailable',
        silver: data.Silver || 'Unavailable',
        date: data.LastUpdated && data.LastUpdated.trim() !== '-'
          ? data.LastUpdated
          : new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      });
    } catch (err) {
      setRates({ gold: 'Unavailable', silver: 'Unavailable', date: 'Unavailable' });
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

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