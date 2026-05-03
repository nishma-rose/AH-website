import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
     <header>
       <div className="container">
         <Link to="/" className="logo-link">
            <img src={logo} className="logo-img" alt="A H Jewellers Logo" />
           <span className="logo-text">A H JEWELLERS</span>
         </Link>
         <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
           <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
         </button>
         <nav>
           <ul id="nav-menu" className={menuOpen ? 'active' : ''}>
             <li><a href="#home" onClick={closeMenu}>Home</a></li>
             <li><a href="#about" onClick={closeMenu}>About</a></li>
             <li><a href="#collections" onClick={closeMenu}>Collections</a></li>
             <li><Link to="/reviews" onClick={closeMenu}>Reviews</Link></li>
             <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
             {/* <li><Link to="/admin" className="admin-link" onClick={closeMenu}>Admin</Link></li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;