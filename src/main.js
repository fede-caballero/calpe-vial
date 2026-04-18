import './style.css'

/* ═══════════════════════════════════════════════
   CALPE VIAL — Main JavaScript
   ═══════════════════════════════════════════════ */

// ── Client logos from original site ──
const totalPortfolioImages = 83;

function generateLogoImage(index) {
  const el = document.createElement('div');
  el.className = 'logo-item';
  el.innerHTML = `
    <img src="/img/portfolio/portfolio-${index}.png" alt="Cliente Calpe ${index}" class="max-w-full max-h-full object-contain px-4 py-2" loading="lazy" />
  `;
  return el;
}

function populateLogos() {
  const track1 = document.getElementById('logo-track-1');
  const track2 = document.getElementById('logo-track-2');
  if (!track1 || !track2) return;

  const half = Math.ceil(totalPortfolioImages / 2);
  
  // Create arrays of indices for the two rows
  const row1Indices = Array.from({length: half}, (_, i) => i + 1);
  const row2Indices = Array.from({length: totalPortfolioImages - half}, (_, i) => i + half + 1);

  // Duplicate for infinite scroll effect
  const populateTrack = (track, indices) => {
    for (let i = 0; i < 3; i++) {
      indices.forEach(index => {
        track.appendChild(generateLogoImage(index));
      });
    }
  };

  populateTrack(track1, row1Indices);
  populateTrack(track2, row2Indices);
}


// ── Scroll reveal animations ──
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve if we want re-triggering, but for perf we unobserve
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


// ── Navbar scroll effect ──
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}


// ── Mobile menu ──
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');
  if (!btn || !menu) return;

  let isOpen = false;

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    
    if (isOpen) {
      menu.style.maxHeight = menu.scrollHeight + 'px';
      bar1.style.transform = 'rotate(45deg) translate(4px, 4px)';
      bar2.style.opacity = '0';
      bar3.style.transform = 'rotate(-45deg) translate(4px, -4px)';
      bar3.style.width = '1.5rem';
    } else {
      menu.style.maxHeight = '0';
      bar1.style.transform = '';
      bar2.style.opacity = '1';
      bar3.style.transform = '';
      bar3.style.width = '1rem';
    }
  });

  // Close menu on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false;
      menu.style.maxHeight = '0';
      bar1.style.transform = '';
      bar2.style.opacity = '1';
      bar3.style.transform = '';
      bar3.style.width = '1rem';
    });
  });
}


// ── Stats counter animation ──
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          
          el.textContent = current + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target + suffix;
          }
        }
        
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}


// ── Contact form → WhatsApp message ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();
    
    // Build WhatsApp message
    const serviceLabels = {
      'estructuras': 'Estructuras Publicitarias',
      'impresiones': 'Impresiones de Gran Formato',
      'led': 'Publicidad LED',
      'integral': 'Proyecto Integral',
      'otro': 'Otro'
    };
    
    let waMessage = `Hola, soy *${name}*.\n`;
    if (service) waMessage += `Estoy interesado/a en: *${serviceLabels[service] || service}*\n`;
    if (phone) waMessage += `Mi teléfono: ${phone}\n`;
    if (email) waMessage += `Mi email: ${email}\n`;
    waMessage += `\n${message}`;
    
    const waUrl = `https://wa.me/5492622521077?text=${encodeURIComponent(waMessage)}`;
    
    // Visual feedback
    btn.textContent = '✓ Redirigiendo a WhatsApp...';
    btn.style.background = 'linear-gradient(to right, #059669, #10b981)';
    btn.disabled = true;
    
    setTimeout(() => {
      window.open(waUrl, '_blank');
      setTimeout(() => {
        btn.textContent = 'Enviar Consulta';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 2000);
    }, 500);
  });
}


// ── Gallery Lightbox ──
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.className = 'fixed inset-0 z-[9999] bg-charcoal-950/95 backdrop-blur-lg flex items-center justify-center p-6 opacity-0 pointer-events-none transition-opacity duration-300';
  overlay.innerHTML = `
    <button id="lightbox-close" class="absolute top-6 right-6 w-10 h-10 rounded-full bg-charcoal-700/50 border border-charcoal-600/30 flex items-center justify-center text-steel-300 hover:text-white hover:bg-charcoal-600/50 transition-all z-10" aria-label="Cerrar">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <button id="lightbox-prev" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-charcoal-700/50 border border-charcoal-600/30 flex items-center justify-center text-steel-300 hover:text-white hover:bg-charcoal-600/50 transition-all" aria-label="Anterior">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </button>
    <button id="lightbox-next" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-charcoal-700/50 border border-charcoal-600/30 flex items-center justify-center text-steel-300 hover:text-white hover:bg-charcoal-600/50 transition-all" aria-label="Siguiente">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>
    <div class="max-w-4xl max-h-[80vh] relative">
      <img id="lightbox-img" src="" alt="" class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-transform duration-300" />
      <p id="lightbox-caption" class="text-center text-steel-300 text-sm mt-4 font-medium"></p>
    </div>
  `;
  document.body.appendChild(overlay);

  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  let currentIndex = 0;
  const items = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = items[index];
    const img = item.querySelector('img');
    const caption = item.dataset.caption || '';
    
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = caption;
    
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector('img');
    lbImg.style.transform = 'scale(0.95)';
    setTimeout(() => {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = item.dataset.caption || '';
      lbImg.style.transform = 'scale(1)';
    }, 150);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => navigate(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => navigate(1));
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (overlay.style.opacity !== '1') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}


// ── Smooth scroll for all anchor links ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80; // navbar height
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


// ── Initialize everything ──
document.addEventListener('DOMContentLoaded', () => {
  populateLogos();
  initScrollReveal();
  initNavbar();
  initMobileMenu();
  initCounters();
  initContactForm();
  initLightbox();
  initSmoothScroll();
});
