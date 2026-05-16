import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import defaultLogo from '../assets/logo.png';

function AdminLogin({ logoUrl }) {
  const [username, setUsername] = useState('');
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
      // Map the username to a internal email format for Firebase Auth
      const loginEmail = username.includes('@') ? username : `${username.toLowerCase()}@ahjewellers.com`;
      await signInWithEmailAndPassword(auth, loginEmail, password);
      showNotification('Logged in successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid username or password.');
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
           <img src={logoUrl || defaultLogo} alt="Logo" />
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
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="example@gmail.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
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