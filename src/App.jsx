import { useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import GoldRates from './components/GoldRates';
import About from './components/About';
import Features from './components/Features';
import Collections from './components/Collections';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const TestimonialsPage = lazy(() => import('./components/TestimonialsPage'));
const WriteReviewPage = lazy(() => import('./components/WriteReviewPage'));

function Loading() {
  return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
}

function AppContent() {
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
      const scrollY = window.scrollY + 130;
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        // Map the 'testimonials' section to the 'Reviews' link
        let selector = `nav a[href="#${id}"]`;
        if (id === 'testimonials') {
          selector = 'nav a[href*="reviews"]';
        }
        
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
      <Hero />
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
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/reviews" element={<TestimonialsPage />} />
          <Route path="/reviews/write" element={<WriteReviewPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;