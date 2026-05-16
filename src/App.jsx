import { useEffect, lazy, Suspense, useState, useLayoutEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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
import logo from './assets/logo.png';
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

function AppContent({ heroSlides, logoUrl, rates }) {
  const location = useLocation();

  // Handle scrolling when the URL path changes (e.g., from / to /contact)
  useLayoutEffect(() => {
    // Extract the section name from the path (remove base and slashes)
    const path = location.pathname.replace(/^\/|\/$/g, '');
    
    const sectionMap = {
      '': 'home',
      'collections': 'collections',
      'about': 'about',
      'reviews': 'reviews',
      'contact': 'contact'
    };

    const targetId = sectionMap[path];
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 130; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

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
        
        // Update selector to match the new Link paths
        const path = id === 'home' ? '' : id;
        const selector = `nav a[href="#/${path}"]`;
        
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
        <GoldRates logoUrl={logoUrl} initialRates={rates} />
        <Header logoUrl={logoUrl} />
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
  const [rates, setRates] = useState(null);
  // Load logo from cache immediately to prevent delay in Preloader on return visits
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('ah_logo_cache') || '');

  useEffect(() => {
    if (logoUrl) {
      // Force browser to refresh the icon by removing and re-appending the tags
      ['icon', 'shortcut icon', 'apple-touch-icon'].forEach(rel => {
        const existingLink = document.querySelector(`link[rel="${rel}"]`);
        const link = existingLink || document.createElement('link');
        link.rel = rel;
        link.href = logoUrl;
        if (!existingLink) document.head.appendChild(link);
        else { link.parentNode.removeChild(link); document.head.appendChild(link); }
      });
    }
  }, [logoUrl]);

  useEffect(() => {
    const loadInitialData = async () => {
      const startTime = Date.now();
      try {
        if (db) {
          // Fetch logo independently and update state as soon as it arrives
          // This ensures the Preloader updates without waiting for the Hero Slides query
          const logoPromise = getDoc(doc(db, 'config', 'logo')).then((logoSnap) => {
            if (logoSnap.exists()) {
              const remoteLogo = logoSnap.data().url;
              setLogoUrl(remoteLogo);
              localStorage.setItem('ah_logo_cache', remoteLogo); // Cache for next load
            }
          });

          // Fetch Gold Rates
          const ratesPromise = (async () => {
            try {
              let apiUrl = 'https://api.npoint.io/be02080f625fe3dcf48a';
              const configSnap = await getDoc(doc(db, 'config', 'ratesApi'));
              if (configSnap.exists() && configSnap.data().url) {
                apiUrl = configSnap.data().url;
              }
              const response = await fetch(`${apiUrl}?nocache=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
              });
              const data = await response.json();
              const goldRate = data.Gold916 || data.gold;
              const silverRate = data.Silver || data.silver;
              if (goldRate) {
                const fetchedRates = {
                  gold: goldRate,
                  silver: silverRate || null,
                  date: data.LastUpdated || data.lastUpdated || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                };
                setRates(fetchedRates);
                return fetchedRates;
              }
            } catch (e) {
              console.error("Rates fetch error:", e);
            }
            return null;
          })();

          const heroSnap = await getDocs(collection(db, 'hero_slides'));
          if (!heroSnap.empty) {
            setHeroSlides(heroSnap.docs.map(d => d.data()));
          } else {
            setHeroSlides(DEFAULT_HERO_SLIDES);
          }

          // Ensure both logo and rates are finalized before ending the preloader
          await Promise.all([logoPromise, ratesPromise]);
        } else {
          setHeroSlides(DEFAULT_HERO_SLIDES);
        }
      } catch (err) {
        console.error("Initial data load error:", err);
        setHeroSlides(DEFAULT_HERO_SLIDES);
      } finally {
        const elapsed = Date.now() - startTime;
        // Reduced minimum display time to 1500ms for a snappier user experience
        const remaining = Math.max(0, 1500 - elapsed);
        setTimeout(() => setIsInitialLoading(false), remaining);
      }
    };
    loadInitialData();
  }, []);

  return (
    <>
      {isInitialLoading && <Preloader logoUrl={logoUrl || logo} />}
      {!isInitialLoading && (
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/admin" element={<AdminLogin logoUrl={logoUrl} />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/reviews" element={<TestimonialsPage logoUrl={logoUrl} />} />
              <Route path="/reviews/write" element={<WriteReviewPage logoUrl={logoUrl} />} />
              <Route path="/*" element={<AppContent heroSlides={heroSlides} logoUrl={logoUrl} rates={rates} />} />
            </Routes>
          </Suspense>
        </Router>
      )}
    </>
  );
}

export default App;