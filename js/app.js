/* ==========================================================================
   MEMORIA — THE WORKSHOP WINDOW
   Application Logic

   - SPA hash-based routing (8 pages)
   - Gift carousel (horizontal scroll)
   - Gift catalogue with filters
   - Gallery with masonry layout + lightbox
   - Testimonial rotation
   - Personalization studio (live preview)
   - WhatsApp enquiry flow
   - Mobile hamburger menu
   - Contact form → WhatsApp
   - Toast notifications
   ========================================================================== */

/* ─── Constants ─────────────────────────────────────────────────────── */
const WHATSAPP_NUMBER = '919876543210';

/* ─── DOM Refs ──────────────────────────────────────────────────────── */
const siteHeader       = document.querySelector('.site-header');
const mobileMenuBtn    = document.getElementById('mobileMenuBtn');
const navLinksContainer = document.getElementById('navLinksContainer');
const giftModalOverlay = document.getElementById('giftModalOverlay');
const giftModalClose   = document.getElementById('giftModalClose');
const modalGiftImg     = document.getElementById('modalGiftImg');
const modalGiftBody    = document.getElementById('modalGiftBody');
const lightboxOverlay  = document.getElementById('lightboxOverlay');
const lightboxClose    = document.getElementById('lightboxClose');
const lightboxImg      = document.getElementById('lightboxImg');
const toastEl          = document.getElementById('toastNotification');

/* ─── Route Map ─────────────────────────────────────────────────────── */
const ROUTES = {
  home:         'page-home',
  gifts:        'page-gifts',
  personalized: 'page-personalized',
  occasions:    'page-occasions',
  about:        'page-about',
  gallery:      'page-gallery',
  corporate:    'page-corporate',
  contact:      'page-contact',
};

let currentRoute = 'home';


/* ═══════════════════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════════════════ */

function navigateTo(route) {
  if (!ROUTES[route]) return;
  if (route === currentRoute) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const oldPage = document.getElementById(ROUTES[currentRoute]);
  if (oldPage) oldPage.classList.remove('active');

  currentRoute = route;
  const newPage = document.getElementById(ROUTES[route]);
  if (newPage) newPage.classList.add('active');

  window.location.hash = route;

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-route') === route);
  });

  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Page-specific init
  if (route === 'gifts') initCatalogueGrid();
  if (route === 'occasions') initOccasionsPage();
  if (route === 'gallery') initGalleryGrid();
}

function handleInitialRoute() {
  const hash = window.location.hash.replace('#', '');
  if (hash && ROUTES[hash]) navigateTo(hash);
}


/* ─── Scroll: header shadow ─────────────────────────────────────────── */
function handleScroll() {
  if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();


/* ─── Mobile menu ───────────────────────────────────────────────────── */
function closeMobileMenu() {
  if (navLinksContainer) navLinksContainer.classList.remove('open');
  if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const route = link.getAttribute('data-route');
    if (route) navigateTo(route);
  });
});


/* ═══════════════════════════════════════════════════════════════════════
   WHATSAPP
═══════════════════════════════════════════════════════════════════════ */

function openWhatsApp(message) {
  const encoded = encodeURIComponent(message || 'Hello! I\'d like to enquire about a gift from Memoria.');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer');
}

function openWhatsAppEnquiry() {
  openWhatsApp('Hello Memoria! I\'d like to explore your personalized gifting options. Could you help me find the perfect gift?');
}


/* ═══════════════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════════════ */

let toastTimer;
function showToast(message, duration = 4000) {
  if (!toastEl) return;
  if (toastTimer) clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
}


/* ═══════════════════════════════════════════════════════════════════════
   GIFTS DATA
═══════════════════════════════════════════════════════════════════════ */

const GIFTS = (typeof GIFTS_DATA !== 'undefined' && Array.isArray(GIFTS_DATA)) ? GIFTS_DATA : [];


/* ═══════════════════════════════════════════════════════════════════════
   OCCASIONS DATA
═══════════════════════════════════════════════════════════════════════ */

const OCCASIONS = [
  { icon: '💍', name: 'Anniversary',     desc: 'Celebrate years of love',        filter: 'anniversary' },
  { icon: '🎂', name: 'Birthday',        desc: 'Make their day special',         filter: 'birthday' },
  { icon: '💒', name: 'Wedding',         desc: 'Memorable wedding gifts',        filter: 'wedding' },
  { icon: '❤️', name: 'Love & Couples', desc: 'For the one you love',           filter: 'couples' },
  { icon: '👶', name: 'Baby & Newborn',  desc: 'Welcome the little one',        filter: 'newborn' },
  { icon: '🤝', name: 'Friendship',      desc: 'For your closest friends',      filter: 'friendship' },
  { icon: '🕊️', name: 'Memorial',       desc: 'Honour those we cherish',       filter: 'memorial' },
  { icon: '🏢', name: 'Corporate',       desc: 'Business gifting solutions',    filter: 'corporate' },
];


/* ═══════════════════════════════════════════════════════════════════════
   TESTIMONIALS DATA
═══════════════════════════════════════════════════════════════════════ */

const TESTIMONIALS = [
  {
    text: 'The memory frame we ordered for our 5th anniversary was absolutely stunning. The engraving was flawless and the packaging made it feel truly special.',
    name: 'Sneha & Arjun',
    occasion: 'Anniversary Gift',
  },
  {
    text: 'I ordered a Night Sky Map for my partner\'s birthday. It captured the exact stars from the night we met. She cried happy tears — best gift I\'ve ever given.',
    name: 'Rahul M.',
    occasion: 'Birthday Gift',
  },
  {
    text: 'We needed 50 custom keepsake boxes for our company retreat. Memoria delivered on time, beautifully branded, and at great value. Truly impressive.',
    name: 'Priya K.',
    occasion: 'Corporate Gifting',
  },
  {
    text: 'The linen journal with my initials was so beautiful I almost didn\'t want to write in it. Almost. It\'s now my most treasured possession.',
    name: 'Ananya S.',
    occasion: 'Friendship Gift',
  },
];


/* ═══════════════════════════════════════════════════════════════════════
   GALLERY DATA
═══════════════════════════════════════════════════════════════════════ */

const GALLERY_ITEMS = [
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80', alt: 'Hand-engraved oak frame', cat: 'frames' },
  { src: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', alt: 'Walnut keepsake box with brass hinges', cat: 'boxes' },
  { src: 'https://images.unsplash.com/photo-1614094082869-cd4e4b2905c7?auto=format&fit=crop&w=800&q=80', alt: 'Night sky star map print', cat: 'maps' },
  { src: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=600&q=80', alt: 'Linen memory journal', cat: 'boxes' },
  { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', alt: 'Brass city map etching', cat: 'maps' },
  { src: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', alt: 'Heritage gift set collection', cat: 'sets' },
  { src: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80', alt: 'Birth announcement frame', cat: 'frames' },
  { src: 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?auto=format&fit=crop&w=800&q=80', alt: 'Memorial keepsake box', cat: 'boxes' },
  { src: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=600&q=80', alt: 'Personalised portrait artwork', cat: 'maps' },
  { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80', alt: 'Corporate gift packages', cat: 'sets' },
  { src: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=600&q=80', alt: 'Artisan crafting in studio', cat: 'frames' },
  { src: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80', alt: 'Gift wrapping with ribbon', cat: 'sets' },
];


/* ═══════════════════════════════════════════════════════════════════════
   RENDER: GIFT CARDS
═══════════════════════════════════════════════════════════════════════ */

function buildGiftCard(gift, isCarousel) {
  const card = document.createElement('article');
  card.className = 'gift-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `${gift.name} — ${gift.category}`);

  card.innerHTML = `
    <div class="gift-card-media">
      <img src="${gift.image}" alt="${gift.name}" loading="lazy" class="gift-card-img">
      ${gift.badge ? `<span class="gift-card-badge">${gift.badge}</span>` : ''}
    </div>
    <div class="gift-card-body">
      <p class="gift-card-cat">${gift.category}</p>
      <h3 class="gift-card-name">${gift.name}</h3>
      <p class="gift-card-desc">${gift.description}</p>
      <button class="gift-card-enquire" aria-label="Enquire about ${gift.name}" data-gift-id="${gift.id}">
        Enquire about this <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
  `;

  card.querySelector('.gift-card-enquire').addEventListener('click', e => {
    e.stopPropagation();
    openWhatsApp(gift.whatsappMsg || `Hello! I'm interested in the ${gift.name} from Memoria.`);
  });

  card.addEventListener('click', () => openGiftModal(gift));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGiftModal(gift); }
  });

  return card;
}

/* Render into horizontal scroll (carousel) */
function renderGiftsCarousel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  GIFTS.forEach(gift => container.appendChild(buildGiftCard(gift, true)));
}

/* Render into grid */
function renderGiftsGrid(containerId, filter) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const filtered = (!filter || filter === 'all')
    ? GIFTS
    : GIFTS.filter(g => g.occasions?.includes(filter) || g.cat === filter);

  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = '<p style="color:var(--ink-50);font-size:0.9rem;padding:var(--space-6) 0;text-align:center;">No gifts found — message us for a custom commission.</p>';
    return;
  }
  filtered.forEach(gift => container.appendChild(buildGiftCard(gift, false)));
}


/* ═══════════════════════════════════════════════════════════════════════
   RENDER: OCCASIONS
═══════════════════════════════════════════════════════════════════════ */

function renderOccasions(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  OCCASIONS.forEach(occ => {
    const card = document.createElement('div');
    card.className = 'occasion-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <span class="occasion-icon" aria-hidden="true">${occ.icon}</span>
      <h3>${occ.name}</h3>
      <p>${occ.desc}</p>
    `;
    card.addEventListener('click', () => navigateTo('occasions'));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo('occasions'); }
    });
    container.appendChild(card);
  });
}


/* ═══════════════════════════════════════════════════════════════════════
   TESTIMONIAL ROTATION
═══════════════════════════════════════════════════════════════════════ */

let testimonialIndex = 0;
let testimonialInterval;

function renderTestimonial(index) {
  const textEl    = document.getElementById('testimonialText');
  const authorEl  = document.getElementById('testimonialAuthor');
  const occEl     = document.getElementById('testimonialOccasion');
  if (!textEl || !authorEl || !occEl) return;

  const t = TESTIMONIALS[index];
  // Fade out
  textEl.style.opacity = '0';
  authorEl.style.opacity = '0';
  occEl.style.opacity = '0';

  setTimeout(() => {
    textEl.textContent = t.text;
    authorEl.textContent = `— ${t.name}`;
    occEl.textContent = t.occasion;
    textEl.style.opacity = '1';
    authorEl.style.opacity = '1';
    occEl.style.opacity = '1';
  }, 300);

  // Update dots
  document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function initTestimonials() {
  const dotsContainer = document.getElementById('testimonialDots');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';
  TESTIMONIALS.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => {
      testimonialIndex = i;
      renderTestimonial(i);
      resetTestimonialTimer();
    });
    dotsContainer.appendChild(dot);
  });

  renderTestimonial(0);

  testimonialInterval = setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % TESTIMONIALS.length;
    renderTestimonial(testimonialIndex);
  }, 6000);
}

function resetTestimonialTimer() {
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % TESTIMONIALS.length;
    renderTestimonial(testimonialIndex);
  }, 6000);
}


/* ═══════════════════════════════════════════════════════════════════════
   GALLERY
═══════════════════════════════════════════════════════════════════════ */

function renderGallery(filter) {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  const items = (!filter || filter === 'all')
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(g => g.cat === filter);

  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.setAttribute('role', 'listitem');
    div.setAttribute('tabindex', '0');
    div.innerHTML = `
      <img src="${item.src}" alt="${item.alt}" loading="lazy">
      <div class="gallery-item-overlay"><i class="fa-solid fa-expand" aria-hidden="true"></i></div>
    `;
    div.addEventListener('click', () => openLightbox(item.src, item.alt));
    div.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item.src, item.alt); }
    });
    container.appendChild(div);
  });
}

function initGalleryGrid() {
  renderGallery('all');
  document.querySelectorAll('[data-gallery-filter]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-gallery-filter]').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderGallery(tab.getAttribute('data-gallery-filter'));
    });
  });
}


/* ═══════════════════════════════════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════════════════════════════════ */

function openLightbox(src, alt) {
  if (!lightboxOverlay || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => lightboxClose?.focus(), 100);
}

function closeLightbox() {
  if (!lightboxOverlay) return;
  lightboxOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxOverlay) lightboxOverlay.addEventListener('click', e => { if (e.target === lightboxOverlay) closeLightbox(); });


/* ═══════════════════════════════════════════════════════════════════════
   GIFT MODAL
═══════════════════════════════════════════════════════════════════════ */

function openGiftModal(gift) {
  if (!giftModalOverlay || !modalGiftImg || !modalGiftBody) return;

  modalGiftImg.src = gift.image;
  modalGiftImg.alt = gift.name;

  const escapedMsg = (gift.whatsappMsg || `Hello! I'm interested in the ${gift.name}.`).replace(/'/g, "\\'");

  modalGiftBody.innerHTML = `
    <p class="gift-card-cat">${gift.category}</p>
    <h2 id="modalGiftTitle">${gift.name}</h2>
    <p>${gift.description}</p>
    <p style="font-style:italic;color:var(--ink-30);font-size:0.8rem;margin-top:var(--space-2);">All prices on enquiry. Each piece is made to order.</p>
    <div class="modal-actions">
      <button class="btn btn-whatsapp" onclick="openWhatsApp('${escapedMsg}')">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Enquire on WhatsApp
      </button>
      <button class="btn btn-outline" onclick="closeGiftModal()">
        Continue browsing
      </button>
    </div>
  `;

  giftModalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => giftModalClose?.focus(), 100);
}

function closeGiftModal() {
  if (!giftModalOverlay) return;
  giftModalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (giftModalClose) giftModalClose.addEventListener('click', closeGiftModal);
if (giftModalOverlay) giftModalOverlay.addEventListener('click', e => { if (e.target === giftModalOverlay) closeGiftModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeGiftModal(); closeLightbox(); }
});


/* ═══════════════════════════════════════════════════════════════════════
   CATALOGUE FILTERS
═══════════════════════════════════════════════════════════════════════ */

function initCatalogueGrid() {
  renderGiftsGrid('catalogGrid', 'all');
  document.querySelectorAll('#page-gifts .filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#page-gifts .filter-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderGiftsGrid('catalogGrid', tab.getAttribute('data-filter'));
    });
  });
}


/* ═══════════════════════════════════════════════════════════════════════
   OCCASIONS PAGE
═══════════════════════════════════════════════════════════════════════ */

function initOccasionsPage() {
  renderOccasions('fullOccasionsGrid');
  renderGiftsGrid('occasionGiftsGrid', 'all');
}


/* ═══════════════════════════════════════════════════════════════════════
   PERSONALIZATION STUDIO
═══════════════════════════════════════════════════════════════════════ */

function updatePreview() {
  const name1 = document.getElementById('studioName1')?.value || 'Arjun';
  const name2 = document.getElementById('studioName2')?.value || '';
  const date  = document.getElementById('studioDate')?.value || '14 · 02 · 2019';
  const quote = document.getElementById('studioQuote')?.value || '"Every love story is beautiful, but ours is my favourite."';

  const namesEl = document.getElementById('previewNames');
  const dateEl  = document.getElementById('previewDate');
  const quoteEl = document.getElementById('previewQuote');

  if (namesEl) namesEl.textContent = name2 ? `${name1} & ${name2}` : name1;
  if (dateEl)  dateEl.textContent  = date;
  if (quoteEl) quoteEl.textContent = quote;
}

function selectFrameStyle(btn) {
  document.querySelectorAll('.frame-style-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-checked', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-checked', 'true');

  const style = btn.getAttribute('data-style');
  const styleEl = document.getElementById('previewStyle');
  if (styleEl) styleEl.textContent = `Selected finish: ${style}`;
}

function sendStudioToWhatsApp() {
  const name1 = document.getElementById('studioName1')?.value || '';
  const name2 = document.getElementById('studioName2')?.value || '';
  const date  = document.getElementById('studioDate')?.value || '';
  const quote = document.getElementById('studioQuote')?.value || '';
  const style = document.querySelector('.frame-style-btn.active')?.getAttribute('data-style') || 'Natural Teak';
  const names = name2 ? `${name1} & ${name2}` : name1;

  openWhatsApp(`Hello Memoria! I'd like to order a personalized gift.\n\nNames: ${names}\nDate: ${date}\nQuote: ${quote}\nFrame Finish: ${style}\n\nPlease share pricing and timeline.`);
}


/* ═══════════════════════════════════════════════════════════════════════
   FORMS
═══════════════════════════════════════════════════════════════════════ */

function handleContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const name     = form.elements['name']?.value.trim();
  const phone    = form.elements['phone']?.value.trim();
  const occasion = form.elements['occasion']?.value;
  const gift     = form.elements['gift']?.value.trim();
  const message  = form.elements['message']?.value.trim();

  if (!name || !phone || !message) {
    showToast('Please fill in your name, phone number, and message.');
    return;
  }

  openWhatsApp(`Hello Memoria! My name is ${name} (${phone}).${occasion ? '\nOccasion: ' + occasion : ''}${gift ? '\nGift: ' + gift : ''}\n\n${message}`);
  form.reset();
  showToast('Opening WhatsApp — we\'ll be in touch shortly!');
}

function handleNewsletterSignup(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]')?.value.trim();
  if (!email) return;
  e.target.reset();
  showToast('You\'re on the list — thank you!');
}


/* ═══════════════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════════════ */

function initApp() {
  // Home page
  renderGiftsCarousel('featuredGiftsScroll');
  initTestimonials();

  // Pre-init pages
  initCatalogueGrid();
  initGalleryGrid();
  initOccasionsPage();

  // Route
  handleInitialRoute();

  // Hash change listener
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ROUTES[hash] && hash !== currentRoute) navigateTo(hash);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
