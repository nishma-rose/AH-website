import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, updateDoc, query, limit } from 'firebase/firestore';
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
  const [activeTab, setActiveTab] = useState('collections');
  const [collections, setCollections] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [rates, setRates] = useState({ gold: '', silver: '' });
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

  const fetchData = async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const collSnap = await getDocs(collection(db, 'collections'));
      setCollections(collSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const testSnap = await getDocs(collection(db, 'testimonials'));
      const allTestimonials = testSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTestimonials(allTestimonials.filter(t => t.approved === true));
      setPendingReviews(allTestimonials.filter(t => t.approved !== true));
      
      const rateSnap = await getDocs(query(collection(db, 'rates'), limit(1)));
      if (!rateSnap.empty) {
        setRates(rateSnap.docs[0].data());
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
            <img src="/logo.png" alt="Logo" />
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
        <button className={activeTab === 'collections' ? 'active' : ''} onClick={() => setActiveTab('collections')}>Collections</button>
        <button className={activeTab === 'testimonials' ? 'active' : ''} onClick={() => setActiveTab('testimonials')}>
          Testimonials {pendingReviews.length > 0 && <span className="badge">{pendingReviews.length}</span>}
        </button>
        <button className={activeTab === 'rates' ? 'active' : ''} onClick={() => setActiveTab('rates')}>Gold Rates</button>
      </nav>

      <main className="admin-content">
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
          <RatesManager rates={rates} setRates={setRates} onSave={updateRates} showNotification={showNotification} />
        )}
      </main>
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

function RatesManager({ rates, setRates, onSave, showNotification }) {
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('ratesApiUrl') || '');
  const [fetchFromApi, setFetchFromApi] = useState(false);

  const handleApiUrlSave = () => {
    localStorage.setItem('ratesApiUrl', apiUrl);
    showNotification('API URL saved successfully!');
  };

  const handleFetchFromApi = async () => {
    if (!apiUrl) {
      alert('Please enter an API URL first');
      return;
    }
    setFetchFromApi(true);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const goldRate = data.Gold916 || data.gold;
      const silverRate = data.Silver || data.silver;
      if (goldRate) {
        setRates({ gold: goldRate, silver: silverRate || '' });
        showNotification('Rates fetched successfully!');
      } else {
        alert('Invalid API response format');
      }
    } catch (err) {
      alert('Failed to fetch from API: ' + err.message);
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
              value={apiUrl} 
              onChange={e => setApiUrl(e.target.value)} 
              placeholder="https://api.npoint.io/..."
            />
            <button type="button" onClick={handleApiUrlSave} className="btn btn-sm">Save URL</button>
          </div>
        </div>
        <div className="form-group" style={{margin: "20px 0 0 0"}}>
          <label>Current API URL: {localStorage.getItem('ratesApiUrl') || 'Not set'}</label>
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