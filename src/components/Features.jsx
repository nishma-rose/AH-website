function Features() {
  const features = [
    { icon: 'fa-certificate', title: 'BIS Hallmarked', desc: 'Every piece carries the BIS hallmark guaranteeing 916 gold purity.' },
    { icon: 'fa-hand-sparkles', title: 'Handcrafted', desc: 'Skilled artisans create each piece with intricate detail and care.' },
    { icon: 'fa-tags', title: 'Fair Pricing', desc: 'Transparent pricing with competitive making charges you can trust.' },
    { icon: 'fa-exchange-alt', title: 'Easy Exchange', desc: 'Hassle-free exchange and buyback policy on all our jewellery.' }
  ];

  return (
    <section className="section features-section">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose <span>Us</span></h2>
          <p>We uphold the highest standards of quality and customer satisfaction</p>
          <div className="divider"></div>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card fade-up" key={i}>
              <div className="icon"><i className={`fas ${f.icon}`}></i></div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;