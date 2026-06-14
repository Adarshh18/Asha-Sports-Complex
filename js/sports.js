(function(){
/* ─── Particle spawn ─── */
    (function() {
      const c = document.getElementById('sParticles');
      const n = window.innerWidth < 600 ? 16 : 28;
      for (let i = 0; i < n; i++) {
        const p = document.createElement('div');
        p.className = 's-particle';
        const sz = Math.random() * 2.5 + 1;
        p.style.cssText = `
          left:${Math.random()*100}%;
          --sz:${sz}px;
          --dur:${Math.random()*12+8}s;
          --dl:${Math.random()*14}s;
          --dx:${(Math.random()-.5)*70}px;
        `;
        c.appendChild(p);
      }
    })();

    /* ─── Scroll reveal ─── */
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    /* Header */
    const hdr = document.getElementById('sHeader');
    if (hdr) revealObs.observe(hdr);

    /* CTA strip */
    const cta = document.getElementById('sCta');
    if (cta) revealObs.observe(cta);

    /* Cards — staggered */
    const cards = document.querySelectorAll('.sport-card');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.10}s`;
      revealObs.observe(card);
    });

    /* ─── Filter tabs ─── */
    const tabs = document.querySelectorAll('.ftab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;

        cards.forEach(card => {
          const cat = card.dataset.category;
          const show = filter === 'all' || cat === filter;

          if (show) {
            card.style.display = '';
            // Re-trigger animation
            card.classList.remove('revealed');
            void card.offsetWidth; // reflow
            card.classList.add('revealed');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    /* ─── 3D tilt on cards (desktop only) ─── */
    if (window.matchMedia('(pointer:fine)').matches) {
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect   = card.getBoundingClientRect();
          const cx     = rect.left + rect.width  / 2;
          const cy     = rect.top  + rect.height / 2;
          const rx     = ((e.clientY - cy) / (rect.height / 2)) * -5;
          const ry     = ((e.clientX - cx) / (rect.width  / 2)) *  5;
          card.style.transform = `translateY(-10px) scale(1.015) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.transition = 'transform .5s var(--ease)';
        });

        card.addEventListener('mouseenter', () => {
          card.style.transition = 'transform .1s linear, box-shadow .4s, border-color .4s';
        });
      });
    }
})();