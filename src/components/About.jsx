function About() {
  return (
    <section id="about" className="section" style={{ backgroundColor: 'beige' }}>
      <div className="container">
        <div className="about-grid">
          <div className="about-image fade-up">
            <img src="https://images.stockcake.com/public/4/5/6/456a6bb9-98d0-4bb7-8c4a-a6799d69dd8e_large/elegant-gold-jewelry-stockcake.jpg" alt="Jewellery craftsmanship" />
            <div className="accent-border"></div>
          </div>
          <div className="about-text fade-up">
            <div className="section-header" style={{textAlign:'left', marginBottom:'1.5rem'}}>
              <h2>About <span>A H Jewellers</span></h2>
              <div className="divider" style={{margin:'1rem 0 0'}}></div>
            </div>
            <p>A H Jewellers has been a hallmark of trust and craftsmanship in Valliyur, Tamil Nadu. We are known for offering the purest gold and silver jewellery with complete transparency in pricing and making charges.</p>
            <p>From timeless traditional designs to contemporary styles, our artisans bring your jewellery dreams to life. Every piece is crafted with passion, precision, and a promise of purity.</p>
            <div className="about-stats">
              <div className="stat">
                <h4>916</h4>
                <p>Hallmarked Gold</p>
              </div>
              <div className="stat">
                <h4>1000+</h4>
                <p>Happy Customers</p>
              </div>
              <div className="stat">
                <h4>100%</h4>
                <p>Certified Purity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;