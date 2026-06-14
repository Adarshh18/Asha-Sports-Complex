(function(){
/* ─── Particles ─── */
    (function() {
      const c = document.getElementById('evParticles');
      const n = window.innerWidth < 600 ? 14 : 26;
      for (let i = 0; i < n; i++) {
        const p = document.createElement('div');
        p.className = 'ev-particle';
        p.style.cssText = `
          left:${Math.random()*100}%;
          --sz:${Math.random()*2+1.5}px;
          --dur:${Math.random()*12+8}s;
          --dl:${Math.random()*14}s;
          --dx:${(Math.random()-.5)*80}px;
        `;
        c.appendChild(p);
      }
    })();

    /* ─── Scroll reveal ─── */
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('revealed'); revObs.unobserve(e.target); } });
    }, { threshold: 0.08 });

    revObs.observe(document.getElementById('evHeader'));

    const cards = document.querySelectorAll('.ev-card');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
      revObs.observe(card);
    });

    /* ─── Countdown timers ─── */
    function updateCountdowns() {
      const now = new Date().getTime();
      document.querySelectorAll('.countdown-units[data-target]').forEach(el => {
        const target = new Date(el.dataset.target).getTime();
        const diff   = Math.max(0, target - now);

        const days  = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
        const mins  = Math.floor((diff % (1000*60*60))    / (1000*60));
        const secs  = Math.floor((diff % (1000*60))       / 1000);

        const pad = n => String(n).padStart(2,'0');
        const set = (part, val) => {
          const el2 = el.querySelector(`[data-part="${part}"]`);
          if (el2 && el2.textContent !== pad(val)) el2.textContent = pad(val);
        };
        set('days',  days);
        set('hours', hours);
        set('mins',  mins);
        set('secs',  secs);
      });
    }
    updateCountdowns();
    setInterval(updateCountdowns, 1000);

    /* ─── 3D tilt (desktop) ─── */
    if (window.matchMedia('(pointer:fine)').matches) {
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transition = 'transform .1s linear, box-shadow .4s, border-color .4s';
        });
        card.addEventListener('mousemove', (e) => {
          const r  = card.getBoundingClientRect();
          const rx = ((e.clientY - r.top  - r.height/2) / (r.height/2)) * -5;
          const ry = ((e.clientX - r.left - r.width /2) / (r.width /2)) *  5;
          card.style.transform = `translateY(-10px) scale(1.012) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transition = 'transform .5s var(--ease), box-shadow .4s, border-color .4s';
          card.style.transform  = '';
        });
      });
    }
})();