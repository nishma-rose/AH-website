import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const defaultCollections = [
  { title: 'Gold Necklaces', description: 'Traditional & modern designs for every occasion', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&w=500&q=80' },
  { title: 'Antique Bangles', description: 'Handcrafted with intricate detail and elegance', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80' },
  { title: 'Engagement Rings', description: 'Celebrate love with the perfect ring', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80' },
  { title: 'Designer Earrings', description: 'From studs to jhumkas, find your perfect pair', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=500&q=80' },
  { title: 'Silver Collection', description: 'Pure silver jewellery and vessels', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=500&q=80' },
  { title: 'Bridal Sets', description: 'Complete wedding jewellery collections', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=500&q=80' }
];

function Collections() {
  const [collections, setCollections] = useState(defaultCollections);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!db) {
        console.log('Firebase not initialized, using defaults');
        return;
      }
      try {
        const snap = await getDocs(collection(db, 'collections'));
        console.log('Firestore collections:', snap.size);
        if (snap.size > 0) {
          const data = snap.docs.map(d => d.data());
          console.log('Loaded from Firestore:', data);
          setCollections(data);
        } else {
          console.log('No data in Firestore, using defaults');
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
      }
    };
    fetchCollections();
  }, []);

  return (
    <section id="collections" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Our <span>Collections</span></h2>
          <p>Explore our curated range of gold and silver jewellery for every occasion</p>
          <div className="divider"></div>
        </div>
        <div className="collection-grid">
          {collections.map((c, i) => (
            <div className="collection-card fade-up" key={i}>
              <img src={c.image} alt={c.title} />
              <div className="collection-overlay">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Collections;