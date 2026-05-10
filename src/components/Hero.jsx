import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const defaultSlides = [
  {
    badge: 'Pure Elegance',
    title: 'Exquisite Gold <em>Collections</em>',
    subtitle: 'Discover timeless craftsmanship and purity in every piece. Trusted by families since generations.',
    image: 'https://images.unsplash.com/photo-1617038224531-16d69b990921?auto=format&fit=crop&w=1950&q=80'
  }
];

function Hero() {
  const [slides, setSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      if (!db) { setLoading(false); return; }
      const snap = await getDocs(collection(db, 'hero_slides'));
      if (snap.size > 0) {
        setSlides(snap.docs.map(d => d.data()));
      }
      setLoading(false);
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

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