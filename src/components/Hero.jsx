import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

function Hero({ slides }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Minimum swipe distance for a touch move to be considered a swipe
  const minSwipeDistance = 50;

  // Filter slides based on the current device and visibility settings
  const displaySlides = useMemo(() => {
    return (slides || []).filter(slide => {
      const visibility = slide.visibility || 'both';
      if (visibility === 'both') return true;
      return isMobile ? visibility === 'mobile' : visibility === 'desktop';
    });
  }, [slides, isMobile]);

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev >= displaySlides.length - 1 ? 0 : prev + 1));
  }, [displaySlides.length]);

  const prevSlide = useCallback(() => {
    setCurrent(prev => (prev <= 0 ? displaySlides.length - 1 : prev - 1));
  }, [displaySlides.length]);

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

  // Ensure current index is valid if the filtered list changes
  useEffect(() => {
    if (current >= displaySlides.length) {
      setCurrent(0);
    }
  }, [displaySlides.length, current]);

  useEffect(() => {
    if (!displaySlides || displaySlides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [displaySlides.length, nextSlide]); // Reset timer when slides change or navigation occurs

  if (!displaySlides || displaySlides.length === 0) return null;

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
        style={{ transform: `translateX(-${Math.min(current, displaySlides.length - 1) * 100}%)` }}
      >
        {displaySlides.map((slide, index) => (
          <div 
            key={slide.id || index}
            className="hero-slide"
            style={{ 
              backgroundImage: `url(${isMobile && slide.mobileImage ? slide.mobileImage : slide.image})`,
              backgroundSize: slide.imageFit || 'cover',
              backgroundPosition: slide.imagePosition || 'center'
            }}
          ></div>
        ))}
      </div>
      
      <div className="hero-dots">
        {displaySlides.map((_, index) => (
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
          {displaySlides[current]?.title && <h1 dangerouslySetInnerHTML={{ __html: displaySlides[current].title }}></h1>}
          {displaySlides[current]?.subtitle && <p>{displaySlides[current].subtitle}</p>}
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