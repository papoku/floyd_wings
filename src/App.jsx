import { useState } from 'react'
import menuImages from './data/menuImages.json'

const menuCategories = ['All', ...new Set(menuImages.map((item) => item.category))]
const orderUrl = 'https://www.beyondmenu.com/27755/mableton/floyd-wings-and-grill-mableton-30126.aspx'
const reservationUrl = '#visit'
const cateringUrl = '#catering'

function Arrow({ diagonal = false }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const closeMenu = () => setMenuOpen(false)
  const visibleMenuImages = activeCategory === 'All'
    ? menuImages
    : menuImages.filter((item) => item.category === activeCategory)

  return (
    <div className="site-shell">
      <div className="announcement"><span className="announcement-star">✳</span> 15% OFF ALL DAY EVERY DAY · 11 AM–6 PM <span className="announcement-divider">·</span> $20 MINIMUM PURCHASE <span className="announcement-star">✳</span></div>
      <header className="site-header">
        <a className="site-logo" href="#home" aria-label="Floyd Wings and Grill home" onClick={closeMenu}>
          <img className="official-logo" src="/floyd-logo.png" alt="Floyd Wings and Grill" />
        </a>
        <button className="mobile-menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}</button>
        <nav className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
          <a href="#menu" onClick={closeMenu}>THE MENU</a>
          <a href="#story" onClick={closeMenu}>ABOUT</a>
          <a href={cateringUrl} onClick={closeMenu}>CATERING</a>
          <a href="#visit" onClick={closeMenu}>LOCATION</a>
          <a className="nav-order" href={orderUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>ORDER ONLINE <Arrow diagonal /></a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-photo" role="img" aria-label="Chicken tenders and fries from Floyd Wings and Grill" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="kicker"><span /> SERVING MABLETON FOR 14 YEARS</p>
            <h1>Wing<br /><em>excellence.</em><br />Comfort food.</h1>
            <p className="hero-copy">Crispy wings, tasty tenders, and comfort-food favorites made fresh. Come dine in or take your favorites to go.</p>
            <div className="hero-actions"><a className="button button-orange" href={orderUrl} target="_blank" rel="noreferrer">ORDER ONLINE <Arrow diagonal /></a><a className="button button-ghost" href="#menu">VIEW OUR MENU <Arrow /></a></div>
            <div className="hero-note"><span className="note-avatars"><i>F</i><i>W</i><i>G</i></span><span><strong>Fresh, hot, and made to order.</strong><small>Your neighborhood wing spot.</small></span><span className="note-spark">✳</span></div>
          </div>
          <div className="hero-stamp"><span>FLOYD</span><b>✳</b><span>WINGS<br />&amp; GRILL<br />MABLETON</span></div>
          <a href="#menu" className="scroll-hint">SCROLL TO GET HUNGRY <span>↓</span></a>
        </section>

        <section className="quick-info" aria-label="Restaurant information">
          <div className="quick-item"><span className="quick-icon">◷</span><span><small>MON–SAT · SUNDAY</small><strong>11 AM–9:30 PM · 12–9 PM</strong></span></div>
          <div className="quick-item"><span className="quick-icon">⌖</span><span><small>COME ON OVER</small><strong>5345 Floyd Rd SW #118, Mableton</strong></span></div>
          <div className="quick-item"><span className="quick-icon">♨</span><span><small>HOW DO YOU LIKE IT?</small><strong>Dine in · Pickup · Delivery</strong></span></div>
          <a className="quick-link" href={reservationUrl}>BOOK A TABLE <Arrow diagonal /></a>
        </section>

        <section className="intro section-pad" id="story">
          <div className="intro-label"><span className="tiny-star">✳</span> A LITTLE ABOUT US</div>
          <div className="intro-main"><h2>Wing excellence.<br /><em>Comfort cuisine.</em></h2><div className="intro-copy"><p>Welcome to Floyd Wings and Grill, serving Mableton for 14 years. Stop in for favorites like our Wing Combo and Fries, fried fresh with quality ingredients. Enjoy dine-in or takeout.</p><a href="#visit" className="underlined-link">VISIT US IN MABLETON <Arrow /></a></div></div>
          <div className="intro-bottom"><span>FLOYD WINGS AND GRILL · MABLETON, GA</span><div className="doodle-line"><i /><i /><i /><i /><i /><i /><i /></div><span>FRESH FOOD, FRIENDLY SERVICE.</span></div>
        </section>

        <section className="menu-section" id="menu">
          <div className="menu-heading section-pad"><div><p className="eyebrow-light"><span /> MADE FRESH TO ORDER</p><h2>Our menu.<br /><em>All the favorites.</em></h2></div><div className="menu-heading-side"><p>Explore Floyd Wings and Grill favorites, from loaded fries and fresh salads to wings in 30 flavors. Original or boneless wings start at $7.49 for 6 pieces.</p><a href={orderUrl} target="_blank" rel="noreferrer" className="button button-light">ORDER ONLINE <Arrow diagonal /></a></div></div>
          <div className="menu-filters section-pad" aria-label="Filter menu by category">{menuCategories.map((category) => <button key={category} className={activeCategory === category ? 'menu-filter active' : 'menu-filter'} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category}</button>)}</div>
          <div className="menu-cards section-pad">
            {visibleMenuImages.map((item, index) => <article className="menu-card" key={item.image}>
              <div className="menu-card-photo"><img src={item.image} alt={item.name} loading="lazy" /><span className="menu-number">{String(index + 1).padStart(2, '0')}</span></div>
              <div className="menu-card-info"><div><h3>{item.name}</h3><p>{item.category}</p><span className="menu-price">{item.price}</span></div></div>
            </article>)}
          </div>
          <div className="menu-bottom section-pad"><span>SHOWING {visibleMenuImages.length} MENU PHOTOS</span><span>MENU AND PRICES MAY CHANGE</span><a href={orderUrl} target="_blank" rel="noreferrer">ORDER ONLINE <Arrow diagonal /></a></div>
        </section>

        <section className="offer-section" id="order">
          <div className="offer-copy"><p className="eyebrow"><span /> ORDER ONLINE</p><h2>Get your<br />favorites <em>fast.</em></h2><p>Order your favorites from Floyd Wings and Grill for quick pickup or delivery.</p><a className="button button-orange" href={orderUrl} target="_blank" rel="noreferrer">ORDER NOW <Arrow diagonal /></a><small>Online ordering by BeyondMenu</small></div>
          <div className="offer-image"><img src="/floyd-feature-1.jpg" alt="Fresh chicken tenders and fries from Floyd Wings and Grill" /><div className="image-caption"><span>FLOYD WINGS AND GRILL</span><strong>Hot, fresh, and ready to share.</strong></div><div className="offer-badge">FRESH<br />FROM THE<br />KITCHEN <b>✳</b></div></div>
        </section>

        <section className="gather-section section-pad" id="catering">
          <div className="gather-top"><p className="eyebrow"><span /> THERE'S ROOM FOR EVERYONE</p><span className="gather-number">01 — 03</span></div>
          <div className="gather-grid"><div><h2>Big table.<br /><em>Big energy.</em></h2><p>Birthday, holiday, corporate, or wedding gathering? Floyd Wings and Grill catering brings crowd-pleasing wings and sides to your next event.</p><a className="underlined-link" href={cateringUrl}>CATERING PACKAGES <Arrow diagonal /></a></div><div className="gather-photo"><img src="/floyd-feature-2.jpg" alt="Floyd Wings and Grill restaurant mascot" /><span className="photo-note">GATHER AROUND THE TABLE <b>↗</b></span></div><div className="gather-side"><span className="handwritten">bring<br />the whole<br />crew!</span><span className="side-stamp">GOOD FOOD<br />GOOD PEOPLE<br /><b>✳</b></span></div></div>
        </section>

        <section className="reviews-section">
          <div className="reviews-head section-pad"><p className="eyebrow-light"><span /> WHY LOCALS COME BACK</p><h2>Mableton’s wing spot<br /><em>for 14 years.</em></h2><div className="rating"><span>✳</span><strong>Fresh</strong><small>FRIED TO ORDER</small></div></div>
          <div className="review-cards section-pad"><article className="review-card"><span className="quote-mark">✳</span><p>Wings made fresh, with 30 sauce varieties to choose from.</p><div><strong>WING COMBOS</strong><small>HOUSE FAVORITE</small></div></article><article className="review-card"><span className="quote-mark">✳</span><p>Quick service and a cozy place to enjoy lunch or dinner.</p><div><strong>DINE IN OR TAKEOUT</strong><small>YOUR CHOICE</small></div></article><article className="review-card"><span className="quote-mark">✳</span><p>Family wing specials come with sides and a two-liter soda.</p><div><strong>FAMILY SPECIALS</strong><small>MADE TO SHARE</small></div></article></div>
        </section>

        <section className="visit-section section-pad" id="visit">
          <div className="visit-heading"><div><p className="eyebrow"><span /> YOUR TABLE'S WAITING</p><h2>Find your<br /><em>way here.</em></h2></div><a href="https://maps.google.com/?q=5345+Floyd+Rd+SW+%23118,+Mableton,+GA+30126" target="_blank" rel="noreferrer" className="button button-dark">GET DIRECTIONS <Arrow diagonal /></a></div>
          <div className="visit-details"><div><span className="detail-label">DROP BY</span><strong>5345 Floyd Rd SW #118<br />Mableton, GA 30126</strong><a href="tel:+17706757267">(770) 675-7267</a></div><div><span className="detail-label">WHEN WE'RE HERE</span><strong>Mon – Sat <span>11 AM – 9:30 PM</span><br />Sunday <span>12 PM – 9 PM</span></strong></div><div className="visit-last"><span className="detail-label">CONTACT FLOYD WINGS AND GRILL</span><a href={orderUrl} target="_blank" rel="noreferrer">ORDER ONLINE <Arrow diagonal /></a><a href={reservationUrl}>RESERVATIONS <Arrow diagonal /></a><a href="mailto:floydwingsandgrill@gmail.com">EMAIL US <Arrow diagonal /></a></div></div>
        </section>
      </main>
      <footer className="site-footer"><a className="site-logo footer-logo" href="#home"><img className="official-logo" src="/floyd-logo.png" alt="Floyd Wings and Grill" /></a><span>FLOYD WINGS AND GRILL · MABLETON, GEORGIA</span><div><a href="#menu">MENU</a><a href={cateringUrl}>CATERING</a><a href="#visit">CONTACT</a><a href="https://www.facebook.com/235074139697860" target="_blank" rel="noreferrer">FACEBOOK ↗</a></div></footer>
    </div>
  )
}

export default App
