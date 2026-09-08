// ===== Mobile nav =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const closeBtn = document.querySelector('.close-btn');

function openMenu(){
  mobileMenu.classList.add('open');
  menuOverlay.classList.add('open');
}
function closeMenu(){
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
}
hamburger && hamburger.addEventListener('click', openMenu);
closeBtn && closeBtn.addEventListener('click', closeMenu);
menuOverlay && menuOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));

// ===== Portfolio filters =====
const filterBtns = document.querySelectorAll('.filter-btn');
const pieces = document.querySelectorAll('.piece');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    pieces.forEach(p => {
      const show = cat === 'all' || p.dataset.category === cat;
      p.style.display = show ? '' : 'none';
    });
  });
});

// ===== Lightbox =====
const lightbox = document.querySelector('.lightbox');
const lbImg = document.querySelector('.lightbox-img');
const lbTitle = document.querySelector('.lightbox-title');
const lbCat = document.querySelector('.lightbox-cat');
const lbGrid = document.querySelector('.lightbox-grid');
const lbDesc = document.querySelector('.lightbox-desc');
const lbSimilarBtn = document.querySelector('.lightbox-similar');

pieces.forEach(p => {
  p.addEventListener('click', () => {
    const img = p.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbTitle.textContent = p.dataset.title || '';
    lbCat.textContent = p.dataset.category || '';
    lbDesc.textContent = p.dataset.desc || '';
    lbGrid.innerHTML = `
      <div><b>Location</b>${p.dataset.location || '—'}</div>
      <div><b>Materials</b>${p.dataset.materials || '—'}</div>
      <div><b>Finish</b>${p.dataset.finish || '—'}</div>
      <div><b>Dimensions</b>${p.dataset.dimensions || '—'}</div>
    `;
    if (lbSimilarBtn) {
      const msg = encodeURIComponent(`Hi, I'd like to request something similar to your "${p.dataset.title}" piece.`);
      lbSimilarBtn.href = `https://wa.me/233244647105?text=${msg}`;
    }
    lightbox.classList.add('open');
  });
});
document.querySelector('.lightbox-close') && document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox && lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });

// ===== FAQ accordion =====
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    q.parentElement.classList.toggle('open');
  });
});

// ===== Quote form -> WhatsApp (with validation, spam guard, status messages) =====
const quoteForm = document.querySelector('#quote-form');
const quoteStatus = document.querySelector('#quote-status');
let lastSubmit = 0;

function showStatus(msg, isError){
  if (!quoteStatus) return;
  quoteStatus.textContent = msg;
  quoteStatus.style.display = 'block';
  quoteStatus.style.color = isError ? '#e08a6d' : '#7fd996';
}

function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidGhPhone(v){ return /^(0|\+233)[0-9]{9}$/.test(v.replace(/[\s-]/g, '')); }

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot spam check — bots fill hidden fields, humans never see this one
    if (quoteForm.querySelector('input[name="company_website"]').value) {
      return; // silently drop — looks like nothing happened, no error given to the bot
    }

    // Basic rate-limit: block resubmits within 15s (crude client-side spam guard)
    const now = Date.now();
    if (now - lastSubmit < 15000) {
      showStatus('Please wait a few seconds before submitting again.', true);
      return;
    }

    const f = new FormData(quoteForm);
    const name = (f.get('name') || '').trim();
    const phone = (f.get('phone') || '').trim();
    const email = (f.get('email') || '').trim();
    const description = (f.get('description') || '').trim();

    if (!name) { showStatus('Please enter your name.', true); return; }
    if (!phone || !isValidGhPhone(phone)) { showStatus('Please enter a valid phone number (e.g. 0244 647 105).', true); return; }
    if (email && !isValidEmail(email)) { showStatus('That email address doesn\'t look right.', true); return; }
    if (!description) { showStatus('Please describe what you\'d like built.', true); return; }

    const hasFile = f.get('reference') && f.get('reference').name;
    const lines = [
      'Hello Flawless Enterprise,',
      "I'd like to request a quote.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Furniture type: ${f.get('type') || '-'}`,
      `Description: ${description}`,
      `Preferred material: ${f.get('material') || '-'}`,
      `Dimensions: ${f.get('dimensions') || '-'}`,
      `Budget range: ${f.get('budget') || '-'}`,
      `Location: ${f.get('location') || '-'}`,
      `Preferred completion date: ${f.get('date') || '-'}`,
      hasFile ? "(I've attached a reference photo separately in this chat)" : null,
    ].filter(Boolean);

    const msg = encodeURIComponent(lines.join('\n'));
    lastSubmit = now;
    window.open(`https://wa.me/233244647105?text=${msg}`, '_blank');

    if (hasFile) {
      showStatus('Opening WhatsApp — please attach your reference photo in the chat before sending, since WhatsApp links can\'t carry files automatically.', false);
    } else {
      showStatus('Opening WhatsApp with your quote request. Send the message to reach us.', false);
    }
  });
}
