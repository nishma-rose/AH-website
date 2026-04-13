function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">A H JEWELLERS</div>
            <p>Valliyur's Trusted Jewellery Destination</p>
          </div>
          <div className="footer-social">
            <a href="https://wa.me/919942440230" target="_blank" rel="noopener" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            <a href="tel:+919942440230" aria-label="Call us"><i className="fas fa-phone-alt"></i></a>
            <a href="https://maps.app.goo.gl/AHJewellers" target="_blank" rel="noopener" aria-label="Google Maps"><i className="fas fa-map-marker-alt"></i></a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 A H Jewellers, Valliyur. All Rights Reserved.</p>
        </div>
      </div>
      <a href="https://wa.me/919942440230" className="whatsapp-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <i className="fab fa-whatsapp"></i>
      </a>
      <button className="scroll-top" id="scrollTop" onClick={() => window.scrollTo({top:0})} aria-label="Scroll to top">
        <i className="fas fa-chevron-up"></i>
      </button>
    </footer>
  );
}

export default Footer;