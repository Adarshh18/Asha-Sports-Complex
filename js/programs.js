(function(){
/* ── PARTICLES ───────────────────────────── */
(function(){
  const c = document.getElementById('pCanvas_programs');
  const ctx = c.getContext('2d');
  function resize(){
    const s = document.getElementById('programs');
    c.width = s.offsetWidth; c.height = s.offsetHeight;
  }
  let pts = [];
  function mk(){
    return{ x:Math.random()*c.width, y:Math.random()*c.height,
      r:Math.random()*1.5+.3, vx:(Math.random()-.5)*.28,
      vy:-Math.random()*.48-.08, a:Math.random()*.35+.08,
      life:0, max:Math.random()*260+170 };
  }
  for(let i=0;i<70;i++) pts.push(mk());
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach((p,i)=>{
      p.x+=p.vx; p.y+=p.vy; p.life++;
      if(p.life>p.max||p.y<0) pts[i]=mk();
      const fi=Math.min(p.life/60,1);
      const fo=Math.min((p.max-p.life)/60,1);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(57,255,20,${p.a*fi*fo})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize); resize(); draw();
})();

/* ── SCROLL REVEAL ───────────────────────── */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target;
    if(el.classList.contains('prog-card')){
      const i = parseInt(el.dataset.idx||0);
      setTimeout(()=>{ el.classList.add('revealed'); }, i*110);
    } else {
      el.style.transition='opacity .8s ease, transform .8s ease';
      el.style.opacity='1'; el.style.transform='translateY(0)';
    }
    obs.unobserve(el);
  });
},{threshold:.07});

document.querySelectorAll('.prog-card').forEach(c=>obs.observe(c));
document.querySelectorAll('[data-reveal]').forEach(el=>{
  el.style.opacity='0'; el.style.transform='translateY(30px)';
  obs.observe(el);
});

/* ── COUNTER ANIMATION ───────────────────── */
function animCount(el, target){
  const dur=1800, start=performance.now();
  const suffix = el.dataset.suffix || '';
  function tick(now){
    const t=Math.min((now-start)/dur,1);
    const ease=1-Math.pow(1-t,4);
    const val=Math.round(ease*target);
    if(target>=100) el.textContent=val+'%';
    else if(target>=100) el.textContent=val+'%';
    else el.textContent=val+(target>=100?'%':'+');
    if(t<1) requestAnimationFrame(tick);
    else {
      if(target===95) el.textContent='95%';
      else el.textContent=val+'+';
    }
  }
  requestAnimationFrame(tick);
}
const cObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target;
      animCount(el,parseInt(el.dataset.count));
      cObs.unobserve(el);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cObs.observe(el));

/* ── 3D TILT ─────────────────────────────── */
document.querySelectorAll('.prog-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
    const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
    card.style.transform=`translateY(-12px) rotateX(${-dy*4}deg) rotateY(${dx*4}deg)`;
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
});
})();