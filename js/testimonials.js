(function(){
/* ─── Particles ─── */
    (function(){
      const c = document.getElementById('tParticles');
      const n = window.innerWidth < 600 ? 14 : 26;
      for(let i=0;i<n;i++){
        const p = document.createElement('div');
        p.className='t-particle';
        p.style.cssText=`left:${Math.random()*100}%;--sz:${Math.random()*2.5+1}px;--dur:${Math.random()*12+8}s;--dl:${Math.random()*14}s;--dx:${(Math.random()-.5)*80}px;`;
        c.appendChild(p);
      }
    })();

    /* ─── Scroll reveal ─── */
    const revObs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');revObs.unobserve(e.target);}});
    },{threshold:0.08});
    ['tHeader','tStats','sliderWrap','tBadges'].forEach(id=>{
      const el=document.getElementById(id); if(el) revObs.observe(el);
    });

    /* ─── Animated counters ─── */
    let countersDone=false;
    function runCounters(){
      if(countersDone)return; countersDone=true;
      document.querySelectorAll('.counter[data-target]').forEach(el=>{
        const target=parseFloat(el.dataset.target);
        const suffix=el.dataset.suffix||'';
        const dur=1600; const start=performance.now();
        const tick=(now)=>{
          const t=Math.min((now-start)/dur,1);
          const e=1-Math.pow(1-t,3);
          el.textContent=Number.isInteger(target)?Math.round(e*target)+suffix:(e*target).toFixed(1)+suffix;
          if(t<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
    const statsEl=document.getElementById('tStats');
    if(statsEl){
      new IntersectionObserver((entries)=>{
        if(entries[0].isIntersecting) runCounters();
      },{threshold:.3}).observe(statsEl);
    }

    /* ─── SLIDER ─── */
    const track      = document.getElementById('sliderTrack');
    const overflow   = document.getElementById('sliderOverflow');
    const prevBtn    = document.getElementById('prevBtn');
    const nextBtn    = document.getElementById('nextBtn');
    const dotsWrap   = document.getElementById('sliderDots');
    const cards      = track.querySelectorAll('.t-card');

    const VISIBLE    = () => window.innerWidth >= 1100 ? 3 : window.innerWidth >= 700 ? 2 : 1;
    const CARD_GAP   = 24;
    let current      = 0;
    let autoplayTimer= null;
    let isDragging   = false;
    let dragStartX   = 0;
    let dragCurrentX = 0;

    /* Build dots */
    function buildDots(){
      dotsWrap.innerHTML='';
      const total = Math.ceil(cards.length / VISIBLE());
      for(let i=0;i<total;i++){
        const d=document.createElement('button');
        d.className='s-dot'+(i===current?' active':'');
        d.setAttribute('aria-label',`Go to slide ${i+1}`);
        d.setAttribute('role','tab');
        d.addEventListener('click',()=>goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    /* Update dots */
    function updateDots(){
      const dots=dotsWrap.querySelectorAll('.s-dot');
      dots.forEach((d,i)=>d.classList.toggle('active',i===current));
    }

    /* Get card width */
    function cardWidth(){
      return cards[0].getBoundingClientRect().width + CARD_GAP;
    }

    /* Go to index */
    function goTo(idx,animate=true){
      const maxIdx = Math.ceil(cards.length / VISIBLE()) - 1;
      current = Math.max(0, Math.min(idx, maxIdx));
      if(!animate) track.style.transition='none';
      else track.style.transition='transform .55s var(--ease)';
      track.style.transform=`translateX(-${current * VISIBLE() * cardWidth()}px)`;
      updateDots();
    }

    /* Autoplay */
    function startAutoplay(){
      stopAutoplay();
      autoplayTimer=setInterval(()=>{
        const maxIdx=Math.ceil(cards.length/VISIBLE())-1;
        goTo(current>=maxIdx?0:current+1);
      },4500);
    }
    function stopAutoplay(){ clearInterval(autoplayTimer); }

    prevBtn.addEventListener('click',()=>{ stopAutoplay(); goTo(current-1); startAutoplay(); });
    nextBtn.addEventListener('click',()=>{ stopAutoplay(); goTo(current+1); startAutoplay(); });

    /* ── Touch / Drag swipe ── */
    function onDragStart(clientX){
      isDragging=true; dragStartX=clientX; dragCurrentX=clientX;
      track.style.transition='none';
      stopAutoplay();
    }
    function onDragMove(clientX){
      if(!isDragging) return;
      dragCurrentX=clientX;
      const delta=dragCurrentX-dragStartX;
      track.style.transform=`translateX(calc(-${current * VISIBLE() * cardWidth()}px + ${delta}px))`;
    }
    function onDragEnd(){
      if(!isDragging) return;
      isDragging=false;
      const delta=dragCurrentX-dragStartX;
      if(Math.abs(delta)>60){
        if(delta<0) goTo(current+1); else goTo(current-1);
      } else { goTo(current); }
      startAutoplay();
    }

    /* Mouse */
    overflow.addEventListener('mousedown',  e=>onDragStart(e.clientX));
    window.addEventListener  ('mousemove',  e=>isDragging&&onDragMove(e.clientX));
    window.addEventListener  ('mouseup',    ()=>onDragEnd());

    /* Touch */
    overflow.addEventListener('touchstart', e=>onDragStart(e.touches[0].clientX),{passive:true});
    overflow.addEventListener('touchmove',  e=>onDragMove(e.touches[0].clientX),{passive:true});
    overflow.addEventListener('touchend',   ()=>onDragEnd());

    /* Pause on hover */
    overflow.addEventListener('mouseenter',()=>stopAutoplay());
    overflow.addEventListener('mouseleave',()=>startAutoplay());

    /* Init */
    buildDots();
    startAutoplay();
    window.addEventListener('resize',()=>{ buildDots(); goTo(0,false); requestAnimationFrame(()=>track.style.transition=''); });

    /* ─── 3D tilt (desktop) ─── */
    if(window.matchMedia('(pointer:fine)').matches){
      cards.forEach(card=>{
        card.addEventListener('mouseenter',()=>card.style.transition='transform .1s linear, box-shadow .4s, border-color .4s');
        card.addEventListener('mousemove',e=>{
          const r=card.getBoundingClientRect();
          const rx=((e.clientY-r.top-r.height/2)/(r.height/2))*-5;
          const ry=((e.clientX-r.left-r.width/2)/(r.width/2))*5;
          card.style.transform=`translateY(-10px) scale(1.015) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        card.addEventListener('mouseleave',()=>{
          card.style.transition='transform .5s var(--ease), box-shadow .4s, border-color .4s';
          card.style.transform='';
        });
      });
    }
})();