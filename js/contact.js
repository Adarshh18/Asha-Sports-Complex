(function(){
/* ─── Particles ─── */
    (function(){
      const c=document.getElementById('cParticles');
      const n=window.innerWidth<600?14:26;
      for(let i=0;i<n;i++){
        const p=document.createElement('div');
        p.className='c-particle';
        p.style.cssText=`left:${Math.random()*100}%;--sz:${Math.random()*2.5+1}px;--dur:${Math.random()*12+8}s;--dl:${Math.random()*14}s;--dx:${(Math.random()-.5)*80}px;`;
        c.appendChild(p);
      }
    })();

    /* ─── Scroll reveal ─── */
    const revObs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');revObs.unobserve(e.target);}});
    },{threshold:0.08});

    ['cHeader','cLeft','cRight'].forEach(id=>{
      const el=document.getElementById(id); if(el) revObs.observe(el);
    });
    document.querySelectorAll('.sr').forEach(el=>revObs.observe(el));

    /* ─── Counter animation ─── */
    let done=false;
    function runCounters(){
      if(done)return; done=true;
      document.querySelectorAll('[data-target]').forEach(el=>{
        const target=parseFloat(el.dataset.target);
        const suffix=el.dataset.suffix||'';
        const dur=1600; const start=performance.now();
        const tick=(now)=>{
          const t=Math.min((now-start)/dur,1);
          const e=1-Math.pow(1-t,3);
          el.textContent=(Number.isInteger(target)?Math.round(e*target):(e*target).toFixed(1))+suffix;
          if(t<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
    const mapStats=document.querySelector('.map-stats');
    if(mapStats){
      new IntersectionObserver((entries)=>{
        if(entries[0].isIntersecting) runCounters();
      },{threshold:.3}).observe(mapStats);
    }

    /* ─── Contact card tilt (desktop) ─── */
    if(window.matchMedia('(pointer:fine)').matches){
      document.querySelectorAll('.contact-card').forEach(card=>{
        card.addEventListener('mousemove',e=>{
          const r=card.getBoundingClientRect();
          const ry=((e.clientX-r.left-r.width/2)/(r.width/2))*3;
          const rx=((e.clientY-r.top-r.height/2)/(r.height/2))*-2;
          card.style.transform=`translateX(8px) translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        card.addEventListener('mouseleave',()=>{
          card.style.transform='';
        });
      });
    }
})();