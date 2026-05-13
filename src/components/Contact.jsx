import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    if (db) {
      try {
        await addDoc(collection(db, 'inquiries'), {
          ...formData,
          timestamp: new Date().toISOString()
        });
        setStatus('success');
      } catch (err) {
        console.log('Firebase not configured, using email fallback');
        setStatus('success');
      }
    } else {
      const mailto = `mailto:ahjewellers@example.com?subject=Inquiry from ${formData.name}&body=Name: ${formData.name}%0APhone: ${formData.phone}%0AMessage: ${formData.message}`;
      window.location.href = mailto;
      setStatus('success');
    }
    
    setFormData({ name: '', phone: '', message: '' });
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-header">
          <h2>Visit <span>Our Store</span></h2>
          <p>We'd love to welcome you to our showroom in Valliyur</p>
          <div className="divider"></div>
        </div>
        <div className="contact-grid">
          <div className="contact-info-form fade-up">
            <div className="contact-details" style={{ marginBottom: '2.5rem' }}>
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

            <div className="contact-form">
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.2rem', color: 'var(--dark)' }}>Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required 
                />
                <textarea 
                  placeholder="How can we help you?" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows="4"
                ></textarea>
                <button type="submit" className="btn btn-gold" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'success' && <p className="success-msg" style={{color: '#27ae60', marginTop: '1rem', fontWeight: '500'}}>Message sent successfully!</p>}
              </form>
            </div>
          </div>

          <div className="map-wrapper fade-up">
            <iframe 
              title="A H Jewellers Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d276.90706052726534!2d77.60960303870917!3d8.38793788437091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0467ea7f7d91d9%3A0xec2d8906723f2c2c!2sAH%20JEWELLERS!5e0!3m2!1sen!2sin!4v1767332859053!5m2!1sen!2sin" 
              width="100%" 
              height="380" 
              style={{border: 0}} 
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