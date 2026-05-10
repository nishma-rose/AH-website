import React from 'react';
import logo from '../assets/logo.png';

const Preloader = () => {
  return (
    <div style={styles.overlay}>
      <style>
        {`
          @keyframes pulseLogo {
            0% { transform: scale(0.9); opacity: 0.7; filter: drop-shadow(0 0 0px #D4AF37); }
            50% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 15px #D4AF37); }
            100% { transform: scale(0.9); opacity: 0.7; filter: drop-shadow(0 0 0px #D4AF37); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .preloader-animate-in {
            animation: slideUp 1s ease-out forwards;
          }
          .logo-pulse {
            animation: pulseLogo 2s infinite ease-in-out;
          }
        `}
      </style>
      <div style={styles.container} className="preloader-animate-in">
        <div className="logo-pulse">
          <img 
            src={logo} 
            alt="A H Jewellers" 
            style={styles.logo} 
          />
        </div>
        <h1 style={styles.title}>A H JEWELLERS</h1>
        <div style={styles.divider}></div>
        <p style={styles.subtitle}>PURE ELEGANCE SINCE GENERATIONS</p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#050505',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    transition: 'opacity 0.5s ease-out',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '140px',
    marginBottom: '20px',
  },
  title: {
    color: '#D4AF37',
    fontSize: '2.2rem',
    fontWeight: '300',
    letterSpacing: '6px',
    margin: '10px 0',
    fontFamily: 'serif',
  },
  subtitle: {
    color: '#ffffff',
    fontSize: '0.8rem',
    letterSpacing: '3px',
    opacity: 0.6,
  },
  divider: {
    width: '40px',
    height: '1px',
    backgroundColor: '#D4AF37',
    margin: '15px 0',
  }
};

export default Preloader;