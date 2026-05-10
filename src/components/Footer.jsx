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
            <a href="https://www.google.com/maps/place/AH+JEWELLERS/@8.3879538,77.6096128,17z/data=!3m1!4b1!4m6!3m5!1s0x3b0467ea7f7d91d9:0xec2d8906723f2c2c!8m2!3d8.3879538!4d77.6096128!16s%2Fg%2F11vytd0pfv?hl=en&entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="Google Maps"><i className="fas fa-map-marker-alt"></i></a>
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