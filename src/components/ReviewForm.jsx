import { useState } from 'react';

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= (hover || value) ? 'active' : ''}`}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
        >
          <i className={`fas fa-star`}></i>
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState({ name: '', location: '', text: '', rating: 5 });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) return;
    
    setStatus('sending');
    try {
      await onSubmit({ ...form, initial: form.name.charAt(0).toUpperCase() });
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const getButtonText = () => {
    if (submitting || status === 'sending') return 'Submitting...';
    if (status === 'success') return 'Thank You!';
    return 'Submit Review';
  };

  return (
    <div className="review-form-container">
      <h2>Share Your Experience</h2>
      <p>Your review helps us improve and helps others make informed decisions</p>
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Your Rating</label>
          <StarRating value={form.rating} onChange={(r) => setForm({...form, rating: r})} />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Your Name *</label>
            <input 
              type="text" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              value={form.location}
              onChange={(e) => setForm({...form, location: e.target.value})}
              placeholder="City/Town"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Your Review *</label>
          <textarea 
            value={form.text}
            onChange={(e) => setForm({...form, text: e.target.value})}
            placeholder="Share your experience with A H Jewellers..."
            rows="4"
            required
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-gold" disabled={submitting || status === 'sending'}>
          {getButtonText()}
        </button>
        
        {status === 'error' && <p className="error-msg">Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}

export { StarRating, ReviewForm };
export default ReviewForm;