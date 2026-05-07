import './style.css'

/* ═══════════════════════════════════════════════
   CALPE VIAL — Subpage JavaScript (shared)
   ═══════════════════════════════════════════════ */

// ── Scroll reveal animations ──
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
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

// ── Active nav indicator ──
function initActiveNav() {
  const filename = window.location.pathname.split('/').pop() || '';
  const labels = {
    'estructuras.html':    'Producción',
    'impresiones.html':    'Gráfica y Cartelería',
    'publicidad-led.html': 'Vía Pública',
  };
  const label = labels[filename];
  if (!label) return;

  // Desktop: inject current-page chip into the nav links row
  const desktopNav = document.querySelector('.hidden.md\\:flex.items-center');
  if (desktopNav) {
    const chip = document.createElement('span');
    chip.className = 'nav-current';
    chip.textContent = label;
    desktopNav.insertBefore(chip, desktopNav.firstChild);
  }

  // Mobile: inject section label at top of mobile dropdown
  const mobileMenu = document.querySelector('#mobile-menu > div');
  if (mobileMenu) {
    const row = document.createElement('div');
    row.className = 'nav-current-mobile';
    row.innerHTML = `
      <div style="width:3px;height:1rem;background:var(--color-copper-500);border-radius:2px;flex-shrink:0;"></div>
      <span style="color:var(--color-copper-400);font-weight:600;font-size:0.9375rem;">${label}</span>
    `;
    mobileMenu.insertBefore(row, mobileMenu.firstChild);
  }
}


// ── Back to top button ──
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
  </svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ── WhatsApp tooltip ──
function initWaTooltip() {
  const tooltip = document.createElement('div');
  tooltip.className = 'wa-tooltip';
  tooltip.textContent = '¿Consultás por WhatsApp?';
  document.body.appendChild(tooltip);

  const hide = () => tooltip.classList.remove('visible');

  const showTimer = setTimeout(() => {
    tooltip.classList.add('visible');
    setTimeout(hide, 4000);
  }, 3000);

  document.querySelector('.whatsapp-float')?.addEventListener('click', () => {
    clearTimeout(showTimer);
    hide();
  });
}


document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initMobileMenu();
  initCounters();
  initActiveNav();
  initBackToTop();
  initWaTooltip();
});
