import { useState, useEffect } from 'react';

function Hero({ slides }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <section id="home" className="hero">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide ${index === current ? 'active' : ''}`}
            style={{ 
              backgroundImage: `url(${slide.image})`,
              backgroundSize: slide.imageFit || 'cover',
              backgroundPosition: slide.imagePosition || 'center'
            }}
          ></div>
        ))}
      </div>
      
      <div className="container" style={{ position: 'relative', zIndex: 2, top:"30px" }}>
        <div className="hero-content" key={current}>
          <span className="hero-badge">{slides[current].badge}</span>
          <h1 dangerouslySetInnerHTML={{ __html: slides[current].title }}></h1>
          <p>{slides[current].subtitle}</p>
          <div className="hero-buttons">
            <a href="#collections" className="btn btn-gold">View Collections</a>
            <a href="https://wa.me/919944558081" target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <i className="fab fa-whatsapp"></i> Chat with Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;