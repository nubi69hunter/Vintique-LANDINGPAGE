import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Cursor handling
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 4 + 'px';
        cursorRef.current.style.top = e.clientY - 4 + 'px';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    const fadeUpElems = document.querySelectorAll('.fade-up');
    fadeUpElems.forEach(el => observer.observe(el));

    // Nav scroll effect
    const handleScroll = () => {
      if (navRef.current) {
        if (window.innerWidth <= 900) {
          navRef.current.classList.remove('scrolled');
          return;
        }

        if (window.scrollY > 60) {
          navRef.current.classList.add('scrolled');
        } else {
          navRef.current.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      fadeUpElems.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef}></div>

      {/* NAV */}
      <nav ref={navRef}>
        <a href="#" className="nav-logo">Vintique</a>
        
        <button 
          className={`nav-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><a href="#how" onClick={() => setIsMobileMenuOpen(false)}>How it works</a></li>
          <li><a href="#opportunity" onClick={() => setIsMobileMenuOpen(false)}>Market</a></li>
          <li><a href="#tech" onClick={() => setIsMobileMenuOpen(false)}>Technology</a></li>
          <li><a href="#roadmap" onClick={() => setIsMobileMenuOpen(false)}>Roadmap</a></li>
          <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">Saudi Arabia's First P2P Fashion Marketplace</div>
          <h1 className="hero-title">
            Pre-loved.<br/>
            <em>Reworn.</em><br/>
            Rewired.
          </h1>
          <p className="hero-desc">
            Vintique is a peer-to-peer fashion resale marketplace built for Saudi Arabia — where anyone can buy and sell pre-loved clothing, safely and instantly.
          </p>
          <div className="hero-ctas">
            <a href="https://vintique-mvp.vercel.app/" target="_blank" rel="noreferrer" className="btn-primary">View Live MVP</a>
            <a href="#opportunity" className="btn-ghost">See the opportunity</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-mockup">
            <div className="phone">
              <div className="phone-notch"><div className="phone-notch-inner"></div></div>
              <div className="phone-screen">
                <div className="phone-header">
                  <div className="phone-logo">Vintique</div>
                  <div style={{ fontSize: '0.6rem', color: '#7A7268', letterSpacing: '0.05em' }}>Riyadh</div>
                </div>
                <div className="phone-search">
                  <span>🔍</span>
                  <span>Search pre-loved pieces...</span>
                </div>
                <div className="phone-cats">
                  <div className="phone-cat active">All</div>
                  <div className="phone-cat">Abayas</div>
                  <div className="phone-cat">Casual</div>
                  <div className="phone-cat">Bags</div>
                </div>
                <div className="phone-grid">
                  <div className="phone-card">
                    <div className="phone-badge">NEW</div>
                    <div className="phone-card-img" style={{ background: '#d4c9b8' }}>👗</div>
                    <div className="phone-card-info">
                      <div className="phone-card-name">Vintage Abaya</div>
                      <div className="phone-card-size">Size M · Like New</div>
                      <div className="phone-card-price">120 SAR</div>
                    </div>
                  </div>
                  <div className="phone-card">
                    <div className="phone-card-img" style={{ background: '#c9bfb0' }}>👜</div>
                    <div className="phone-card-info">
                      <div className="phone-card-name">Leather Tote</div>
                      <div className="phone-card-size">One size · Good</div>
                      <div className="phone-card-price">85 SAR</div>
                    </div>
                  </div>
                  <div className="phone-card">
                    <div className="phone-card-img" style={{ background: '#d8d0c4' }}>👠</div>
                    <div className="phone-card-info">
                      <div className="phone-card-name">Block Heels</div>
                      <div className="phone-card-size">38 · Excellent</div>
                      <div className="phone-card-price">200 SAR</div>
                    </div>
                  </div>
                  <div className="phone-card">
                    <div className="phone-badge">HOT</div>
                    <div className="phone-card-img" style={{ background: '#cac2b6' }}>🧣</div>
                    <div className="phone-card-info">
                      <div className="phone-card-name">Silk Scarf</div>
                      <div className="phone-card-size">One size · New</div>
                      <div className="phone-card-price">65 SAR</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <div className="marquee-item">VINTAGE <span>✦</span> UNIQUE <span>✦</span> ANTIQUE <span>✦</span> PRE-LOVED <span>✦</span> SUSTAINABLE FASHION <span>✦</span> SAUDI ARABIA <span>✦</span> RESELL <span>✦</span> REWEAR <span>✦</span></div>
          <div className="marquee-item">VINTAGE <span>✦</span> UNIQUE <span>✦</span> ANTIQUE <span>✦</span> PRE-LOVED <span>✦</span> SUSTAINABLE FASHION <span>✦</span> SAUDI ARABIA <span>✦</span> RESELL <span>✦</span> REWEAR <span>✦</span></div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat fade-up">
          <div className="stat-num">0<span className="stat-accent">*</span></div>
          <div className="stat-label">Direct competitors in KSA</div>
        </div>
        <div className="stat fade-up" style={{ transitionDelay: '0.1s' }}>
          <div className="stat-num">35<span className="stat-accent">M+</span></div>
          <div className="stat-label">KSA population, 70% under 35</div>
        </div>
        <div className="stat fade-up" style={{ transitionDelay: '0.2s' }}>
          <div className="stat-num">2-5<span className="stat-accent">%</span></div>
          <div className="stat-label">Commission per transaction</div>
        </div>
        <div className="stat fade-up" style={{ transitionDelay: '0.3s' }}>
          <div className="stat-num">~<span className="stat-accent">0</span></div>
          <div className="stat-label">SAR build cost — self-built</div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="section-eyebrow">The flow</div>
        <h2 className="section-title">How <em>Vintique</em> works</h2>
        <div className="steps">
          <div className="step fade-up">
            <div className="step-num">01</div>
            <div className="step-icon">📸</div>
            <div className="step-title">List in 2 minutes</div>
            <div className="step-desc">Snap photos, set your price, pick size and condition. Your item is live instantly.</div>
          </div>
          <div className="step fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="step-num">02</div>
            <div className="step-icon">💳</div>
            <div className="step-title">Buyer pays securely</div>
            <div className="step-desc">Payment via MADA, Apple Pay or Visa — held in escrow by Vintique until delivery confirmed.</div>
          </div>
          <div className="step fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="step-num">03</div>
            <div className="step-icon">📦</div>
            <div className="step-title">Seller ships via Aramex</div>
            <div className="step-desc">Generate a shipping label in-app. Book a home pickup. No trips to the post office.</div>
          </div>
          <div className="step fade-up" style={{ transitionDelay: '0.3s' }}>
            <div className="step-num">04</div>
            <div className="step-icon">💰</div>
            <div className="step-title">Get paid</div>
            <div className="step-desc">Buyer confirms delivery. Funds released to your Vintique wallet, transferred to your bank in 1-3 days.</div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITY */}
      <section className="opportunity" id="opportunity">
        <div>
          <div className="opp-eyebrow">The gap</div>
          <h2 className="opp-title">A market <em>begging</em> for a solution</h2>
          <p className="opp-desc">
            Thrifting culture is exploding in Saudi Arabia. Gen Z is buying and selling pre-loved fashion on WhatsApp groups and Instagram DMs. It's chaotic, unsafe, and slow. No dedicated platform exists.
          </p>
          <div className="opp-points">
            <div className="opp-point">
              <div className="opp-point-dot"></div>
              <div className="opp-point-text"><strong>Bazaara</strong> — the only regional P2P fashion app — was acquired in 2024 and exited the market entirely.</div>
            </div>
            <div className="opp-point">
              <div className="opp-point-dot"></div>
              <div className="opp-point-text"><strong>Haraj</strong> is too general, cluttered, and built for electronics not fashion.</div>
            </div>
            <div className="opp-point">
              <div className="opp-point-dot"></div>
              <div className="opp-point-text"><strong>AMUSED</strong> targets luxury only — excludes the everyday seller with a closet full of unworn clothes.</div>
            </div>
            <div className="opp-point">
              <div className="opp-point-dot"></div>
              <div className="opp-point-text">The window is <strong>open right now</strong>. First mover wins.</div>
            </div>
          </div>
        </div>
        <div className="opp-right">
          <div className="competitor-card">
            <div className="comp-name">Bazaara</div>
            <div className="comp-status status-gone">Exited 2024</div>
            <div className="comp-desc">UAE-based P2P fashion app that planned KSA expansion — acquired and shut down before it could.</div>
          </div>
          <div className="competitor-card">
            <div className="comp-name">Haraj</div>
            <div className="comp-status status-weak">Not fashion</div>
            <div className="comp-desc">General classifieds with 50M+ monthly visitors — but zero fashion focus, trust issues, and poor UX.</div>
          </div>
          <div className="competitor-card">
            <div className="comp-name">AMUSED</div>
            <div className="comp-status status-weak">Luxury only</div>
            <div className="comp-desc">Authenticated luxury pieces — great for Chanel bags, useless for everyday pre-loved clothing.</div>
          </div>
          <div className="vintique-card">
            <div className="comp-name" style={{ color: '#F5F0E8' }}>Vintique</div>
            <div className="comp-desc" style={{ color: 'rgba(245,240,232,0.6)' }}>The only dedicated P2P fashion resale marketplace for everyday KSA sellers. First mover. Zero direct competition.</div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust section" id="trust">
        <div className="section-eyebrow">Safety first</div>
        <h2 className="section-title">Built on <em>trust</em></h2>
        <div className="trust-grid">
          <div className="trust-item fade-up">
            <div className="trust-icon">🔒</div>
            <div className="trust-title">Escrow payments</div>
            <div className="trust-desc">Money is held by Vintique until the buyer confirms receipt. Sellers can't ghost. Buyers can't chargeback unfairly.</div>
          </div>
          <div className="trust-item fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="trust-icon">⭐</div>
            <div className="trust-title">Seller ratings</div>
            <div className="trust-desc">Every completed transaction builds a seller's reputation. Bad actors get flagged fast. Good sellers get rewarded.</div>
          </div>
          <div className="trust-item fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="trust-icon">🛡️</div>
            <div className="trust-title">Buyer protection</div>
            <div className="trust-desc">48-hour dispute window after delivery. Item not as described? You're covered. No questions asked.</div>
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="tech" id="tech">
        <div className="section-eyebrow" style={{ color: 'var(--rust)' }}>Under the hood</div>
        <h2 className="section-title" style={{ color: 'var(--cream)' }}>Lean, <em>scalable</em> tech</h2>
        <div className="tech-grid">
          <div className="tech-card fade-up">
            <div className="tech-label">Mobile App</div>
            <div className="tech-name">React Native</div>
            <div className="tech-desc">iOS and Android from a single codebase. Built in-house. No agency, no bloat.</div>
          </div>
          <div className="tech-card fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="tech-label">Backend</div>
            <div className="tech-name">Supabase</div>
            <div className="tech-desc">Auth, database, storage, and realtime messaging. Scales from day 1 to day 10,000.</div>
          </div>
          <div className="tech-card fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="tech-label">Payments</div>
            <div className="tech-name">Moyasar</div>
            <div className="tech-desc">MADA, Apple Pay, Visa. SAMA-licensed. Escrow-ready for marketplace split payments.</div>
          </div>
          <div className="tech-card fade-up" style={{ transitionDelay: '0.3s' }}>
            <div className="tech-label">Shipping</div>
            <div className="tech-name">Aramex API</div>
            <div className="tech-desc">Label generation and home pickup booking — all inside the app. No external redirects.</div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="roadmap section" id="roadmap">
        <div className="section-eyebrow">The plan</div>
        <h2 className="section-title">Road to <em>launch</em></h2>
        <div className="timeline">
          <div className="tl-item fade-up">
            <div>
              <div className="tl-phase">Phase 1</div>
              <div className="tl-time">Week 1–2</div>
            </div>
            <div>
              <div className="tl-title">Foundation & outreach</div>
              <div className="tl-tasks">
                <span className="tl-task">Register vintique.sa</span>
                <span className="tl-task">Aramex API deal</span>
                <span className="tl-task">Moyasar escrow confirmation</span>
                <span className="tl-task">Wireframes</span>
              </div>
            </div>
          </div>
          <div className="tl-item fade-up">
            <div>
              <div className="tl-phase">Phase 2</div>
              <div className="tl-time">Month 1</div>
            </div>
            <div>
              <div className="tl-title">Design & branding</div>
              <div className="tl-tasks">
                <span className="tl-task">Figma wireframes</span>
                <span className="tl-task">Brand identity</span>
                <span className="tl-task">Supabase setup</span>
                <span className="tl-task">DB schema</span>
              </div>
            </div>
          </div>
          <div className="tl-item fade-up">
            <div>
              <div className="tl-phase">Phase 3</div>
              <div className="tl-time">Month 2–4</div>
            </div>
            <div>
              <div className="tl-title">Build MVP</div>
              <div className="tl-tasks">
                <span className="tl-task">Auth & profiles</span>
                <span className="tl-task">Listings & search</span>
                <span className="tl-task">Escrow payments</span>
                <span className="tl-task">Shipping integration</span>
                <span className="tl-task">In-app messaging</span>
              </div>
            </div>
          </div>
          <div className="tl-item fade-up">
            <div>
              <div className="tl-phase">Phase 4</div>
              <div className="tl-time">Month 4–5</div>
            </div>
            <div>
              <div className="tl-title">Beta & legal</div>
              <div className="tl-tasks">
                <span className="tl-task">50–100 Riyadh beta users</span>
                <span className="tl-task">Commercial Registration</span>
                <span className="tl-task">App Store submission</span>
              </div>
            </div>
          </div>
          <div className="tl-item fade-up">
            <div>
              <div className="tl-phase">Phase 5</div>
              <div className="tl-time">Month 5–6</div>
            </div>
            <div>
              <div className="tl-title">Public launch</div>
              <div className="tl-tasks">
                <span className="tl-task">TikTok & Instagram push</span>
                <span className="tl-task">Seed listings</span>
                <span className="tl-task">Vintique goes live 🚀</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="founder">
        <div>
          <p className="founder-quote">
            "Saudi Arabia has a generation of young people with closets full of clothes they don't wear. They want to sell. They want to buy. There's just nowhere to do it safely. That's Vintique."
          </p>
          <div className="founder-name">Musab Alshehri</div>
          <div className="founder-title">Architecture Student · KSU · Solo Builder</div>
          <div style={{ marginTop: '1.2rem' }}>
            <a href="https://www.linkedin.com/in/thegrinder/" target="_blank" rel="noreferrer" className="linkedin-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
        <div className="founder-right">
          <div className="founder-stat">
            <div className="founder-stat-num">~0 SAR</div>
            <div className="founder-stat-label">Build cost — self-developed on Supabase</div>
          </div>
          <div className="founder-stat">
            <div className="founder-stat-num">5–6 mo.</div>
            <div className="founder-stat-label">Time to MVP launch</div>
          </div>
          <div className="founder-stat">
            <div className="founder-stat-num">2-5%</div>
            <div className="founder-stat-label">Commission per sale — only revenue when users succeed</div>
          </div>
          <div className="founder-stat">
            <div className="founder-stat-num">0</div>
            <div className="founder-stat-label">Direct competitors in the KSA P2P fashion space today</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <div className="cta-bg-text">VINTIQUE</div>
        <div className="cta-eyebrow">Join the movement</div>
        <h2 className="cta-title">The window<br/>is <em>open.</em></h2>
        <p className="cta-desc">
          Vintique is looking for support — academic, financial, or mentorship — to bring Saudi Arabia's first P2P fashion resale marketplace to life.
        </p>
        <div className="cta-btns">
          <a href="https://vintique-mvp.vercel.app/" target="_blank" rel="noreferrer" className="btn-primary">View Live MVP</a>
          <a href="mailto:srtmusab@gmail.com" className="btn-ghost">Email us</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Vintique</div>
        <div className="footer-tagline">Vintage · Antique · Unique</div>
        <div className="footer-copy">© 2026 Vintique. Saudi Arabia.</div>
      </footer>
    </>
  );
}
