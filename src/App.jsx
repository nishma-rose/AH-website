import { useEffect, lazy, Suspense, useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Header from './components/Header';
import Hero from './components/Hero';
import GoldRates from './components/GoldRates';
import About from './components/About';
import Features from './components/Features';
import Collections from './components/Collections';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import './App.css';

const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const TestimonialsPage = lazy(() => import('./components/TestimonialsPage'));
const WriteReviewPage = lazy(() => import('./components/WriteReviewPage'));

const DEFAULT_HERO_SLIDES = [
  {
    badge: 'Pure Elegance',
    title: 'Exquisite Gold <em>Collections</em>',
    subtitle: 'Discover timeless craftsmanship and purity in every piece. Trusted by families since generations.',
    image: 'https://images.unsplash.com/photo-1617038224531-16d69b990921?auto=format&fit=crop&w=1950&q=80'
  }
];

function Loading() {
  return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
}

function AppContent({ heroSlides }) {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

    const handleScroll = () => {
      const btn = document.getElementById('scrollTop');
      if (btn) btn.classList.toggle('visible', window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);

    const sections = document.querySelectorAll('section[id]');
    const navScroll = () => {
      const scrollY = window.scrollY + 160;
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        const selector = `nav a[href="#${id}"]`;
        
        const link = document.querySelector(selector);
        if (link) {
          link.classList.toggle('active-nav', scrollY >= top && scrollY < top + height);
        }
      });
    };
    window.addEventListener('scroll', navScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', navScroll);
    };
  }, []);

  return (
    <>
      <div className="main-site-header-stack">
        <GoldRates />
        <Header />
      </div>
      <Hero slides={heroSlides} />
      <Features />
      <Collections />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      const startTime = Date.now();
      try {
        if (db) {
          const snap = await getDocs(collection(db, 'hero_slides'));
          if (snap.size > 0) {
            setHeroSlides(snap.docs.map(d => d.data()));
          } else {
            setHeroSlides(DEFAULT_HERO_SLIDES);
          }
        } else {
          setHeroSlides(DEFAULT_HERO_SLIDES);
        }
      } catch (err) {
        console.error("Initial data load error:", err);
        setHeroSlides(DEFAULT_HERO_SLIDES);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 2500 - elapsed);
        setTimeout(() => setIsInitialLoading(false), remaining);
      }
    };
    loadInitialData();
  }, []);

  return (
    <>
      {isInitialLoading && <Preloader />}
      {!isInitialLoading && (
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/reviews" element={<TestimonialsPage />} />
              <Route path="/reviews/write" element={<WriteReviewPage />} />
              <Route path="/*" element={<AppContent heroSlides={heroSlides} />} />
            </Routes>
          </Suspense>
        </Router>
      )}
    </>
  );
}

export default App;