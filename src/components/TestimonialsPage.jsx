import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, limit } from 'firebase/firestore';
import StarRating from './ReviewForm';

const defaultTestimonials = [
  { name: 'Ramya S.', location: 'Valliyur', text: 'Excellent quality gold jewellery with transparent pricing. The designs are beautiful and the staff is very helpful. A H Jewellers is our family\'s go-to shop!', initial: 'R', rating: 5 },
  { name: 'Meena K.', location: 'Tirunelveli', text: 'I bought my wedding jewellery from here and couldn\'t be happier. The purity is guaranteed and the craftsmanship is outstanding. Highly recommended!', initial: 'M', rating: 5 },
  { name: 'Suresh P.', location: 'Valliyur', text: 'Best jewellery shop in the area. Fair rates, honest dealings, and wonderful collection. The exchange policy is also very customer-friendly.', initial: 'S', rating: 5 }
];

function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, 'testimonials'));
        if (snap.size > 0) {
          const allData = snap.docs.map(d => d.data());
          const approved = allData.filter(t => t.approved === true);
          if (approved.length > 0) {
            setTestimonials(approved);
          }
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchTestimonials();
  }, []);

  const avgRating = testimonials.length > 0 
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : 0;

  return (
    <div className="testimonials-page">
      <header className="site-header">
        <div className="site-header-left">
          <Link to="/">
            <img src="/logo.png" alt="Logo" />
          </Link>
          <Link to="/" className="site-header-title">
            <span>A H JEWELLERS</span>
          </Link>
        </div>
        <div className="site-header-right">
          <Link to="/" className="btn btn-outline">View Site</Link>
        </div>
      </header>

      <section className="tp-hero">
        <div className="container">
          <h1>Customer Reviews</h1>
          <p>See what our customers say about us</p>
          <div className="tp-rating">
            <span className="tp-avg">{avgRating}</span>
            <StarRating value={Math.round(avgRating)} readonly />
            <span className="tp-count">{testimonials.length} reviews</span>
          </div>
          <Link to="/reviews/write" className="btn btn-gold">Write a Review</Link>
        </div>
      </section>

      <section className="tp-reviews">
        <div className="container">
          <h2>All Reviews</h2>
          <div className="tp-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="tp-card">
                <div className="tp-card-header">
                  <div className="tp-avatar">{t.initial || t.name?.charAt(0)}</div>
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.location}</span>
                  </div>
                </div>
                <div className="tp-card-rating">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < (t.rating || 5) ? 'active' : ''}`}></i>
                  ))}
                </div>
                <p>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default TestimonialsPage;