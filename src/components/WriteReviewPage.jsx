import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { StarRating, ReviewForm } from './ReviewForm';
import logo from '../assets/logo.png';

function WriteReviewPage({ logoUrl }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    console.log('Submitting review with data:', formData);
    console.log('Database available:', !!db);
    
    if (!db) {
      alert('Firebase not connected. Please try again later.');
      setSubmitting(false);
      return;
    }
    
    try {
      const reviewData = {
        ...formData,
        timestamp: new Date().toISOString(),
        approved: false
      };
      
      console.log('Writing to Firestore:', reviewData);
      
      const docRef = await addDoc(collection(db, 'testimonials'), reviewData);
      console.log('Review saved with ID:', docRef.id);
      
      alert('Thank you! Your review has been submitted and will appear after approval.');
      navigate('/reviews');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Error submitting review: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="write-review-page">
      <header className="site-header">
        <div className="site-header-left">
          <Link to="/">
              <img src={logoUrl || logo} alt="Logo" />
          </Link>
          <Link to="/" className="site-header-title">
            <span>A H JEWELLERS</span>
          </Link>
        </div>
        <div className="site-header-right">
          <Link to="/" className="btn btn-outline">View Site</Link>
        </div>
      </header>

      <section className="wr-hero">
        <div className="container">
          <button onClick={() => navigate('/reviews')} className="back-link">
            <i className="fas fa-arrow-left"></i> Back to Reviews
          </button>
          <h1>Write a Review</h1>
          <p>Share your experience with A H Jewellers</p>
        </div>
      </section>

      <section className="wr-form-section">
        <div className="container">
          <ReviewForm onSubmit={handleSubmit} submitting={submitting} />
        </div>
      </section>
    </div>
  );
}

export default WriteReviewPage;