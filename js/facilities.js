(function(){
/* ── PARTICLES ─────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas_fac');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    const section = document.getElementById('facilities');
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
      life: 0,
      maxLife: Math.random() * 300 + 200,
    };
  }

  for (let i = 0; i < 70; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.life++;
      if (p.life > p.maxLife || p.y < 0) particles[i] = createParticle();
      const fadeIn  = Math.min(p.life / 60, 1);
      const fadeOut = Math.min((p.maxLife - p.life) / 60, 1);
      const a = p.alpha * fadeIn * fadeOut;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(57,255,20,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ── CARD LAST (10th) centering fix for 3-col ─────────────── */
function fixLastCard() {
  const last = document.getElementById('lastCard');
  const grid = document.getElementById('facilitiesGrid');
  const cols = window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  if (cols === 3) {
    last.style.gridColumn = '2 / 3';
  } else {
    last.style.gridColumn = '';
  }
}
fixLastCard();
window.addEventListener('resize', fixLastCard);

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (el.classList.contains('facility-card')) {
        const idx = parseInt(el.dataset.idx || 0);
        setTimeout(() => {
          el.style.transition = `
            opacity 0.7s cubic-bezier(0.16,1,0.3,1),
            transform 0.7s cubic-bezier(0.16,1,0.3,1)
          `;
          el.classList.add('revealed');
        }, idx * 80);
      } else {
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
      observer.unobserve(el);
    }
  });
}, { threshold: 0.08 });

// Assign indices and observe cards
document.querySelectorAll('.facility-card').forEach((card, i) => {
  card.dataset.idx = i;
  observer.observe(card);
});

// Observe header & stats
document.querySelectorAll('[data-reveal]').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  observer.observe(el);
});

/* ── COUNTER ANIMATION ────────────────────────────────────── */
function animateCount(el, target, suffix = '') {
  const dur = 1800;
  const start = performance.now();
  const isLarge = target >= 1000;
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    const val = Math.round(ease * target);
    if (isLarge) {
      el.textContent = (val / 1000).toFixed(0) + 'K+';
    } else if (target === 24) {
      el.textContent = val + '/7';
    } else {
      el.textContent = val + '+';
    }
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animateCount(el, parseInt(el.dataset.count));
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

/* ── MOUSE PARALLAX ON CARDS ─────────────────────────────── */
document.querySelectorAll('.facility-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-10px) scale(1.02) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
})();