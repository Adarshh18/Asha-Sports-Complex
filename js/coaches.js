(function(){
/* ── PARTICLES ─────────────────── */
(function(){
  const canvas = document.getElementById('pCanvas_coaches');
  const ctx = canvas.getContext('2d');
  let pts = [];
  function resize(){
    const s = document.getElementById('coaches');
    canvas.width = s.offsetWidth;
    canvas.height = s.offsetHeight;
  }
  function mkP(){
    return{
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*1.4+0.3,
      vx:(Math.random()-.5)*.25,
      vy:-Math.random()*.45-.05,
      a:Math.random()*.35+.1,
      life:0,max:Math.random()*280+180
    };
  }
  for(let i=0;i<65;i++) pts.push(mkP());
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pts.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;p.life++;
      if(p.life>p.max||p.y<0) pts[i]=mkP();
      const fi=Math.min(p.life/60,1);
      const fo=Math.min((p.max-p.life)/60,1);
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(57,255,20,${p.a*fi*fo})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize(); draw();
})();

/* ── SCROLL REVEAL ─────────────── */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target;
    if(el.classList.contains('coach-card')){
      const i = parseInt(el.dataset.idx||0);
      setTimeout(()=>{ el.classList.add('revealed'); }, i*100);
    } else {
      el.style.transition='opacity .8s ease,transform .8s ease';
      el.style.opacity='1'; el.style.transform='translateY(0)';
    }
    obs.unobserve(el);
  });
},{threshold:.08});

document.querySelectorAll('.coach-card').forEach(c=>obs.observe(c));
document.querySelectorAll('[data-reveal]').forEach(el=>{
  el.style.opacity='0'; el.style.transform='translateY(28px)';
  obs.observe(el);
});

/* ── 3D TILT ───────────────────── */
document.querySelectorAll('.coach-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
    const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
    card.style.transform=`translateY(-12px) rotateX(${-dy*5}deg) rotateY(${dx*5}deg)`;
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
});
})();