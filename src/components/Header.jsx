import { useState } from 'react';
import { Link } from 'react-router-dom';

const socialLinks = {
  instagram: 'https://www.instagram.com/ahjewellers_vly?igsh=MWV6YTRjNnVyemZrYg==',
  facebook: 'https://www.facebook.com/share/18DDtX4BxC/',
  youtube: 'https://youtube.com/@ahjewellers?si=75d-fPDgEbta89cL',
  linkedin: 'https://www.linkedin.com/company/ah-jewellers',
  googleMap: 'https://www.google.com/maps/place/AH+JEWELLERS/@8.3879538,77.6096128,17z/data=!3m1!4b1!4m6!3m5!1s0x3b0467ea7f7d91d9:0xec2d8906723f2c2c!8m2!3d8.3879538!4d77.6096128!16s%2Fg%2F11vytd0pfv?hl=en&entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D'
};

function Header({ logoUrl }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
     <header>
       <div className="container">
         <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
           <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
         </button>
         <nav>
           <ul id="nav-menu" className={menuOpen ? 'active' : ''}>
             <li><Link to="/" onClick={closeMenu}>Home</Link></li>
             <li><Link to="/collections" onClick={closeMenu}>Collections</Link></li>
             <li><Link to="/about" onClick={closeMenu}>About</Link></li>
             <li><Link to="/reviews" onClick={closeMenu}>Reviews</Link></li>
             <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
             {/* <li><Link to="/admin" className="admin-link" onClick={closeMenu}>Admin</Link></li> */}
             <li className="mobile-menu-info">
               <div className="mobile-hours">
                 <span>Opening Hours</span>
                 <strong>09:00 AM - 09:00 PM</strong>
               </div>
               <div className="mobile-social">
                 <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                 <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                 <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                 <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                 <a href={socialLinks.googleMap} target="_blank" rel="noopener noreferrer"><i className="fas fa-map-marker-alt"></i></a>
               </div>
             </li>
          </ul>
        </nav>
        <div className="header-info-group">
          <div className="header-hours">
             <span className="info-label">Opening Hours</span>
             <strong>09:00 AM - 09:00 PM</strong>
          </div>
          <div className="header-social">
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href={socialLinks.googleMap} target="_blank" rel="noopener noreferrer" aria-label="Location">
              <i className="fas fa-map-marker-alt"></i>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;