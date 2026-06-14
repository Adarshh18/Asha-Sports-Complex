(function(){
/* ─── Particles ─── */
    (function(){
      const c=document.getElementById('fParticles');
      const n=window.innerWidth<600?12:22;
      for(let i=0;i<n;i++){
        const p=document.createElement('div');
        p.className='f-particle';
        p.style.cssText=`left:${Math.random()*100}%;--sz:${Math.random()*2.5+1}px;--dur:${Math.random()*14+8}s;--dl:${Math.random()*16}s;--dx:${(Math.random()-.5)*70}px;`;
        c.appendChild(p);
      }
    })();

    /* ─── Scroll reveal ─── */
    const revObs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');revObs.unobserve(e.target);}});
    },{threshold:0.07});
    document.querySelectorAll('.sr').forEach(el=>revObs.observe(el));

    /* ─── Animated counters ─── */
    let cDone=false;
    function runCounters(){
      if(cDone)return; cDone=true;
      document.querySelectorAll('.counter[data-target]').forEach(el=>{
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
    const achWrap=document.querySelector('.f-achievements');
    if(achWrap){
      new IntersectionObserver((entries)=>{if(entries[0].isIntersecting) runCounters();},{threshold:.3}).observe(achWrap);
    }

    /* ─── Newsletter form ─── */
    document.getElementById('nlForm').addEventListener('submit',function(){
      const email=document.getElementById('nlEmail').value.trim();
      if(!email||!email.includes('@')) return;
      document.getElementById('nlForm').style.display='none';
      document.getElementById('nlSuccess').classList.add('show');
    });

    /* ─── Back to top smooth ─── */
    document.getElementById('backTop').addEventListener('click',function(e){
      e.preventDefault();
      window.scrollTo({top:0,behavior:'smooth'});
    });

    /* ─── Newsletter input focus glow ─── */
    const nlInput=document.getElementById('nlEmail');
    if(nlInput){
      nlInput.addEventListener('focus',function(){
        this.parentElement.style.setProperty('--focus','1');
      });
      nlInput.addEventListener('blur',function(){
        this.parentElement.style.setProperty('--focus','0');
      });
    }

    /* ─── Hover tilt on contact items (desktop) ─── */
    if(window.matchMedia('(pointer:fine)').matches){
      document.querySelectorAll('.f-contact-item').forEach(item=>{
        item.addEventListener('mousemove',e=>{
          const r=item.getBoundingClientRect();
          const ry=((e.clientX-r.left-r.width/2)/(r.width/2))*2;
          item.querySelector('.fci-icon').style.transform=`scale(1.1) rotate(${ry*2}deg)`;
        });
        item.addEventListener('mouseleave',()=>{
          item.querySelector('.fci-icon').style.transform='';
        });
      });
    }
})();