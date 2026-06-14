(function(){
/* ─── Scroll Reveal — IntersectionObserver ─── */
    const revealTargets = [
      { el: document.getElementById('aboutVisual'),  cls: 'revealed' },
      { el: document.getElementById('aboutContent'), cls: 'revealed' },
    ];

    const srItems = document.querySelectorAll('.sr');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(t => { if(t.el) observer.observe(t.el); });
    srItems.forEach(el => observer.observe(el));

    /* ─── Animated counters (trigger on visibility) ─── */
    let countersDone = false;
    const counters = document.querySelectorAll('.counter[data-target]');

    function runCounters() {
      if (countersDone) return;
      countersDone = true;
      counters.forEach(el => {
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        const dur    = 1800;
        const start  = performance.now();
        const tick   = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const e = 1 - Math.pow(1 - t, 3);  /* ease-out cubic */
          el.textContent = Math.round(e * target) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }

    const statsBlock = document.querySelector('.about-stats');
    if (statsBlock) {
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) runCounters();
      }, { threshold: 0.3 }).observe(statsBlock);
    }

    /* ─── Subtle parallax on mouse move (desktop) ─── */
    if (window.matchMedia('(pointer:fine)').matches) {
      const section  = document.getElementById('about');
      const visual   = document.getElementById('aboutVisual');
      const glowL    = document.querySelector('.about-glow-l');
      const glowR    = document.querySelector('.about-glow-r');
      let raf = null;

      section.addEventListener('mousemove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const rect = section.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
          const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
          if (visual) visual.style.transform = `translate(${x*8}px, ${y*5}px)`;
          if (glowL)  glowL.style.transform  = `translate(${x*18}px,${y*12}px)`;
          if (glowR)  glowR.style.transform  = `translate(${-x*14}px,${-y*9}px)`;
        });
      });

      section.addEventListener('mouseleave', () => {
        if (visual) visual.style.transform = '';
        if (glowL)  glowL.style.transform  = '';
        if (glowR)  glowR.style.transform  = '';
      });
    }
})();