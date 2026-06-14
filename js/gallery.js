(function(){
/* ── PARTICLES ──────────────────────── */
(function(){
  const c=document.getElementById('pCanvas_gallery');
  const ctx=c.getContext('2d');
  function resize(){const s=document.getElementById('gallery');c.width=s.offsetWidth;c.height=s.offsetHeight}
  let pts=[];
  function mk(){return{x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.5+.3,vx:(Math.random()-.5)*.25,vy:-Math.random()*.45-.06,a:Math.random()*.28+.07,life:0,max:Math.random()*280+160}}
  for(let i=0;i<65;i++) pts.push(mk());
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;p.life++;if(p.life>p.max||p.y<0)pts[i]=mk();const fi=Math.min(p.life/60,1),fo=Math.min((p.max-p.life)/60,1);ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(57,255,20,${p.a*fi*fo})`;ctx.fill()});
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);resize();draw();
})();

/* ── SCROLL REVEAL ─────────────────── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target;
    if(el.classList.contains('gallery-item')){
      const idx=parseInt(el.dataset.revIdx||0);
      setTimeout(()=>el.classList.add('revealed'),idx*70);
    } else {
      el.classList.add('revealed');
    }
    obs.unobserve(el);
  });
},{threshold:.06});

document.querySelectorAll('.gallery-item').forEach((el,i)=>{el.dataset.revIdx=i;obs.observe(el)});
['secHeader','filterWrap','galleryFooter'].forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el)});

/* ── TILT ON HOVER ─────────────────── */
document.querySelectorAll('.gallery-item').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
    const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
    card.style.transform=`scale(1.02) rotateX(${-dy*4}deg) rotateY(${dx*4}deg)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform=''});
});

/* ── FILTER ────────────────────────── */
const filterBtns=document.querySelectorAll('.filter-btn');
const items=[...document.querySelectorAll('.gallery-item')];

filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    items.forEach((item,i)=>{
      const cat=item.dataset.cat;
      const show=(f==='all'||cat===f);
      if(show){
        item.classList.remove('hidden');
        setTimeout(()=>{item.classList.add('revealed')},i*40);
      } else {
        item.classList.add('hidden');
        item.classList.remove('revealed');
      }
    });
  });
});

/* ── LIGHTBOX ──────────────────────── */
const lb=document.getElementById('lightbox');
const lbVisual=document.getElementById('lbVisual');
const lbCat=document.getElementById('lbCat');
const lbTitle=document.getElementById('lbTitle');
const lbSub=document.getElementById('lbSub');
const lbCurrent=document.getElementById('lbCurrent');
const lbTotal=document.getElementById('lbTotal');

let activeItems=[],lbIdx=0;

function openLB(item){
  activeItems=items.filter(i=>!i.classList.contains('hidden'));
  lbIdx=activeItems.indexOf(item);
  lbTotal.textContent=activeItems.length;
  showLB(lbIdx);
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}

function showLB(idx){
  if(idx<0) idx=activeItems.length-1;
  if(idx>=activeItems.length) idx=0;
  lbIdx=idx;
  const item=activeItems[idx];
  // clone visual
  const scene=item.querySelector('.sport-scene');
  lbVisual.innerHTML='';
  if(scene){
    const cl=scene.cloneNode(true);
    cl.className=scene.className+' lb-scene';
    lbVisual.appendChild(cl);
  }
  lbCat.textContent=item.dataset.cat||'';
  lbTitle.textContent=item.dataset.title||'';
  lbSub.textContent=item.dataset.sub||'';
  lbCurrent.textContent=idx+1;
}

function closeLB(){
  lb.classList.remove('open');
  document.body.style.overflow='';
}

items.forEach(item=>{
  item.addEventListener('click',()=>openLB(item));
  item.querySelector('.gi-expand').addEventListener('click',e=>{e.stopPropagation();openLB(item)});
});

document.getElementById('lbClose').addEventListener('click',closeLB);
lb.addEventListener('click',e=>{if(e.target===lb)closeLB()});
document.getElementById('lbPrev').addEventListener('click',()=>showLB(lbIdx-1));
document.getElementById('lbNext').addEventListener('click',()=>showLB(lbIdx+1));

// keyboard nav
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('open')) return;
  if(e.key==='ArrowRight') showLB(lbIdx+1);
  if(e.key==='ArrowLeft')  showLB(lbIdx-1);
  if(e.key==='Escape')     closeLB();
});

/* ── LOAD MORE (flash reveal) ───────── */
document.getElementById('loadMoreBtn').addEventListener('click',function(){
  this.textContent='All photos loaded! ✦';
  this.style.color='var(--accent)';
  this.style.borderColor='var(--accent)';
  this.style.boxShadow='0 0 20px rgba(57,255,20,.3)';
  this.style.pointerEvents='none';
});
})();