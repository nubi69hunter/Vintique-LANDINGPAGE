import React, { useEffect, useRef, useState, useCallback } from 'react';
import { supabase, type Listing } from './supabase';
import type { User } from '@supabase/supabase-js';

type View = 'home' | 'sell' | 'profile';
type AuthModal = null | 'login' | 'signup';

const CATEGORIES = ['Abayas', 'Casual', 'Bags', 'Shoes', 'Accessories', 'Outerwear', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
const CATEGORY_EMOJI: Record<string, string> = {
  Abayas: '👗', Casual: '👕', Bags: '👜', Shoes: '👠', Accessories: '🧣', Outerwear: '🧥', Other: '✨',
};

export default function App() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Auth
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // View
  const [view, setView] = useState<View>('home');

  // Listings
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // Sell form
  const [sellTitle, setSellTitle] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellCategory, setSellCategory] = useState('');
  const [sellSize, setSellSize] = useState('');
  const [sellCondition, setSellCondition] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellLoading, setSellLoading] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);
  const [sellError, setSellError] = useState('');

  // Buy
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setListingsLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setListings(data as Listing[]);
    setListingsLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    fetchListings();
    return () => subscription.unsubscribe();
  }, [fetchListings]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 4 + 'px';
        cursorRef.current.style.top = e.clientY - 4 + 'px';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 60) {
          navRef.current.style.background = 'rgba(245,240,232,0.92)';
          navRef.current.style.backdropFilter = 'blur(12px)';
          navRef.current.style.borderBottom = '1px solid rgba(0,0,0,0.08)';
          navRef.current.style.mixBlendMode = 'normal';
        } else {
          navRef.current.style.background = 'transparent';
          navRef.current.style.backdropFilter = 'none';
          navRef.current.style.borderBottom = 'none';
          navRef.current.style.mixBlendMode = view === 'home' ? 'multiply' : 'normal';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [view]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    if (authModal === 'signup') {
      const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      if (error) { setAuthError(error.message); }
      else {
        setAuthModal(null);
        setAuthEmail('');
        setAuthPassword('');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) { setAuthError(error.message); }
      else {
        setAuthModal(null);
        setAuthEmail('');
        setAuthPassword('');
      }
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('home');
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setAuthModal('login'); return; }
    setSellError('');
    setSellLoading(true);
    const { error } = await supabase.from('listings').insert({
      seller_id: user.id,
      title: sellTitle.trim(),
      description: sellDesc.trim() || null,
      category: sellCategory || null,
      size: sellSize.trim() || null,
      condition: sellCondition || null,
      price: parseFloat(sellPrice),
    });
    if (error) {
      setSellError(error.message);
    } else {
      setSellSuccess(true);
      setSellTitle(''); setSellDesc(''); setSellCategory('');
      setSellSize(''); setSellCondition(''); setSellPrice('');
      fetchListings();
      setTimeout(() => setSellSuccess(false), 4000);
    }
    setSellLoading(false);
  };

  const handleBuyNow = async (listing: Listing) => {
    if (!user) { setAuthModal('login'); return; }
    if (user.id === listing.seller_id) return;
    setBuyingId(listing.id);
    const { error } = await supabase.from('orders').insert({
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      status: 'pending',
    });
    setBuyingId(null);
    if (!error) {
      setOrderSuccess(listing.id);
      setTimeout(() => setOrderSuccess(null), 5000);
    }
  };

  const openView = (v: View) => {
    if ((v === 'sell' || v === 'profile') && !user) {
      setAuthModal('login');
      return;
    }
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const userListings = listings.filter(l => l.seller_id === user?.id);

  return (
    <>
      <div className="cursor" ref={cursorRef}></div>

      {/* AUTH MODAL */}
      {authModal && (
        <div className="modal-overlay" onClick={() => setAuthModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAuthModal(null)}>✕</button>
            <div className="modal-logo">Vintique</div>
            <div className="modal-tabs">
              <button
                className={`modal-tab${authModal === 'login' ? ' active' : ''}`}
                onClick={() => { setAuthModal('login'); setAuthError(''); }}
              >Login</button>
              <button
                className={`modal-tab${authModal === 'signup' ? ' active' : ''}`}
                onClick={() => { setAuthModal('signup'); setAuthError(''); }}
              >Sign Up</button>
            </div>
            <form onSubmit={handleAuth} className="modal-form">
              <input
                className="modal-input"
                type="email"
                placeholder="Email address"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
              />
              <input
                className="modal-input"
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                required
                minLength={6}
              />
              {authError && <div className="modal-error">{authError}</div>}
              <button className="btn-primary" type="submit" disabled={authLoading} style={{ width: '100%', marginTop: '0.5rem' }}>
                {authLoading ? '...' : authModal === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav ref={navRef} style={{ mixBlendMode: view === 'home' ? 'multiply' : 'normal', background: view !== 'home' ? 'rgba(245,240,232,0.95)' : 'transparent', backdropFilter: view !== 'home' ? 'blur(12px)' : 'none', borderBottom: view !== 'home' ? '1px solid rgba(0,0,0,0.08)' : 'none' }}>
        <button className="nav-logo" onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Vintique</button>
        <ul className="nav-links">
          <li><button className={`nav-btn${view === 'home' ? ' nav-active' : ''}`} onClick={() => setView('home')}>Browse</button></li>
          <li><button className={`nav-btn${view === 'sell' ? ' nav-active' : ''}`} onClick={() => openView('sell')}>Sell</button></li>
          <li><button className={`nav-btn${view === 'profile' ? ' nav-active' : ''}`} onClick={() => openView('profile')}>Profile</button></li>
        </ul>
        <div className="nav-auth">
          {user ? (
            <>
              <span className="nav-user">{user.email}</span>
              <button className="btn-ghost" style={{ padding: '0.5rem 1.2rem', fontSize: '0.72rem' }} onClick={handleSignOut}>Logout</button>
            </>
          ) : (
            <button className="btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.72rem' }} onClick={() => setAuthModal('login')}>Login / Sign Up</button>
          )}
        </div>
      </nav>

      {/* ─── HOME / BROWSE VIEW ─── */}
      {view === 'home' && (
        <>
          {/* HERO */}
          <section className="hero">
            <div className="hero-left">
              <div className="hero-tag">Saudi Arabia's First P2P Fashion Marketplace</div>
              <h1 className="hero-title">Pre-loved.<br/><em>Reworn.</em><br/>Rewired.</h1>
              <p className="hero-desc">
                Vintique is a peer-to-peer fashion resale marketplace built for Saudi Arabia — where anyone can buy and sell pre-loved clothing, safely and instantly.
              </p>
              <div className="hero-ctas">
                <button className="btn-primary" onClick={() => { document.getElementById('listings-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Browse listings</button>
                <button className="btn-ghost" onClick={() => openView('sell')}>Sell now</button>
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
                    <div className="phone-search"><span>🔍</span><span>Search pre-loved pieces...</span></div>
                    <div className="phone-cats">
                      <div className="phone-cat active">All</div>
                      <div className="phone-cat">Abayas</div>
                      <div className="phone-cat">Casual</div>
                      <div className="phone-cat">Bags</div>
                    </div>
                    <div className="phone-grid">
                      {listings.slice(0, 4).map((l, i) => (
                        <div className="phone-card" key={l.id}>
                          {i === 0 && <div className="phone-badge">NEW</div>}
                          <div className="phone-card-img" style={{ background: ['#d4c9b8','#c9bfb0','#d8d0c4','#cac2b6'][i] }}>
                            {CATEGORY_EMOJI[l.category || ''] || '✨'}
                          </div>
                          <div className="phone-card-info">
                            <div className="phone-card-name">{l.title}</div>
                            <div className="phone-card-size">{[l.size, l.condition].filter(Boolean).join(' · ')}</div>
                            <div className="phone-card-price">{l.price} SAR</div>
                          </div>
                        </div>
                      ))}
                      {listings.length === 0 && (
                        <>
                          {[{ n: 'Vintage Abaya', s: 'M · Like New', p: 120, bg: '#d4c9b8', e: '👗' },
                            { n: 'Leather Tote', s: 'One size · Good', p: 85, bg: '#c9bfb0', e: '👜' },
                            { n: 'Block Heels', s: '38 · Excellent', p: 200, bg: '#d8d0c4', e: '👠' },
                            { n: 'Silk Scarf', s: 'One size · New', p: 65, bg: '#cac2b6', e: '🧣' }].map((c, i) => (
                            <div className="phone-card" key={i}>
                              {i === 0 && <div className="phone-badge">NEW</div>}
                              {i === 3 && <div className="phone-badge">HOT</div>}
                              <div className="phone-card-img" style={{ background: c.bg }}>{c.e}</div>
                              <div className="phone-card-info">
                                <div className="phone-card-name">{c.n}</div>
                                <div className="phone-card-size">{c.s}</div>
                                <div className="phone-card-price">{c.p} SAR</div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
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

          {/* LIVE LISTINGS */}
          <section className="section listings-section" id="listings-section">
            <div className="section-eyebrow">Live marketplace</div>
            <h2 className="section-title">Browse <em>listings</em></h2>

            {listingsLoading ? (
              <div className="listings-loading">Loading listings...</div>
            ) : listings.length === 0 ? (
              <div className="listings-empty">
                <div className="listings-empty-icon">👗</div>
                <div className="listings-empty-title">No listings yet</div>
                <div className="listings-empty-desc">Be the first to list something on Vintique.</div>
                <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => openView('sell')}>List an item</button>
              </div>
            ) : (
              <div className="listings-grid">
                {listings.map(listing => (
                  <div className="listing-card fade-up" key={listing.id}>
                    <div className="listing-card-img">
                      {listing.image_url
                        ? <img src={listing.image_url} alt={listing.title} />
                        : <span>{CATEGORY_EMOJI[listing.category || ''] || '✨'}</span>
                      }
                    </div>
                    <div className="listing-card-body">
                      <div className="listing-card-meta">
                        {listing.category && <span className="listing-tag">{listing.category}</span>}
                        {listing.condition && <span className="listing-tag">{listing.condition}</span>}
                      </div>
                      <div className="listing-card-title">{listing.title}</div>
                      {listing.description && <div className="listing-card-desc">{listing.description}</div>}
                      <div className="listing-card-footer">
                        <div className="listing-card-price">{listing.price} SAR</div>
                        {listing.size && <div className="listing-card-size">Size {listing.size}</div>}
                      </div>
                      {orderSuccess === listing.id ? (
                        <div className="order-success">Order placed! The seller will contact you to arrange a meetup.</div>
                      ) : user?.id === listing.seller_id ? (
                        <div className="listing-own-badge">Your listing</div>
                      ) : (
                        <button
                          className="btn-primary listing-buy-btn"
                          onClick={() => handleBuyNow(listing)}
                          disabled={buyingId === listing.id}
                        >
                          {buyingId === listing.id ? 'Placing order...' : 'Buy Now'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* STATS */}
          <div className="stats">
            <div className="stat fade-up"><div className="stat-num">0<span className="stat-accent">*</span></div><div className="stat-label">Direct competitors in KSA</div></div>
            <div className="stat fade-up" style={{ transitionDelay: '0.1s' }}><div className="stat-num">35<span className="stat-accent">M+</span></div><div className="stat-label">KSA population, 70% under 35</div></div>
            <div className="stat fade-up" style={{ transitionDelay: '0.2s' }}><div className="stat-num">10<span className="stat-accent">%</span></div><div className="stat-label">Commission per transaction</div></div>
            <div className="stat fade-up" style={{ transitionDelay: '0.3s' }}><div className="stat-num">{listings.length}<span className="stat-accent">+</span></div><div className="stat-label">Items listed so far</div></div>
          </div>

          {/* HOW IT WORKS */}
          <section className="section" id="how">
            <div className="section-eyebrow">The flow</div>
            <h2 className="section-title">How <em>Vintique</em> works</h2>
            <div className="steps">
              <div className="step fade-up"><div className="step-num">01</div><div className="step-icon">📸</div><div className="step-title">List in 2 minutes</div><div className="step-desc">Snap photos, set your price, pick size and condition. Your item is live instantly.</div></div>
              <div className="step fade-up" style={{ transitionDelay: '0.1s' }}><div className="step-num">02</div><div className="step-icon">💳</div><div className="step-title">Buyer pays securely</div><div className="step-desc">Payment via MADA, Apple Pay or Visa — held in escrow by Vintique until delivery confirmed.</div></div>
              <div className="step fade-up" style={{ transitionDelay: '0.2s' }}><div className="step-num">03</div><div className="step-icon">📦</div><div className="step-title">Seller ships via Aramex</div><div className="step-desc">Generate a shipping label in-app. Book a home pickup. No trips to the post office.</div></div>
              <div className="step fade-up" style={{ transitionDelay: '0.3s' }}><div className="step-num">04</div><div className="step-icon">💰</div><div className="step-title">Get paid</div><div className="step-desc">Buyer confirms delivery. Funds released to your Vintique wallet, transferred to your bank in 1-3 days.</div></div>
            </div>
          </section>

          {/* CTA */}
          <section className="cta-section" id="contact">
            <div className="cta-bg-text">VINTIQUE</div>
            <div className="cta-eyebrow">Join the movement</div>
            <h2 className="cta-title">The window<br/>is <em>open.</em></h2>
            <p className="cta-desc">Start buying and selling pre-loved fashion in Saudi Arabia today.</p>
            <div className="cta-btns">
              <button className="btn-primary" onClick={() => openView('sell')}>Sell an item</button>
              <button className="btn-ghost" onClick={() => { document.getElementById('listings-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Browse listings</button>
            </div>
          </section>

          {/* FOOTER */}
          <footer>
            <div className="footer-logo">Vintique</div>
            <div className="footer-tagline">Vintage · Antique · Unique</div>
            <div className="footer-copy">© 2026 Vintique. Saudi Arabia.</div>
          </footer>
        </>
      )}

      {/* ─── SELL VIEW ─── */}
      {view === 'sell' && (
        <div className="page-view">
          <div className="page-header">
            <div className="section-eyebrow">Marketplace</div>
            <h1 className="page-title">List an <em>item</em></h1>
            <p className="page-desc">Fill in the details below and your item goes live instantly.</p>
          </div>
          <div className="form-container">
            {sellSuccess && (
              <div className="form-success">
                Your listing is live! <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textDecoration: 'underline' }}>Browse all listings</button>
              </div>
            )}
            <form onSubmit={handleSell} className="sell-form">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" type="text" placeholder="e.g. Vintage Abaya — Zara, Like New" value={sellTitle} onChange={e => setSellTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" placeholder="Describe the item — brand, fabric, any flaws..." value={sellDesc} onChange={e => setSellDesc(e.target.value)} rows={4} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input form-select" value={sellCategory} onChange={e => setSellCategory(e.target.value)}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select className="form-input form-select" value={sellCondition} onChange={e => setSellCondition(e.target.value)}>
                    <option value="">Select condition</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Size</label>
                  <input className="form-input" type="text" placeholder="e.g. M, 38, One Size" value={sellSize} onChange={e => setSellSize(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (SAR) *</label>
                  <input className="form-input" type="number" placeholder="e.g. 120" min="1" step="1" value={sellPrice} onChange={e => setSellPrice(e.target.value)} required />
                </div>
              </div>
              {sellError && <div className="form-error">{sellError}</div>}
              <button className="btn-primary" type="submit" disabled={sellLoading} style={{ width: '100%', padding: '1.1rem' }}>
                {sellLoading ? 'Publishing...' : 'Publish Listing'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── PROFILE VIEW ─── */}
      {view === 'profile' && (
        <div className="page-view">
          <div className="page-header">
            <div className="section-eyebrow">Account</div>
            <h1 className="page-title">My <em>listings</em></h1>
            <p className="page-desc">{user?.email}</p>
          </div>

          <div className="profile-actions">
            <button className="btn-primary" onClick={() => setView('sell')}>+ New Listing</button>
          </div>

          {listingsLoading ? (
            <div className="listings-loading" style={{ padding: '3rem' }}>Loading...</div>
          ) : userListings.length === 0 ? (
            <div className="listings-empty" style={{ padding: '4rem 2rem' }}>
              <div className="listings-empty-icon">👗</div>
              <div className="listings-empty-title">No listings yet</div>
              <div className="listings-empty-desc">You haven't listed anything yet. Start selling!</div>
              <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setView('sell')}>List an item</button>
            </div>
          ) : (
            <div className="listings-grid" style={{ padding: '0 3rem 5rem' }}>
              {userListings.map(listing => (
                <div className="listing-card" key={listing.id}>
                  <div className="listing-card-img">
                    {listing.image_url
                      ? <img src={listing.image_url} alt={listing.title} />
                      : <span>{CATEGORY_EMOJI[listing.category || ''] || '✨'}</span>
                    }
                  </div>
                  <div className="listing-card-body">
                    <div className="listing-card-meta">
                      {listing.category && <span className="listing-tag">{listing.category}</span>}
                      {listing.condition && <span className="listing-tag">{listing.condition}</span>}
                    </div>
                    <div className="listing-card-title">{listing.title}</div>
                    {listing.description && <div className="listing-card-desc">{listing.description}</div>}
                    <div className="listing-card-footer">
                      <div className="listing-card-price">{listing.price} SAR</div>
                      {listing.size && <div className="listing-card-size">Size {listing.size}</div>}
                    </div>
                    <div className="listing-own-badge">Your listing</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
