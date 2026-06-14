(function(){
/* ─── Navbar scroll ─── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* ─── Mobile menu ─── */
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobileMenu');
    const openMenu  = () => { hamburger.classList.add('open'); mobileMenu.classList.add('open'); hamburger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; };
    const closeMenu = () => { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
    hamburger.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
    document.querySelectorAll('.mobile-nav-links a').forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if(e.key==='Escape') closeMenu(); });

    /* ─── Particles ─── */
    (function spawnParticles() {
      const container = document.getElementById('particles');
      const count = window.innerWidth < 600 ? 18 : 36;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1.5;
        p.style.cssText = `
          left: ${Math.random()*100}%;
          --size: ${size}px;
          --dur: ${Math.random()*12+7}s;
          --delay: ${Math.random()*12}s;
          --drift: ${(Math.random()-0.5)*80}px;
          opacity: 0;
        `;
        container.appendChild(p);
      }
    })();

    /* ─── Counter animation ─── */
    function animateCounters() {
      const counters = document.querySelectorAll('.stat-number[data-target]');
      counters.forEach(el => {
        const target  = +el.dataset.target;
        const suffix  = el.dataset.suffix || '';
        const dur     = 1800;
        const start   = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / dur, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }

    // Trigger counters when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounters(); statsObserver.disconnect(); } });
    }, { threshold: 0.3 });
    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) statsObserver.observe(statsEl);

    /* ─── Parallax on mouse move (desktop only) ─── */
    if (window.matchMedia('(pointer:fine)').matches) {
      const visual  = document.querySelector('.hero-visual');
      const glowL   = document.querySelector('.hero-glow-left');
      const glowR   = document.querySelector('.hero-glow-right');
      let  raf      = null;

      document.getElementById('hero').addEventListener('mousemove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const w = window.innerWidth, h = window.innerHeight;
          const x = (e.clientX / w - 0.5) * 2;
          const y = (e.clientY / h - 0.5) * 2;

          if (visual) visual.style.transform = `translate(${x * 12}px, ${y * 8}px)`;
          if (glowL)  glowL.style.transform  = `translate(${x * 20}px, ${y * 14}px)`;
          if (glowR)  glowR.style.transform  = `translate(${-x * 16}px, ${-y * 10}px)`;
        });
      });

      document.getElementById('hero').addEventListener('mouseleave', () => {
        if (visual) visual.style.transform = '';
        if (glowL)  glowL.style.transform  = '';
        if (glowR)  glowR.style.transform  = '';
      });
    }
})();