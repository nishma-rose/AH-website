import { useEffect } from 'react';
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
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import TestimonialsPage from './components/TestimonialsPage';
import WriteReviewPage from './components/WriteReviewPage';
import './App.css';

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
      const scrollY = window.scrollY + 100;
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`nav a[href="#${id}"]`);
        if (link) link.style.color = (scrollY >= top && scrollY < top + height) ? '#D4AF37' : '';
      });
    };
    window.addEventListener('scroll', navScroll);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.log);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', navScroll);
    };
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <GoldRates />
      <About />
      <Features />
      <Collections />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/reviews" element={<TestimonialsPage />} />
        <Route path="/reviews/write" element={<WriteReviewPage />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;