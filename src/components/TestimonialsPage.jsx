import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, limit } from 'firebase/firestore';
import StarRating from './ReviewForm';
import { fetchGoogleReviews, formatGoogleReviews } from '../services/googlePlaces';

const defaultTestimonials = [
  { name: 'Ramya S.', location: 'Valliyur', text: 'Excellent quality gold jewellery with transparent pricing. The designs are beautiful and the staff is very helpful. A H Jewellers is our family\'s go-to shop!', initial: 'R', rating: 5, source: 'firebase' },
  { name: 'Meena K.', location: 'Tirunelveli', text: 'I bought my wedding jewellery from here and couldn\'t be happier. The purity is guaranteed and the craftsmanship is outstanding. Highly recommended!', initial: 'M', rating: 5, source: 'firebase' },
  { name: 'Suresh P.', location: 'Valliyur', text: 'Best jewellery shop in the area. Fair rates, honest dealings, and wonderful collection. The exchange policy is also very customer-friendly.', initial: 'S', rating: 5, source: 'firebase' }
];

function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [googleAvgRating, setGoogleAvgRating] = useState(0);
  const [googleTotalRatings, setGoogleTotalRatings] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      let combined = [...defaultTestimonials];
      let googleData = null;

      // Fetch from Firebase
      if (db) {
        try {
          const snap = await getDocs(collection(db, 'testimonials'));
          if (snap.size > 0) {
            const firebaseTestimonials = snap.docs
              .map(d => ({ ...d.data(), source: 'firebase' }))
              .filter(t => t.approved === true);
            if (firebaseTestimonials.length > 0) {
              combined = firebaseTestimonials;
            }
          }
        } catch (err) {
          console.error('Error:', err);
        }
      }

      // Fetch from Google Places
      googleData = await fetchGoogleReviews();
      if (googleData?.reviews?.length > 0) {
        const googleReviews = formatGoogleReviews(googleData, 5);
        setGoogleAvgRating(googleData.rating);
        setGoogleTotalRatings(googleData.totalRatings);
        combined = [...googleReviews, ...combined];
      }

      setTestimonials(combined);
    };

    fetchTestimonials();
  }, []);

  const firebaseAvgRating = testimonials
    .filter(t => t.source === 'firebase' && t.rating)
    .length > 0
    ? (testimonials
        .filter(t => t.source === 'firebase' && t.rating)
        .reduce((sum, t) => sum + t.rating, 0) /
        testimonials.filter(t => t.source === 'firebase' && t.rating).length).toFixed(1)
    : null;

  return (
    <div className="testimonials-page">
      <header className="site-header">
        <div className="site-header-left">
          <Link to="/">
            <img src="./logo.png" alt="Logo" />
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

          {/* Google Rating */}
          {googleAvgRating > 0 && (
            <div className="tp-rating-section">
              <div className="tp-rating-label">Google Rating</div>
              <div className="tp-rating">
                <span className="tp-avg">{googleAvgRating}</span>
                <StarRating value={Math.round(googleAvgRating)} readonly />
                <span className="tp-count">{googleTotalRatings.toLocaleString()} reviews</span>
              </div>
            </div>
          )}

          {/* Firebase Rating */}
          {firebaseAvgRating && (
            <div className="tp-rating-section">
              <div className="tp-rating-label">Website Reviews</div>
              <div className="tp-rating">
                <span className="tp-avg">{firebaseAvgRating}</span>
                <StarRating value={Math.round(firebaseAvgRating)} readonly />
                <span className="tp-count">{testimonials.filter(t => t.source === 'firebase').length} reviews</span>
              </div>
            </div>
          )}

          <Link to="/reviews/write" className="btn btn-gold">Write a Review</Link>
        </div>
      </section>

      <section className="tp-reviews">
        <div className="container">
          <h2>All Reviews</h2>
          <div className="tp-grid">
            {testimonials.map((t, i) => (
              <div key={i} className={`tp-card ${t.source === 'google' ? 'google-review' : ''}`}>
                <div className="tp-card-header">
                  <div className={`tp-avatar ${t.googleProfilePhoto ? 'google-avatar-img' : ''}`}>
                    {t.googleProfilePhoto ? (
                      <img src={t.googleProfilePhoto} alt={t.name} />
                    ) : (
                      t.initial || t.name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.location}</span>
                    {t.source === 'google' && (
                      <div className="tp-google-badge">
                        <img src="/google-icon.svg" alt="Google" className="google-icon-sm" />
                        <span>Google Review</span>
                      </div>
                    )}
                    {t.googleRelativeTime && (
                      <span className="tp-relative-time">{t.googleRelativeTime}</span>
                    )}
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