import { useState, useEffect } from 'react';
import { content } from './data/content';
import './index.css';

/* ── NAVBAR ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#approach', label: 'Approach' },
    { href: '#experience', label: 'Experience' },
    { href: '#families', label: 'For Families' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo">L</div>
          <div>
            <div className="navbar-name">{content.personal.name}</div>
            <div className="navbar-subtitle">Child and Youth Care</div>
          </div>
        </div>
        <div className={`navbar-nav${open ? ' open' : ''}`}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}>
            <button className="btn-primary">Book a Conversation</button>
          </a>
        </div>
        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">🌿 Child and Youth Care Practitioner</div>
            <h1 className="hero-title">
              Care that <em>transforms</em>. Support that <em>empowers</em>.
            </h1>
            <p className="hero-desc">
              Psychology and Child and Youth Care for children, adolescents and their families.
              Evidence-based emotional support with genuine listening and respect for each person's individuality.
            </p>
            <div className="hero-actions">
              <a href="#contact"><button className="btn-primary">✉ Book a Conversation</button></a>
              <a href="#about"><button className="btn-outline">Learn About My Work</button></a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-blob">
              <span className="hero-blob-emoji">🌿</span>
              <div className="hero-float-card">
                <span className="hero-float-icon">💚</span>
                <span>Care with empathy</span>
              </div>
              <div className="hero-float-card">
                <span className="hero-float-icon">⭐</span>
                <span>12+ years of experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PILLARS ── */
function Pillars() {
  return (
    <section className="pillars">
      <div className="container">
        <div className="pillars-grid">
          {content.pillars.map(p => (
            <div key={p.title} className="pillar-item">
              <div className="pillar-icon">{p.icon}</div>
              <div className="pillar-title">{p.title}</div>
              <div className="pillar-desc">{p.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About() {
  const { highlights } = content;
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-inner">
          <div className="about-visual">
            <div className="about-card">
              <p className="about-quote">
                "My goal is to support children, empower them in their strengths, and build the
                conditions to transform adversities into growth potential."
              </p>
              <div className="about-badge">
                <span className="badge badge-green">🎓 Psychologist</span>
                <span className="badge badge-terra">🏫 CYC Practitioner</span>
                <span className="badge badge-green">🇧🇷→🇨🇦 Recife → London</span>
              </div>
            </div>
          </div>
          <div className="about-text">
            <span className="section-label">About Me</span>
            <h2 className="section-title">A journey dedicated to care</h2>
            {content.biography.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="about-highlights">
              {highlights.slice(0, 6).map(h => (
                <div key={h} className="about-highlight">{h}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SERVICES ── */
function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services-header">
          <span className="section-label">Services</span>
          <h2 className="section-title">How I can help</h2>
          <p className="section-desc">
            Specialized support for children, adolescents and families across school, clinical and community settings.
          </p>
        </div>
        <div className="services-grid">
          {content.services.map(s => (
            <div key={s.title} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <div className="service-title">{s.title}</div>
              <div className="service-desc">{s.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── APPROACH ── */
function Approach() {
  const { approach } = content;
  return (
    <section className="approach" id="approach">
      <div className="container">
        <div className="approach-inner">
          <div>
            <span className="section-label">Approach</span>
            <h2 className="section-title">{approach.title}</h2>
            <p className="section-desc" style={{ marginBottom: '16px' }}>{approach.description}</p>
            <div style={{ marginTop: '28px' }}>
              <div style={{ background: 'var(--green)', borderRadius: '16px', padding: '28px', color: 'white' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌱</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "Nurturing minds, growing possibilities."
                </div>
                <div style={{ fontSize: '0.85rem', marginTop: '12px', opacity: 0.8 }}>— Lorena Santana</div>
              </div>
            </div>
          </div>
          <div className="approach-principles">
            {approach.principles.map(p => (
              <div key={p.title} className="principle-item">
                <div className="principle-title">{p.title}</div>
                <div className="principle-desc">{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── EXPERIENCE ── */
function Experience() {
  const icons = ['💼', '🏫', '🏫', '🧠'];
  return (
    <section className="experience" id="experience">
      <div className="container">
        <div className="experience-header">
          <span className="section-label">Experience</span>
          <h2 className="section-title">Professional Journey</h2>
        </div>
        <div className="timeline">
          {content.experience.map((exp, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot">{icons[i] ?? '✦'}</div>
              <div className="timeline-card">
                <div className="timeline-period">{exp.period}</div>
                <div className="timeline-role">{exp.role}</div>
                <div className="timeline-company">{exp.company} · {exp.location}</div>
                <ul className="timeline-list">
                  {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── EDUCATION & CERTIFICATIONS ── */
function EduCerts() {
  return (
    <section className="edu-certs" id="education">
      <div className="container">
        <div className="edu-certs-inner">
          <div>
            <span className="section-label">Education</span>
            <h3 className="edu-certs-title">Academic Background</h3>
            {content.education.map(e => (
              <div key={e.degree} className="edu-item">
                <div className="edu-degree">{e.degree}</div>
                <div className="edu-inst">{e.institution} — {e.location}</div>
                <div className="edu-period">{e.period}</div>
              </div>
            ))}
          </div>
          <div>
            <span className="section-label">Certifications</span>
            <h3 className="edu-certs-title">Certificates & Training</h3>
            {content.certifications.map(c => (
              <div key={c.title} className="cert-item">
                <div className="cert-title">{c.title}</div>
                <div className="cert-issuer">{c.issuer}{c.location ? ` · ${c.location}` : ''}</div>
                <div className="cert-date">{c.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FOR FAMILIES ── */
function ForFamilies() {
  const { forFamilies } = content;
  return (
    <section className="for-families" id="families">
      <div className="container">
        <div className="for-families-header">
          <span className="section-label">For Families</span>
          <h2 className="section-title">{forFamilies.title}</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>{forFamilies.intro}</p>
        </div>
        <div className="families-grid">
          {forFamilies.items.map(item => (
            <div key={item.title} className="family-card">
              <div className="family-icon">{item.icon}</div>
              <div className="family-title">{item.title}</div>
              <div className="family-desc">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── REFERENCE ── */
function Reference() {
  const { reference } = content;
  return (
    <section className="reference-section">
      <div className="container">
        <blockquote className="reference-quote">{reference.quote}</blockquote>
        <div className="reference-author">
          <strong>{reference.name}</strong>
          {reference.role}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function Contact() {
  const { personal } = content;
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-inner">
          <div>
            <span className="section-label">Contact</span>
            <h2 className="section-title">Let's talk?</h2>
            <p className="section-desc">
              I'm available for appointments, partnerships and questions. Get in touch — it will be a pleasure!
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">
                    <a href={`mailto:${personal.email}`}>{personal.email}</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">{personal.phone}</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-label">Location</div>
                  <div className="contact-value">{personal.location}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '24px' }}>Send a message</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Your name</label>
              <input id="name" className="form-input" type="text" placeholder="What should I call you?" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" className="form-input" type="email" placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="message">Message</label>
              <textarea id="message" className="form-textarea" placeholder="Tell me a little about what you need..." />
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              ✉ Send Message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 <strong>Lorena Cynthya Lopes de Santana</strong> — Child and Youth Care Practitioner & Psychologist</p>
      <div className="footer-links">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#approach">Approach</a>
        <a href="#contact">Contact</a>
      </div>
    </footer>
  );
}

/* ── APP ── */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Pillars />
        <About />
        <Services />
        <Approach />
        <Experience />
        <EduCerts />
        <ForFamilies />
        <Reference />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
