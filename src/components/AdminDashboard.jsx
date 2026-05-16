import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, updateDoc, query, limit, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function useNotification() {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return { notification, showNotification };
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('hero');
  const [collections, setCollections] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [rates, setRates] = useState({ gold: '', silver: '' });
  const [ratesApiUrl, setRatesApiUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { notification, showNotification } = useNotification();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/admin');
    });
    fetchData();
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (logoUrl) {
      const favicon = document.querySelector("link[rel*='icon']");
      const appleIcon = document.querySelector("link[rel='apple-touch-icon']");
      
      if (favicon) favicon.href = logoUrl;
      if (appleIcon) appleIcon.href = logoUrl;
    }
  }, [logoUrl]);

  const fetchData = async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const collSnap = await getDocs(collection(db, 'collections'));
      setCollections(collSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const heroSnap = await getDocs(collection(db, 'hero_slides'));
      setHeroSlides(heroSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const testSnap = await getDocs(collection(db, 'testimonials'));
      const allTestimonials = testSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTestimonials(allTestimonials.filter(t => t.approved === true));
      setPendingReviews(allTestimonials.filter(t => t.approved !== true));

      const rateSnap = await getDocs(query(collection(db, 'rates'), limit(1)));
      if (!rateSnap.empty) {
        setRates(rateSnap.docs[0].data());
      }
      
      const configSnap = await getDoc(doc(db, 'config', 'ratesApi'));
      if (configSnap.exists()) {
        setRatesApiUrl(configSnap.data().url || '');
      }

      const logoSnap = await getDoc(doc(db, 'config', 'logo'));
      if (logoSnap.exists()) {
        setLogoUrl(logoSnap.data().url || '');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    showNotification('Logged out successfully', 'success');
    navigate('/admin');
  };

  const addCollection = async (item) => {
    if (!db) return;
    setSaving(true);
    await addDoc(collection(db, 'collections'), item);
    fetchData();
    setSaving(false);
    showNotification('Collection added successfully!');
  };

  const deleteCollection = async (id) => {
    if (!db) return;
    await deleteDoc(doc(db, 'collections', id));
    fetchData();
    showNotification('Collection deleted', 'error');
  };

  const addHeroSlide = async (item) => {
    if (!db) return;
    setSaving(true);
    await addDoc(collection(db, 'hero_slides'), item);
    fetchData();
    setSaving(false);
    showNotification('Hero slide added!');
  };

  const deleteHeroSlide = async (id) => {
    if (!db) return;
    await deleteDoc(doc(db, 'hero_slides', id));
    fetchData();
    showNotification('Hero slide removed', 'error');
  };

  const updateHeroSlide = async (id, item) => {
    if (!db) return;
    setSaving(true);
    await updateDoc(doc(db, 'hero_slides', id), item);
    fetchData();
    setSaving(false);
    showNotification('Hero slide updated!');
  };

  const addTestimonial = async (item) => {
    if (!db) return;
    setSaving(true);
    await addDoc(collection(db, 'testimonials'), { ...item, timestamp: new Date().toISOString(), approved: true });
    fetchData();
    setSaving(false);
    showNotification('Testimonial added successfully!');
  };

  const deleteTestimonial = async (id) => {
    if (!db) return;
    await deleteDoc(doc(db, 'testimonials', id));
    fetchData();
    showNotification('Testimonial deleted', 'error');
  };

  const approveReview = async (id) => {
    if (!db) return;
    await updateDoc(doc(db, 'testimonials', id), { approved: true });
    fetchData();
    showNotification('Review approved successfully!');
  };

  const rejectReview = async (id) => {
    if (!db) return;
    await deleteDoc(doc(db, 'testimonials', id));
    fetchData();
    showNotification('Review rejected', 'error');
  };

  const updateRates = async () => {
    if (!db) return;
    setSaving(true);
    await setDoc(doc(db, 'rates', 'current'), { 
      ...rates, 
      updatedAt: new Date().toISOString() 
    });
    fetchData();
    setSaving(false);
    showNotification('Rates updated successfully!');
  };

  const saveRatesApiUrl = async (url) => {
    if (!db) return;
    await setDoc(doc(db, 'config', 'ratesApi'), { url, updatedAt: new Date().toISOString() });
    setRatesApiUrl(url);
    showNotification('API URL saved successfully!');
  };

  const updateLogo = async (url) => {
    if (!db) return;
    setSaving(true);
    await setDoc(doc(db, 'config', 'logo'), { url, updatedAt: new Date().toISOString() });
    setLogoUrl(url);
    setSaving(false);
    showNotification('Logo updated successfully!');
  };

  if (loading) return (
    <div className="admin-loading">
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {notification && (
        <div className={`admin-notification ${notification.type}`}>
          <i className={`fas ${notification.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
          {notification.message}
        </div>
      )}
      {saving && (
        <div className="admin-saving">
          <i className="fas fa-spinner fa-spin"></i> Saving...
        </div>
      )}
      <header className="admin-header">
        <div className="admin-header-left">
          <Link to="/">
              <img src={logoUrl || `${import.meta.env.BASE_URL}logo.png`} alt="Logo" />
          </Link>
          <Link to="/" className="admin-header-title">
            <span>A H JEWELLERS</span>
          </Link>
        </div>
        <div className="admin-header-right">
          <Link to="/" className="btn btn-outline btn-sm">View Site</Link>
          <button onClick={handleLogout} className="btn btn-outline">Logout</button>
        </div>
      </header>
      
      <nav className="admin-tabs">
        <button className={activeTab === 'logo' ? 'active' : ''} onClick={() => setActiveTab('logo')}>Logo</button>
        <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => setActiveTab('hero')}>Hero Slider</button>
        <button className={activeTab === 'collections' ? 'active' : ''} onClick={() => setActiveTab('collections')}>Collections</button>
        <button className={activeTab === 'testimonials' ? 'active' : ''} onClick={() => setActiveTab('testimonials')}>
          Testimonials {pendingReviews.length > 0 && <span className="badge">{pendingReviews.length}</span>}
        </button>
        <button className={activeTab === 'rates' ? 'active' : ''} onClick={() => setActiveTab('rates')}>Gold Rates</button>
      </nav>

      <main className="admin-content">
        {activeTab === 'logo' && (
          <LogoManager currentLogo={logoUrl} onUpload={updateLogo} showNotification={showNotification} setSaving={setSaving} />
        )}
        {activeTab === 'hero' && (
          <HeroSlideManager 
            slides={heroSlides} 
            onAdd={addHeroSlide} 
            onDelete={deleteHeroSlide} 
            onUpdate={updateHeroSlide} 
          />
        )}
        {activeTab === 'collections' && (
          <CollectionManager collections={collections} onAdd={addCollection} onDelete={deleteCollection} />
        )}
        {activeTab === 'testimonials' && (
          <TestimonialManager 
            testimonials={testimonials} 
            pendingReviews={pendingReviews}
            onAdd={addTestimonial} 
            onDelete={deleteTestimonial}
            onApprove={approveReview}
            onReject={rejectReview}
          />
        )}
        {activeTab === 'rates' && (
          <RatesManager rates={rates} setRates={setRates} onSave={updateRates} showNotification={showNotification} apiUrl={ratesApiUrl} onSaveApiUrl={saveRatesApiUrl} />
        )}
      </main>
    </div>
  );
}

function LogoManager({ currentLogo, onUpload, showNotification, setSaving }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentLogo);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Firestore documents have a 1MB limit. 
    // Storing as Base64 increases size, so we limit the file to 500KB.
    if (file.size > 500 * 1024) {
      showNotification('Logo file is too large. Please select an image under 500KB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => {
      setUploading(true);
      if (setSaving) setSaving(true);
    };
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setPreview(base64Data);
      try {
        // Save the Base64 string directly to Firestore
        await onUpload(base64Data);
      } catch (err) {
        showNotification('Failed to save logo to database.', 'error');
      } finally {
        setUploading(false);
        if (setSaving) setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="manager">
      <h2>Store Logo Update</h2>
      <div className="add-form" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <p>Preview:</p>
        <img src={preview || `${import.meta.env.BASE_URL}logo.png`} alt="Logo Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--gold)', margin: '15px 0', objectFit: 'cover' }} />
        <label className="btn btn-gold" style={{ cursor: 'pointer' }}>
          {uploading ? 'Uploading...' : 'Upload Logo from Device'}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

function HeroSlideManager({ slides, onAdd, onDelete, onUpdate }) {
  const [form, setForm] = useState({ 
    title: '',
    subtitle: '', 
    image: '', 
    badge: 'Pure Elegance',
    imageFit: 'cover',
    imagePosition: 'center'
  });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, form);
      setEditingId(null);
    } else {
      onAdd(form);
    }
    setForm({ title: '', subtitle: '', image: '', badge: 'Pure Elegance', imageFit: 'cover', imagePosition: 'center' });
  };
  const startEdit = (slide) => {
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      image: slide.image,
      badge: slide.badge,
      imageFit: slide.imageFit || 'cover',
      imagePosition: slide.imagePosition || 'center'
    });
    setEditingId(slide.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="manager">
      <h2>Manage Hero Slides</h2>
      <form onSubmit={handleSubmit} className="add-form">
        <input placeholder="Badge (e.g. Pure Elegance)" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} />
        <input placeholder="Main Title (use <em> for gold text) *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
        <input placeholder="Gold Image URL *" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
        <input placeholder="Image Fit (cover, contain, or e.g. 100% 80%)" value={form.imageFit} onChange={e => setForm({...form, imageFit: e.target.value})} />
        <input placeholder="Image Position (center, top, or e.g. 50% 20%)" value={form.imagePosition} onChange={e => setForm({...form, imagePosition: e.target.value})} />
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button type="submit" className="btn btn-gold">
            {editingId ? 'Update Slide' : 'Add Slide'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn" 
              style={{ background: "#e74c3c",
    color: "white"}} 
              onClick={() => {
                setEditingId(null);
                setForm({ title: '', subtitle: '', image: '', badge: 'Pure Elegance', imageFit: 'cover', imagePosition: 'center' });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="items-grid">
        {slides.map(s => (
          <div key={s.id} className="item-card">
            <img src={s.image} alt={s.title} />
            <h3>{s.title.replace(/<[^>]*>?/gm, '')}</h3>
            <p>{s.subtitle}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => startEdit(s)} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>Edit</button>
              <button onClick={() => onDelete(s.id)} className="delete-btn" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionManager({ collections, onAdd, onDelete }) {
  const [form, setForm] = useState({ title: '', description: '', image: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      alert('Title and Image URL are required');
      return;
    }
    onAdd(form);
    setForm({ title: '', description: '', image: '' });
  };

  return (
    <div className="manager">
      <h2>Manage Collections</h2>
      <form onSubmit={handleSubmit} className="add-form">
        <input placeholder="Title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <input placeholder="Image URL *" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
        <button type="submit" className="btn btn-gold">Add Collection</button>
      </form>
      <div className="items-grid">
        {collections.length === 0 ? <p>No collections yet</p> : collections.map(c => (
          <div key={c.id} className="item-card">
            <img src={c.image} alt={c.title} onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'} />
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <button onClick={() => onDelete(c.id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialManager({ testimonials, pendingReviews, onAdd, onDelete, onApprove, onReject }) {
  const [form, setForm] = useState({ name: '', location: '', text: '', initial: '', rating: 5 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.text) {
      alert('Name and Review text are required');
      return;
    }
    onAdd({ ...form, initial: form.name.charAt(0).toUpperCase() });
    setForm({ name: '', location: '', text: '', initial: '', rating: 5 });
  };

  return (
    <div className="manager">
      <h2>Manage Testimonials</h2>
      
      {pendingReviews.length > 0 && (
        <div className="pending-section">
          <h3>Pending Reviews ({pendingReviews.length})</h3>
          <div className="pending-list">
            {pendingReviews.map(r => (
              <div key={r.id} className="pending-item">
                <div className="pending-info">
                  <div className="pending-header">
                    <strong>{r.name}</strong>
                    <span className="pending-rating">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < (r.rating || 5) ? 'active' : ''}`}></i>
                      ))}
                    </span>
                  </div>
                  <span className="pending-location">{r.location}</span>
                  <p>{r.text}</p>
                </div>
                <div className="pending-actions">
                  <button onClick={() => onApprove(r.id)} className="approve-btn">Approve</button>
                  <button onClick={() => onReject(r.id)} className="delete-btn">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3>Add New Testimonial</h3>
      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-group">
          <label>Rating</label>
          <div className="rating-select">
            {[1,2,3,4,5].map(r => (
              <i 
                key={r} 
                className={`fas fa-star ${r <= form.rating ? 'active' : ''}`}
                onClick={() => setForm({...form, rating: r})}
              ></i>
            ))}
          </div>
        </div>
        <input placeholder="Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
        <textarea placeholder="Review Text *" value={form.text} onChange={e => setForm({...form, text: e.target.value})} required />
        <button type="submit" className="btn btn-gold">Add Testimonial</button>
      </form>
      
      <h3>Approved Testimonials</h3>
      <div className="items-list">
        {testimonials.length === 0 ? <p>No approved testimonials yet</p> : testimonials.map(t => (
          <div key={t.id} className="item-row">
            <div className="item-row-content">
              <div className="rating-display">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < (t.rating || 5) ? 'active' : ''}`}></i>
                ))}
              </div>
              <span><strong>{t.name}</strong> - {t.location}</span>
              <p className="item-row-text">{t.text}</p>
            </div>
            <button onClick={() => onDelete(t.id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatesManager({ rates, setRates, onSave, showNotification, apiUrl, onSaveApiUrl }) {
  const [localApiUrl, setLocalApiUrl] = useState(apiUrl || '');
  const [fetchFromApi, setFetchFromApi] = useState(false);

  const handleApiUrlSave = () => {
    if (localApiUrl) {
      onSaveApiUrl(localApiUrl);
    }
  };

  const handleFetchFromApi = async () => {
    const urlToFetch = localApiUrl || apiUrl;
    if (!urlToFetch) {
      showNotification('Please enter an API URL first', 'error');
      return;
    }
    setFetchFromApi(true);
    try {
      const response = await fetch(`${urlToFetch}${urlToFetch.includes('?') ? '&' : '?'}nocache=${Date.now()}`, {
        mode: 'cors',
        cache: 'no-store',
        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) {
        throw new Error('API response not OK (' + response.status + ')');
      }
      const data = await response.json();
      const goldRate = data.Gold916 || data.gold;
      const silverRate = data.Silver || data.silver;
      if (goldRate) {
        setRates({ gold: goldRate, silver: silverRate || '' });
        showNotification('Rates fetched successfully!');
      } else {
        showNotification('Invalid API response format', 'error');
      }
    } catch (err) {
      showNotification('Failed to fetch: ' + err.message, 'error');
    } finally {
      setFetchFromApi(false);
    }
  };

  return (
    <div className="manager">
      <h2>Update Gold & Silver Rates</h2>
      
      <div className="api-config-section">
        <h3 style={{marginBottom:"20px"}}>API Configuration</h3>
        <div className="form-group">
          <label>Rate API URL</label>
          <div className="api-url-row">
            <input style={{
    padding: "15px",
    margin: "0 20px 0 0",
    width: "400px"
}}
              type="text" 
              value={localApiUrl} 
              onChange={e => setLocalApiUrl(e.target.value)} 
              placeholder="https://api.npoint.io/..."
            />
            <button type="button" onClick={handleApiUrlSave} className="btn btn-sm">Save URL</button>
          </div>
        </div>
        <div className="form-group" style={{margin: "20px 0 0 0"}}>
          <label>Current API URL: {localApiUrl || apiUrl || 'Not set'}</label>
          <button 
            type="button" style={{marginLeft: "20px"}}
            onClick={handleFetchFromApi} 
            className="btn btn-gold"
            disabled={fetchFromApi}
          >
            {fetchFromApi ? 'Fetching...' : 'Fetch from API'}
          </button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="rates-form">
         <h3 style={{marginBottom:"20px"}}>Manual Update</h3>
        <div className="form-group">
          <label>Gold 916 (per gram) ₹</label>
          <input type="text" value={rates.gold} onChange={e => setRates({...rates, gold: e.target.value})} placeholder="e.g. 7650" />
        </div>
        <div className="form-group">
          <label>Silver (per gram) ₹</label>
          <input type="text" value={rates.silver} onChange={e => setRates({...rates, silver: e.target.value})} placeholder="e.g. 95" />
        </div>
        <button type="submit" className="btn btn-gold">Update Rates</button>
      </form>
    </div>
  );
}

export default AdminDashboard;