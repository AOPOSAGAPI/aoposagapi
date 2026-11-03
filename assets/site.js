function toggleMobile(){ document.getElementById('mobileMenu').classList.toggle('open'); }
function showIntro(){
  document.getElementById('introOverlay').classList.add('active');
  startCanvasAnimation();
  startHeartsRain();
  startTypewriter(document.documentElement.lang==='en' ? 'Give love, take light ✨' : 'Δώσε αγάπη, πάρε φως ✨');
  const audio = document.getElementById('introAudio');
  if(audio){ audio.currentTime=0; audio.volume=0.7; audio.play().catch(()=>{}); }
}
function hideIntro(){
  document.getElementById('introOverlay').classList.remove('active');
  const audio = document.getElementById('introAudio');
  if(audio){ audio.pause(); audio.currentTime=0; }
  stopCanvas = true;
  const heartsBox = document.getElementById('introHearts');
  if(heartsBox) heartsBox.innerHTML='';
}
let stopCanvas = false;
let typewriterTimer = null;
function startTypewriter(text){
  const el = document.getElementById('introTypewriter');
  if(!el) return;
  el.textContent='';
  if(typewriterTimer) clearInterval(typewriterTimer);
  let i = 0;
  setTimeout(()=>{
    typewriterTimer = setInterval(()=>{
      if(i < text.length){
        el.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typewriterTimer);
      }
    }, 90);
  }, 2400);
}
function startHeartsRain(){
  const box = document.getElementById('introHearts');
  if(!box) return;
  box.innerHTML='';
  const hearts = ['❤️','🧡','💛','💖','💗'];
  for(let i=0; i<22; i++){
    const h = document.createElement('span');
    h.className = 'heart-fall';
    h.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    h.style.left = (Math.random()*100)+'%';
    h.style.animationDuration = (5+Math.random()*5)+'s';
    h.style.animationDelay = (Math.random()*8)+'s';
    h.style.fontSize = (1.2+Math.random()*1.4)+'rem';
    box.appendChild(h);
  }
}
function startCanvasAnimation(){
  stopCanvas = false;
  const canvas = document.getElementById('introCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const particles = Array.from({length:140},()=>({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    r:Math.random()*2.5+0.5, dx:(Math.random()-0.5)*0.6, dy:(Math.random()-0.5)*0.6,
    color:Math.random()>0.5?'rgba(232,119,34,':'rgba(255,255,255,',
    twinkle:Math.random()*Math.PI*2
  }));
  function draw(){
    if(stopCanvas) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.twinkle+=0.05;
      const alpha = 0.3 + Math.abs(Math.sin(p.twinkle))*0.5;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color+alpha+')'; ctx.fill();
      p.x+=p.dx; p.y+=p.dy;
      if(p.x<0||p.x>canvas.width) p.dx*=-1;
      if(p.y<0||p.y>canvas.height) p.dy*=-1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}
function copyText(text,btn){
  navigator.clipboard.writeText(text).then(()=>{
    const orig=btn.textContent; btn.textContent='✓ Αντιγράφηκε'; btn.style.background='#2ecc71';
    setTimeout(()=>{ btn.textContent=orig; btn.style.background=''; },2000);
  });
}
document.querySelectorAll('.modal-overlay').forEach(el=>{
  el.addEventListener('click',e=>{ if(e.target===el) el.classList.remove('active'); });
});
(function(){var e=document.getElementById('emailDisplay'); if(e) e.innerHTML='<a href="mailto:info&#64;aoposagapi.org" style="color:inherit">info&#64;aoposagapi.org</a>';})();

// ---- contact form (Formspree) ----
(function(){
  var f = document.getElementById('contactForm'); if(!f) return;
  var st = document.getElementById('contactStatus');
  var L = document.documentElement.lang === 'en'
    ? {sending:'Sending…', ok:'Thank you! Your message was sent — we will reply soon.', err:'Something went wrong. Please email us at info@aoposagapi.org.', req:'Please fill in your name, email and message.'}
    : {sending:'Αποστολή…', ok:'Ευχαριστούμε! Το μήνυμά σας στάλθηκε — θα σας απαντήσουμε σύντομα.', err:'Κάτι πήγε στραβά. Στείλτε μας email στο info@aoposagapi.org.', req:'Συμπληρώστε όνομα, email και μήνυμα.'};
  f.addEventListener('submit', function(e){
    e.preventDefault();
    if(!f.checkValidity()){ st.className='form-status err'; st.textContent=L.req; return; }
    var btn = f.querySelector('button[type=submit]'), orig = btn.textContent;
    btn.disabled = true; btn.textContent = L.sending;
    fetch(f.action, {method:'POST', body:new FormData(f), headers:{'Accept':'application/json'}})
      .then(function(r){ if(!r.ok) throw 0; f.reset(); st.className='form-status ok'; st.textContent=L.ok; })
      .catch(function(){ st.className='form-status err'; st.textContent=L.err; })
      .finally(function(){ btn.disabled=false; btn.textContent=orig; });
  });
})();
