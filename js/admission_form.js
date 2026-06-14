(function(){
/* ── PARTICLES ────────────────────────── */
(function(){
  const c = document.getElementById('pCanvas_adm_form');
  const ctx = c.getContext('2d');
  function resize(){ const s=document.getElementById('apply'); c.width=s.offsetWidth; c.height=s.offsetHeight; }
  let pts=[];
  function mk(){ return{x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.5+.3,vx:(Math.random()-.5)*.25,vy:-Math.random()*.45-.06,a:Math.random()*.28+.07,life:0,max:Math.random()*280+160}; }
  for(let i=0;i<65;i++) pts.push(mk());
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach((p,i)=>{
      p.x+=p.vx; p.y+=p.vy; p.life++;
      if(p.life>p.max||p.y<0) pts[i]=mk();
      const fi=Math.min(p.life/60,1),fo=Math.min((p.max-p.life)/60,1);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(57,255,20,${p.a*fi*fo})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize); resize(); draw();
})();

/* ── SCROLL REVEAL ────────────────────── */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.style.transition='opacity .9s ease, transform .9s ease';
    e.target.style.opacity='1'; e.target.style.transform='translateY(0)';
    obs.unobserve(e.target);
  });
},{threshold:.07});

document.querySelectorAll('[data-reveal]').forEach(el=>{ el.style.opacity='0'; el.style.transform='translateY(30px)'; obs.observe(el); });

const sw = document.getElementById('splitWrap');
const swObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('revealed'); swObs.unobserve(e.target); } });
},{threshold:.05});
swObs.observe(sw);

/* ── FILE INPUT ───────────────────────── */
document.getElementById('fileInput').addEventListener('change',function(){
  const fn = document.getElementById('fileName');
  if(this.files.length>0){
    fn.textContent = Array.from(this.files).map(f=>f.name).join(', ');
  } else { fn.textContent=''; }
});

/* ── FORM VALIDATION ──────────────────── */
function setErr(id,show){
  const el=document.getElementById(id);
  const group=el.closest('.field-group');
  if(show){ el.classList.add('error'); group.classList.add('has-error'); }
  else    { el.classList.remove('error'); group.classList.remove('has-error'); }
}

function validate(){
  let ok=true;

  // Student name
  const sn=document.getElementById('studentName');
  if(!sn.value.trim()){ setErr('studentName',true); ok=false; } else setErr('studentName',false);

  // Parent name
  const pn=document.getElementById('parentName');
  if(!pn.value.trim()){ setErr('parentName',true); ok=false; } else setErr('parentName',false);

  // Email
  const em=document.getElementById('email');
  const emailRx=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRx.test(em.value.trim())){ setErr('email',true); ok=false; } else setErr('email',false);

  // Phone
  const ph=document.getElementById('phone');
  const phClean=ph.value.replace(/\D/g,'');
  if(phClean.length<10){ setErr('phone',true); ok=false; } else setErr('phone',false);

  // Age
  const ag=document.getElementById('age');
  const agV=parseInt(ag.value);
  if(!agV||agV<5||agV>40){ setErr('age',true); ok=false; } else setErr('age',false);

  // Gender
  const gChecked=document.querySelector('input[name="gender"]:checked');
  const gErrMsg=document.getElementById('genderErr');
  if(!gChecked){ gErrMsg.style.display='block'; ok=false; } else gErrMsg.style.display='none';

  // Sport
  const sp=document.getElementById('sport');
  if(!sp.value){ setErr('sport',true); ok=false; } else setErr('sport',false);

  // Program
  const pr=document.getElementById('program');
  if(!pr.value){ setErr('program',true); ok=false; } else setErr('program',false);

  // Address
  const ad=document.getElementById('address');
  if(!ad.value.trim()){ setErr('address',true); ok=false; } else setErr('address',false);

  return ok;
}

/* Live validation on blur */
['studentName','parentName','email','phone','age','sport','program','address'].forEach(id=>{
  document.getElementById(id).addEventListener('blur',()=>validate());
});

/* ── FORM SUBMIT ──────────────────────── */
document.getElementById('admissionForm').addEventListener('submit',function(e){
  e.preventDefault();
  if(!validate()) return;

  // Loading state
  const btn=document.getElementById('submitBtn');
  const txt=btn.querySelector('.btn-text');
  const ldr=document.getElementById('loader');
  const arr=document.getElementById('btnArrow');
  txt.textContent='Submitting...';
  ldr.style.display='block';
  arr.style.display='none';
  btn.style.pointerEvents='none';

  // Simulate API call
  setTimeout(()=>{
    // Reset btn
    txt.textContent='Submit Application';
    ldr.style.display='none';
    arr.style.display='';
    btn.style.pointerEvents='';
    // Show success
    document.getElementById('successOverlay').classList.add('show');
    // Reset form
    document.getElementById('admissionForm').reset();
    document.getElementById('fileName').textContent='';
  },1800);
});

/* ── SUCCESS CLOSE ────────────────────── */
document.getElementById('successClose').addEventListener('click',()=>{
  document.getElementById('successOverlay').classList.remove('show');
});
document.getElementById('successOverlay').addEventListener('click',function(e){
  if(e.target===this) this.classList.remove('show');
});

/* ── TILT ON FORM PANEL ───────────────── */
const fp=document.querySelector('.form-panel');
fp.addEventListener('mousemove',e=>{
  const r=fp.getBoundingClientRect();
  const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
  const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
  fp.style.transform=`perspective(1200px) rotateX(${-dy*1.5}deg) rotateY(${dx*1.5}deg)`;
});
fp.addEventListener('mouseleave',()=>{ fp.style.transform=''; });
})();