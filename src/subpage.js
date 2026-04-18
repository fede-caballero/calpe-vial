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

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initMobileMenu();
  initCounters();
});
