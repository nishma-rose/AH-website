import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { fetchGoogleReviews, formatGoogleReviews } from '../services/googlePlaces';

const defaultTestimonials = [
  { name: 'Ramya S.', location: 'Valliyur', text: 'Excellent quality gold jewellery with transparent pricing. The designs are beautiful and the staff is very helpful.', initial: 'R', rating: 5, source: 'firebase' },
  { name: 'Meena K.', location: 'Tirunelveli', text: 'I bought my wedding jewellery from here and couldn\'t be happier. The purity is guaranteed and craftsmanship is outstanding.', initial: 'M', rating: 5, source: 'firebase' },
  { name: 'Suresh P.', location: 'Valliyur', text: 'Best jewellery shop in the area. Fair rates, honest dealings, and wonderful collection.', initial: 'S', rating: 5, source: 'firebase' }
];

function Testimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);
  const carouselRef = useRef(null);

  // Handle responsive visible cards
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth <= 768) setVisibleCards(1);
      else if (window.innerWidth <= 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      let combined = [];

      // Fetch from Firebase
      if (db) {
        try {
          const snap = await getDocs(collection(db, 'testimonials'));
          if (snap.size > 0) {
            const firebaseTestimonials = snap.docs
              .map(d => ({ id: d.id, ...d.data(), source: 'firebase' }))
              .filter(t => t.approved === true);
            if (firebaseTestimonials.length > 0) {
              combined = [...firebaseTestimonials];
            }
          }
        } catch (err) {
          console.error('Error fetching testimonials:', err.message);
        }
      }

      // Fetch from Google Places (prepend to show first)
      const googleData = await fetchGoogleReviews();
      if (googleData?.reviews?.length > 0) {
        const googleReviews = formatGoogleReviews(googleData, googleData.reviews.length);
        combined = [...googleReviews, ...combined];
      }

      if (combined.length === 0) combined = defaultTestimonials;

      setTestimonials(combined);
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`fas fa-star ${i < (rating || 5) ? 'active' : ''}`}></i>
    ));
  };

  const renderAuthorAvatar = (testimonial) => {
    if (testimonial.googleProfilePhoto) {
      return (
        <div className="author-avatar google-avatar">
          <img src={testimonial.googleProfilePhoto} alt={testimonial.name} />
        </div>
      );
    }
    return <div className="author-avatar">{testimonial.initial || testimonial.name?.charAt(0)}</div>;
  };

  const renderAttribution = (testimonial) => {
    if (testimonial.source === 'google') {
      return (
        <div className="google-attribution">
            <img src={`${import.meta.env.BASE_URL}google-icon.svg`} alt="Google" className="google-icon" />
          <span>Google Review</span>
        </div>
      );
    }
    return null;
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <section id="reviews" className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>What Our <span>Customers</span> Say</h2>
          <p>Trusted by families across Valliyur and beyond</p>
          <div className="divider"></div>
        </div>

        <div className="testimonials-carousel-wrapper">
          <div className="testimonials-carousel-track marquee-ltr">
            {/* Render items twice for a seamless infinite loop */}
            {[...testimonials, ...testimonials].map((t, i) => (
              <div className="testimonial-card" key={`${t.id || i}-${i}`} style={{ width: `calc(${100 / visibleCards}% - 2rem)` }}>
                <div className="stars">{renderStars(t.rating)}</div>
                <div className="testimonial-text">
                  <p>"{truncateText(t.text)}"</p>
                  {t.text.length > 100 && (
                    <Link to="/reviews" className="read-more">Read more</Link>
                  )}
                </div>
                 <div className="author">
                   {renderAuthorAvatar(t)}
                   <div className="author-info">
                     <h5>{t.name}</h5>
                     <span>{t.location}</span>
                     {renderAttribution(t)}
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-cta">
          <Link to="/reviews" className="btn btn-gold">View All Reviews</Link>
          <Link to="/reviews/write" className="btn btn-gold">Write a Review</Link>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;