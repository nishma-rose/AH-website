import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const defaultTestimonials = [
  { name: 'Ramya S.', location: 'Valliyur', text: 'Excellent quality gold jewellery with transparent pricing. The designs are beautiful and the staff is very helpful. A H Jewellers is our family\'s go-to shop!', initial: 'R', rating: 5 },
  { name: 'Meena K.', location: 'Tirunelveli', text: 'I bought my wedding jewellery from here and couldn\'t be happier. The purity is guaranteed and the craftsmanship is outstanding. Highly recommended!', initial: 'M', rating: 5 },
  { name: 'Suresh P.', location: 'Valliyur', text: 'Best jewellery shop in the area. Fair rates, honest dealings, and wonderful collection. The exchange policy is also very customer-friendly.', initial: 'S', rating: 5 }
];

function Testimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDocs(collection(db, 'testimonials'));
        if (snap.size > 0) {
          const allData = snap.docs.map(d => d.data());
          const approved = allData.filter(t => t.approved === true);
          if (approved.length > 0) {
            setTestimonials(approved.slice(0, 6));
          }
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`fas fa-star ${i < (rating || 5) ? 'active' : ''}`}></i>
    ));
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>What Our <span>Customers</span> Say</h2>
          <p>Trusted by families across Valliyur and beyond</p>
          <div className="divider"></div>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card fade-up" key={i}>
              <div className="stars">{renderStars(t.rating)}</div>
              <div className="testimonial-text">
                <p>"{truncateText(t.text)}"</p>
                {t.text.length > 100 && (
                  <Link to="/reviews" className="read-more">Read more</Link>
                )}
              </div>
              <div className="author">
                <div className="author-avatar">{t.initial || t.name?.charAt(0)}</div>
                <div className="author-info">
                  <h5>{t.name}</h5>
                  <span>{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <Link to="/reviews" className="btn btn-outline">View All Reviews</Link>
          <Link to="/reviews/write" className="btn btn-gold">Write a Review</Link>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;