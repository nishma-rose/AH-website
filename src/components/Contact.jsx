function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-header">
          <h2>Visit <span>Our Store</span></h2>
          <p>We'd love to welcome you to our showroom in Valliyur</p>
          <div className="divider"></div>
        </div>
        
        <div className="contact-grid">
          {/* Left Side: Contact Information and Inquiry Form */}
          <div className="contact-info-form fade-up">
            <div className="contact-details">
              <div className="contact-item">
                <div className="icon-box"><i className="fas fa-map-marker-alt"></i></div>
                <div>
                  <h4>Our Address</h4>
                  <p>290B, Near New Bus Stand, Main Road,<br/>Valliyur, Tamil Nadu - 627117</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="icon-box"><i className="fas fa-phone-alt"></i></div>
                <div>
                  <h4>Call Us</h4>
                  <p><a href="tel:+919942440230">+91 99424 40230</a><br/><a href="tel:+917010899270">+91 70108 99270</a></p>
                </div>
              </div>
              <div className="contact-item">
                <div className="icon-box"><i className="fab fa-whatsapp"></i></div>
                <div>
                  <h4>WhatsApp</h4>
                  <p><a href="https://wa.me/919942440230" target="_blank" rel="noopener">Chat with us on WhatsApp</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Google Maps Location */}
          <div className="map-wrapper fade-up">
            <iframe 
              title="A H Jewellers Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d276.90706052726534!2d77.60960303870917!3d8.38793788437091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0467ea7f7d91d9%3A0xec2d8906723f2c2c!2sAH%20JEWELLERS!5e0!3m2!1sen!2sin!4v1767332859053!5m2!1sen!2sin" 
              style={{ border: 0, width: '100%', height: '100%', minHeight: '450px' }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;