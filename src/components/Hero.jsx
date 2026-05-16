import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Hero({ slides }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance for a touch move to be considered a swipe
  const minSwipeDistance = 50;

  const nextSlide = () => {
    setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides, current]); // Reset timer when slide changes manually

  if (!slides || slides.length === 0) return null;

  return (
    <section 
      id="home" 
      className="hero"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="hero-slider"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="hero-slide"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              backgroundSize: slide.imageFit || 'cover',
              backgroundPosition: slide.imagePosition || 'center'
            }}
          ></div>
        ))}
      </div>
      
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-content" key={current}>
          <span className="hero-badge">{slides[current].badge}</span>
          <h1 dangerouslySetInnerHTML={{ __html: slides[current].title }}></h1>
          <p>{slides[current].subtitle}</p>
          {/* <div className="hero-buttons">
            <Link to="/collections" className="btn btn-gold">View Collections</Link>
            <a href="https://wa.me/919944558081" target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <i className="fab fa-whatsapp"></i> Chat with Us
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default Hero;