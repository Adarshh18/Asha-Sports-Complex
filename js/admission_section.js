(function(){
/* ── PARTICLES ──────────────────────────── */
(function(){
  const c = document.getElementById('pCanvas_adm_sec');
  const ctx = c.getContext('2d');
  function resize(){
    const s = document.getElementById('admission');
    c.width = s.offsetWidth; c.height = s.offsetHeight;
  }
  let pts=[];
  function mk(){ return{ x:Math.random()*c.width, y:Math.random()*c.height, r:Math.random()*1.5+.3, vx:(Math.random()-.5)*.25, vy:-Math.random()*.45-.08, a:Math.random()*.3+.08, life:0, max:Math.random()*280+160 }; }
  for(let i=0;i<65;i++) pts.push(mk());
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach((p,i)=>{
      p.x+=p.vx; p.y+=p.vy; p.life++;
      if(p.life>p.max||p.y<0) pts[i]=mk();
      const fi=Math.min(p.life/60,1), fo=Math.min((p.max-p.life)/60,1);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(57,255,20,${p.a*fi*fo})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize); resize(); draw();
})();

/* ── SCROLL REVEAL ──────────────────────── */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target;
    if(el.classList.contains('step-row')){
      const i = parseInt(el.dataset.idx||0);
      setTimeout(()=>{ el.classList.add('revealed'); }, i*150);
    } else {
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      el.style.opacity = '1'; el.style.transform = 'translateY(0)';
    }
    obs.unobserve(el);
  });
},{threshold:.12});

document.querySelectorAll('.step-row').forEach(r => obs.observe(r));
document.querySelectorAll('[data-reveal]').forEach(el=>{
  el.style.opacity='0'; el.style.transform='translateY(28px)';
  obs.observe(el);
});

/* CTA reveal */
const ctaObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('revealed'); ctaObs.unobserve(e.target); }
  });
},{threshold:.2});
ctaObs.observe(document.getElementById('ctaArea'));

/* ── TILT ON STEP CARDS ─────────────────── */
document.querySelectorAll('.step-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r = card.getBoundingClientRect();
    const dx = (e.clientX-r.left-r.width/2)/(r.width/2);
    const dy = (e.clientY-r.top-r.height/2)/(r.height/2);
    card.style.transform=`translateY(-8px) rotateX(${-dy*4}deg) rotateY(${dx*4}deg)`;
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
});

/* ── ANIMATED SPINE DRAW ON SCROLL ─────── */
const spine = document.querySelector('.timeline-spine');
const spineObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      spine.style.transition='opacity .8s ease';
      spine.style.opacity='1';
      spineObs.unobserve(spine);
    }
  });
},{threshold:.05});
spine.style.opacity='0';
spineObs.observe(spine);
})();