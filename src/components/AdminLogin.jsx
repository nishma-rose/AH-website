import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification('Logged in successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials. Check email and password.');
      showNotification('Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      {notification && (
        <div className={`admin-notification ${notification.type}`}>
          <i className={`fas ${notification.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
          {notification.message}
        </div>
      )}
      <header className="admin-login-header">
        <Link to="/">
          <img src="/logo.png" alt="Logo" />
        </Link>
        <Link to="/" style={{textDecoration: 'none'}}>
          <span>A H JEWELLERS</span>
        </Link>
        <Link to="/" className="btn btn-outline">View Site</Link>
      </header>
      <div className="login-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-gold" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Logging in...</> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;