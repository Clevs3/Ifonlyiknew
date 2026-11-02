/* If Only I Knew: app logic. Card content lives in decks.js. */
const ORDER = PATHS.flatMap(p=>p.ids);

/* ---------- saved progress (this browser only) ---------- */
const KEY='hindsight-v1';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
const P=Object.assign({done:{},xp:0,streak:0,last:null},load());
const dayStr=d=>d.toISOString().slice(0,10);
function localDay(offset=0){const d=new Date();d.setDate(d.getDate()+offset);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)}
function currentStreak(){ if(!P.last) return 0; if(P.last===localDay(0)||P.last===localDay(-1)) return P.streak; return 0; }

/* ---------- narration ---------- */
const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let voice=null;
function pickVoice(){ try{ const vs=speechSynthesis.getVoices(); voice = vs.find(v=>/en-GB/i.test(v.lang)&&/female|google|natural|daniel|serena|libby|sonia/i.test(v.name)) || vs.find(v=>/en-GB/i.test(v.lang)) || vs.find(v=>/^en/i.test(v.lang)) || null; }catch(e){} }
if(canSpeak){ pickVoice(); try{ speechSynthesis.onvoiceschanged=pickVoice; }catch(e){} }
function stopSpeech(){ if(canSpeak){ try{speechSynthesis.cancel()}catch(e){} } }
function speak(text,onend){
  if(!canSpeak) return;
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); if(voice) u.voice=voice; u.lang='en-GB'; u.rate=.97; u.onend=onend; speechSynthesis.speak(u);}catch(e){}
}

/* ---------- state + rendering ---------- */
let S={view:'home', id:null, step:0, qi:0, picked:null, score:0, listening:false};
const app=document.getElementById('app');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- family scoreboard and requests (Firebase) ---------- */
const FIREBASE_CONFIG={
  apiKey:"AIzaSyCgQYa4-Pdns68RJEufflgSr4G81FExk_0",
  authDomain:"ifonlyiknew.firebaseapp.com",
  projectId:"ifonlyiknew",
  storageBucket:"ifonlyiknew.firebasestorage.app",
  messagingSenderId:"680893194650",
  appId:"1:680893194650:web:349b9f75797926591eda23"
};
const FB_VERSION='10.12.2';
const PROFILE_KEY='ioik-profile';
function loadProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY))}catch(e){return null}}
function saveProfile(p){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p))}catch(e){}}
const cleanCode=c=>String(c||'').trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,40);
let PROFILE=loadProfile();
const SH={state:'loading', me:null, board:{}, reqs:[], fs:null, db:null, writing:Promise.resolve()};
const BRAND_HTML=`<span class="sc eyebrow">A deck of history</span>
      <div class="brand">
        <svg class="mark" viewBox="0 0 48 60" aria-hidden="true">
          <rect class="m-back" x="9" y="6" width="30" height="44" rx="4" transform="rotate(-12 24 30)"/>
          <g transform="rotate(7 24 30)">
            <rect class="m-front" x="9" y="8" width="30" height="44" rx="4"/>
            <path class="m-line" d="M18 19h12l-6 9.5 6 9.5H18l6-9.5z"/>
            <path class="m-fill" d="M20.6 36.2h6.8L24 31.8z"/>
            <path class="m-fill" d="M21.5 21.2h5L24 24.6z"/>
            <circle class="m-fill" cx="13.5" cy="12.5" r="1.4"/><circle class="m-fill" cx="34.5" cy="47.5" r="1.4"/>
          </g>
        </svg>
        <h1>If only <span>I knew</span></h1>
      </div>`;

function streakOf(d){ if(!d||!d.last) return 0; return (d.last===localDay(0)||d.last===localDay(-1)) ? (d.streak||0) : 0; }
function nameFor(uid){ const d=SH.board[uid]; return (d&&d.name) || (uid===SH.me?'You':'Someone'); }
function initialAv(uid){
  const n=nameFor(uid), h=hashStr(uid)%360;
  return `<span class="av" style="background:hsl(${h} 45% 40%)">${esc(n.charAt(0).toUpperCase())}</span>`;
}
function boardHTML(){
  if(PROFILE&&PROFILE.solo) return '<p class="note">You are playing solo. <button class="textbtn" data-act="rejoin">Join a family scoreboard</button></p>';
  if(SH.state==='loading') return '<p class="note">Connecting to the scoreboard…</p>';
  if(SH.state==='error') return '<p class="note">The scoreboard can’t be reached right now. Your progress is still saved on this device and will sync next time.</p>';
  const ids=Object.keys(SH.board).filter(id=>SH.board[id]&&SH.board[id].name);
  if(!ids.length) return '<p class="note">Nobody has collected a card yet. Be the first.</p>';
  ids.sort((a,b)=>(SH.board[b].xp||0)-(SH.board[a].xp||0));
  return ids.map((id,i)=>{const d=SH.board[id]; const n=Object.keys(d.done||{}).filter(k=>STORIES[k]).length;
    return `<div class="prow"><span class="rank">${i+1}</span>${initialAv(id)}<span><span class="pn">${esc(nameFor(id))}${id===SH.me?' (you)':''}</span><br><span class="ps">${n} of ${ORDER.length} cards · ${streakOf(d)}-day streak</span></span><span class="px">${d.xp||0} XP</span></div>`}).join('');
}
function reqsHTML(){
  if(PROFILE&&PROFILE.solo) return '';
  if(SH.state!=='on'||!SH.reqs.length) return '';
  return '<p class="sc" style="margin:14px 0 0">Requested so far</p>'+SH.reqs.slice(0,12).map(r=>`<div class="rq"><span class="tx">${esc(r.text)}</span><span class="by">${esc(nameFor(r.uid))} · ${esc(String(r.at).slice(0,10))}</span></div>`).join('');
}
function refreshShared(){
  if(S.view!=='home') return;
  const b=document.getElementById('board'); if(b) b.innerHTML=boardHTML();
  const r=document.getElementById('rqs'); if(r) r.innerHTML=reqsHTML();
}
function fillNames(){}
function queueWrite(fn){
  SH.writing=SH.writing.then(fn).catch(e=>{ console.warn('Scoreboard write failed',e); });
  return SH.writing;
}
function pushProgress(){
  if(SH.state!=='on'||!SH.me||!PROFILE||PROFILE.solo) return Promise.resolve();
  const fs=SH.fs;
  const body={name:PROFILE.name, done:Object.assign({},P.done), xp:P.xp||0, streak:P.streak||0, last:P.last||null, updated:new Date().toISOString()};
  return queueWrite(()=>fs.setDoc(fs.doc(SH.db,'families',PROFILE.code,'players',SH.me),body));
}
async function initShared(){
  if(!PROFILE||PROFILE.solo){ SH.state='off'; refreshShared(); return; }
  const timer=setTimeout(()=>{ if(SH.state==='loading'){ SH.state='error'; refreshShared(); } },15000);
  try{
    const base=`https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
    const [appMod,authMod,fs]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
    const fbApp=appMod.initializeApp(FIREBASE_CONFIG);
    const auth=authMod.getAuth(fbApp);
    await auth.authStateReady();
    const user=auth.currentUser || (await authMod.signInAnonymously(auth)).user;
    const db=fs.getFirestore(fbApp);
    SH.fs=fs; SH.db=db; SH.me=user.uid;
    const myRef=fs.doc(db,'families',PROFILE.code,'players',user.uid);
    const snap=await fs.getDoc(myRef);
    if(snap.exists()){
      const remote=snap.data();
      P.done=Object.assign({},remote.done||{},P.done);
      P.xp=Math.max(P.xp||0,remote.xp||0);
      if((remote.last||'')>(P.last||'')){P.last=remote.last;P.streak=remote.streak||0;}
      else if(remote.last===P.last){P.streak=Math.max(P.streak||0,remote.streak||0);}
      save();
    }
    SH.state='on'; clearTimeout(timer);
    pushProgress();
    fs.onSnapshot(fs.collection(db,'families',PROFILE.code,'players'),qs=>{
      const b={}; qs.forEach(d=>{ b[d.id]=d.data(); }); SH.board=b; refreshShared();
    },()=>{ SH.state='error'; refreshShared(); });
    fs.onSnapshot(fs.query(fs.collection(db,'families',PROFILE.code,'requests'),fs.orderBy('at','desc'),fs.limit(30)),qs=>{
      SH.reqs=qs.docs.map(d=>d.data()); refreshShared();
    },()=>{});
    if(S.view==='home') render();
  }catch(e){ console.warn('Scoreboard unavailable',e); clearTimeout(timer); SH.state='error'; refreshShared(); }
}

function renderJoin(){
  const p=PROFILE&&!PROFILE.solo?PROFILE:{};
  app.innerHTML=`<div class="wrap">
    <header class="mast">${BRAND_HTML}
      <p>One card from history, five minutes a day.</p>
    </header>
    <section class="path">
      <div class="path-head"><h3>Join your family</h3></div>
      <p class="note" style="padding:0">Enter your first name and the family code you were sent. Your scores then appear on the family scoreboard.</p>
      <form class="form" id="joinform">
        <label class="sc" for="jname">Your first name</label>
        <input id="jname" class="field" maxlength="30" autocomplete="given-name" value="${esc(p.name||'')}">
        <label class="sc" for="jcode">Family code</label>
        <input id="jcode" class="field" maxlength="40" autocapitalize="none" autocomplete="off" spellcheck="false" value="${esc(p.code||'')}">
        <p class="note" id="jmsg" style="padding:0"></p>
        <button class="cta" type="submit" style="align-self:flex-start">Start playing</button>
      </form>
    </section>
    <button class="textbtn" data-act="solo">Just play on my own</button>
    <p class="foot">Only your first name and your scores are shared, and only with people who have your family code.</p>
  </div>`;
}

/* ---------- generated deck artwork (canvas) ---------- */
const PLANE_PATH="M21 12c0-.8-.7-1.5-1.5-1.5H14L9.5 3H7.5l2.5 7.5H5L3 8H1.5l1 4-1 4H3l2-2.5h5L7.5 21h2l4.5-7.5h5.5c.8 0 1.5-.7 1.5-1.5z";
function hashStr(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const ART={
  /* Into Space: nebulae, a sun, orbits and planets */
  space(c,w,h,r){
    const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#060818'); g.addColorStop(1,'#17102f'); c.fillStyle=g; c.fillRect(0,0,w,h);
    const neb=['120,60,200','40,140,210','200,70,140','60,180,170'];
    for(let i=0;i<4;i++){const x=r()*w,y=r()*h,rad=(0.35+r()*0.5)*Math.max(w,h);const ng=c.createRadialGradient(x,y,0,x,y,rad);const col=neb[Math.floor(r()*neb.length)];ng.addColorStop(0,`rgba(${col},.3)`);ng.addColorStop(1,`rgba(${col},0)`);c.fillStyle=ng;c.fillRect(0,0,w,h);}
    const n=Math.floor(w*h/240);
    for(let i=0;i<n;i++){const x=r()*w,y=r()*h,s=Math.pow(r(),3)*1.7+.3;c.fillStyle=`rgba(255,250,240,${.25+r()*.7})`;c.beginPath();c.arc(x,y,s,0,7);c.fill();
      if(s>1.55){c.strokeStyle='rgba(255,250,240,.35)';c.lineWidth=.6;c.beginPath();c.moveTo(x-s*3,y);c.lineTo(x+s*3,y);c.moveTo(x,y-s*3);c.lineTo(x,y+s*3);c.stroke();}}
    const left=r()<.5, sx=left?-w*.04:w*1.04, sy=h*(.3+r()*.4), sr=Math.min(h*.34,w*.2);
    const sg=c.createRadialGradient(sx,sy,0,sx,sy,sr*3.2); sg.addColorStop(0,'rgba(255,244,210,.98)'); sg.addColorStop(.17,'rgba(255,205,115,.8)'); sg.addColorStop(.42,'rgba(255,140,60,.22)'); sg.addColorStop(1,'rgba(255,120,40,0)'); c.fillStyle=sg; c.fillRect(0,0,w,h);
    const pal=[['#f0c08a','#6e4024'],['#7cc4ea','#1a3a66'],['#d8735a','#43190f'],['#e8dcb0','#5e4f32'],['#93dcb8','#1f5242'],['#b9a4f0','#33245f']];
    const dir=left?1:-1;
    for(let i=1;i<=4;i++){
      const rx=w*(.18+i*.21), ry=rx*.2;
      c.save(); c.translate(sx,sy); c.rotate(-.08*dir);
      c.strokeStyle='rgba(255,255,255,.14)'; c.lineWidth=1; c.beginPath(); c.ellipse(0,0,rx,ry,0,0,Math.PI*2); c.stroke();
      const a=(left?0:Math.PI)+(r()-.5)*1.1; const px=Math.cos(a)*rx, py=Math.sin(a)*ry;
      const pr=Math.max(3,h*(.04+r()*.07)); const [lit,dark]=pal[Math.floor(r()*pal.length)];
      const ringed=i===3;
      c.strokeStyle='rgba(240,225,190,.6)'; c.lineWidth=Math.max(1.4,pr*.16);
      if(ringed){c.beginPath();c.ellipse(px,py,pr*2.1,pr*.55,-.35,Math.PI,Math.PI*2);c.stroke();}
      const hx=px-Math.sign(px||1)*pr*.45; const pg=c.createRadialGradient(hx,py-pr*.3,pr*.1,px,py,pr*1.05); pg.addColorStop(0,lit); pg.addColorStop(1,dark);
      c.fillStyle=pg; c.beginPath(); c.arc(px,py,pr,0,7); c.fill();
      if(ringed){c.beginPath();c.ellipse(px,py,pr*2.1,pr*.55,-.35,0,Math.PI);c.stroke();}
      if(r()<.55){c.fillStyle='rgba(230,230,240,.85)';c.beginPath();c.arc(px+pr*1.6*dir,py-pr*.8,Math.max(1,pr*.17),0,7);c.fill();}
      c.restore();
    }
  },
  /* Makers and Fixers: engineering blueprint with gears */
  blueprint(c,w,h,r){
    const g=c.createLinearGradient(0,0,w,h); g.addColorStop(0,'#0e2a52'); g.addColorStop(1,'#1a4677'); c.fillStyle=g; c.fillRect(0,0,w,h);
    c.lineWidth=1;
    for(let x=0;x<w;x+=10){c.strokeStyle=x%50?'rgba(255,255,255,.05)':'rgba(255,255,255,.12)';c.beginPath();c.moveTo(x+.5,0);c.lineTo(x+.5,h);c.stroke();}
    for(let y=0;y<h;y+=10){c.strokeStyle=y%50?'rgba(255,255,255,.05)':'rgba(255,255,255,.12)';c.beginPath();c.moveTo(0,y+.5);c.lineTo(w,y+.5);c.stroke();}
    const gear=(x,y,R,n,rot)=>{const T=R*.17;c.strokeStyle='rgba(235,245,255,.62)';c.lineWidth=1.3;c.beginPath();
      for(let k=0;k<=720;k++){const th=k/720*Math.PI*2;const tooth=Math.floor(th/(Math.PI*2/n)*2)%2===0;const rr=R+(tooth?T:0);const px=x+Math.cos(th+rot)*rr,py=y+Math.sin(th+rot)*rr;k?c.lineTo(px,py):c.moveTo(px,py);}
      c.closePath();c.stroke();c.beginPath();c.arc(x,y,R*.62,0,7);c.stroke();c.beginPath();c.arc(x,y,R*.18,0,7);c.stroke();
      for(let s=0;s<6;s++){const th=s/6*Math.PI*2+rot;c.beginPath();c.moveTo(x+Math.cos(th)*R*.18,y+Math.sin(th)*R*.18);c.lineTo(x+Math.cos(th)*R*.62,y+Math.sin(th)*R*.62);c.stroke();}};
    const R1=h*(.3+r()*.1), x1=w*(.58+r()*.28), y1=h*(.42+r()*.16);
    gear(x1,y1,R1,14,r()*2);
    const R2=R1*.58, d=R1+R2+R1*.12, a=2.3+r()*.6; gear(x1+d*Math.cos(a),y1+d*Math.sin(a),R2,9,r()*2);
    gear(w*(.1+r()*.2),h*(.25+r()*.45),R1*.42,8,r()*2);
    c.setLineDash([4,5]); c.strokeStyle='rgba(235,245,255,.35)'; c.beginPath(); c.arc(x1,y1,R1*1.6,Math.PI*.95,Math.PI*1.6); c.stroke(); c.setLineDash([]);
    const yy=h*.88; c.strokeStyle='rgba(235,245,255,.45)'; c.beginPath(); c.moveTo(w*.06,yy); c.lineTo(w*.36,yy); c.moveTo(w*.06,yy-5); c.lineTo(w*.06,yy+5); c.moveTo(w*.36,yy-5); c.lineTo(w*.36,yy+5); c.stroke();
  },
  /* Crowns and Conquest: stained glass */
  glass(c,w,h,r){
    const pal=['#7a1f2b','#1f4d7a','#2f6b3a','#b8862b','#4a2a6b','#8c3a1c','#245b6b'];
    const s=Math.max(26,Math.min(w,h)/4.2), cols=Math.ceil(w/s)+2, rows=Math.ceil(h/s)+2, pts=[];
    for(let j=0;j<rows;j++){pts[j]=[];for(let i=0;i<cols;i++){pts[j][i]=[(i-.5)*s+(r()-.5)*s*.55,(j-.5)*s+(r()-.5)*s*.55];}}
    const shade=(hex,f)=>{const v=parseInt(hex.slice(1),16);return `rgb(${Math.min(255,((v>>16)&255)*f)|0},${Math.min(255,((v>>8)&255)*f)|0},${Math.min(255,(v&255)*f)|0})`;};
    c.fillStyle='#120c0c'; c.fillRect(0,0,w,h); c.lineJoin='round'; c.strokeStyle='rgba(18,12,12,.95)'; c.lineWidth=2.6;
    for(let j=0;j<rows-1;j++)for(let i=0;i<cols-1;i++){const A=pts[j][i],B=pts[j][i+1],D=pts[j+1][i],E=pts[j+1][i+1];
      const tris=r()<.5?[[A,B,E],[A,E,D]]:[[A,B,D],[B,E,D]];
      for(const t of tris){c.fillStyle=shade(pal[Math.floor(r()*pal.length)],.7+r()*.6);c.beginPath();c.moveTo(t[0][0],t[0][1]);c.lineTo(t[1][0],t[1][1]);c.lineTo(t[2][0],t[2][1]);c.closePath();c.fill();c.stroke();}}
    const lg=c.createRadialGradient(w*.5,-h*.2,0,w*.5,-h*.2,h*1.4); lg.addColorStop(0,'rgba(255,240,200,.3)'); lg.addColorStop(1,'rgba(255,240,200,0)'); c.fillStyle=lg; c.fillRect(0,0,w,h);
  },
  /* Against the Odds: aurora over a rough polar sea */
  storm(c,w,h,r){
    const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#071c28'); g.addColorStop(.6,'#1b4656'); g.addColorStop(1,'#0c2a36'); c.fillStyle=g; c.fillRect(0,0,w,h);
    for(let i=0;i<40;i++){c.fillStyle=`rgba(255,255,255,${.2+r()*.5})`;c.beginPath();c.arc(r()*w,r()*h*.5,r()*1.1+.3,0,7);c.fill();}
    c.lineCap='round';
    for(let i=0;i<3;i++){const y0=h*(.14+i*.09+r()*.06),amp=h*(.04+r()*.05),f=(1+r()*2)/w*Math.PI*2,ph=r()*7;
      c.strokeStyle=`rgba(${i%2?'150,255,210':'120,210,255'},${.22-i*.04})`;c.lineWidth=Math.max(4,h*(.11-i*.025));c.beginPath();
      for(let x=-10;x<=w+10;x+=6){const y=y0+Math.sin(x*f+ph)*amp;x<=-10?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();}
    for(let L=0;L<4;L++){const base=h*(.62+L*.1),amp=h*(.025+L*.012),f=(3+r()*3)/w*Math.PI*2,ph=r()*7;
      c.fillStyle=`rgba(${8+L*6},${30+L*12},${42+L*12},${.78+L*.05})`;c.beginPath();c.moveTo(0,h);
      for(let x=0;x<=w+6;x+=6){c.lineTo(x,base+Math.sin(x*f+ph)*amp+Math.sin(x*f*2.3)*amp*.4);}
      c.lineTo(w,h);c.closePath();c.fill();}
    for(let i=0;i<5;i++){const x=r()*w,y=h*(.6+r()*.25),s=h*(.05+r()*.08);c.fillStyle='rgba(235,248,255,.6)';c.beginPath();c.moveTo(x,y);c.lineTo(x+s*1.4,y-s*.2);c.lineTo(x+s*.8,y+s*.35);c.closePath();c.fill();}
  },
  /* Britain at War: dusk sky, searchlights, contrails, city skyline */
  dusk(c,w,h,r){
    const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#141c36'); g.addColorStop(.55,'#4e3f62'); g.addColorStop(1,'#cf7a4e'); c.fillStyle=g; c.fillRect(0,0,w,h);
    for(let i=0;i<3;i++){const bx=w*(.15+i*.33+(r()-.5)*.1),ang=-Math.PI/2+(r()-.5)*.9,len=h*1.7,sp=.07;
      const lg=c.createLinearGradient(bx,h,bx+Math.cos(ang)*len,h+Math.sin(ang)*len); lg.addColorStop(0,'rgba(255,250,220,.3)'); lg.addColorStop(1,'rgba(255,250,220,0)');
      c.fillStyle=lg; c.beginPath(); c.moveTo(bx,h); c.lineTo(bx+Math.cos(ang-sp)*len,h+Math.sin(ang-sp)*len); c.lineTo(bx+Math.cos(ang+sp)*len,h+Math.sin(ang+sp)*len); c.closePath(); c.fill();}
    for(let i=0;i<6;i++){const x=r()*w,y=h*(.12+r()*.45),s=h*(.06+r()*.07);c.fillStyle=`rgba(255,225,205,${.07+r()*.1})`;for(let k=0;k<4;k++){c.beginPath();c.arc(x+k*s*.9,y+(k%2)*s*.3,s,0,7);c.fill();}}
    c.strokeStyle='rgba(255,250,240,.5)'; c.lineWidth=1.6; c.lineCap='round';
    const pp=new Path2D(PLANE_PATH);
    for(let i=0;i<3;i++){const x0=r()*w*.3,y0=h*(.2+r()*.4),x1=w*(.55+r()*.4),y1=h*(.1+r()*.35),cx=w*r(),cy=h*r()*.6;
      c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(cx,cy,x1,y1);c.stroke();
      c.save();c.translate(x1,y1);c.rotate(Math.atan2(y1-cy,x1-cx));c.scale(.8,.8);c.translate(-12,-12);c.fillStyle='rgba(20,18,30,.92)';c.fill(pp);c.restore();}
    c.fillStyle='rgba(12,10,20,.94)'; c.beginPath(); c.moveTo(0,h); let x=0;
    while(x<w){const bw=w*(.03+r()*.06),bh=h*(.05+r()*.13); c.lineTo(x,h-bh); c.lineTo(x+bw,h-bh); x+=bw;}
    c.lineTo(w,h); c.closePath(); c.fill();
    const dx=w*(.4+r()*.2), dr=h*.07; c.beginPath(); c.arc(dx,h-h*.17,dr,Math.PI,0); c.fill(); c.fillRect(dx-dr*1.3,h-h*.17,dr*2.6,h*.17); c.fillRect(dx-1.5,h-h*.17-dr-h*.06,3,h*.06);
  }
};
function paintArt(root){
  (root||document).querySelectorAll('canvas[data-art]').forEach(cv=>{
    const w=cv.clientWidth,h=cv.clientHeight; if(!w||!h) return;
    const dpr=Math.min(2,window.devicePixelRatio||1), W=Math.round(w*dpr), H=Math.round(h*dpr);
    if(cv.dataset.done && cv.width===W && cv.height===H) return;
    cv.width=W; cv.height=H; const c=cv.getContext('2d'); if(!c||!ART[cv.dataset.art]) return;
    c.setTransform(dpr,0,0,dpr,0,0);
    try{ ART[cv.dataset.art](c,w,h,rng(hashStr(cv.dataset.seed||'x')));
      if(cv.dataset.tint){c.globalAlpha=.3;c.fillStyle=cv.dataset.tint;c.fillRect(0,0,w,h);c.globalAlpha=1;}
      cv.dataset.done='1'; }catch(e){}
  });
}
let resizeT; window.addEventListener('resize',()=>{clearTimeout(resizeT);resizeT=setTimeout(()=>paintArt(),200);});

/* ---------- decks and cards ---------- */
const deckOf=id=>PATHS.find(p=>p.ids.includes(id));
const artOf=id=>STORIES[id].art||deckOf(id).art;
const tintFor=id=>artOf(id)==='space'?'':STORIES[id].era;
function artCanvas(kind,seed,tint){return `<canvas class="art" data-art="${kind}" data-seed="${esc(seed)}"${tint?` data-tint="${tint}"`:''} aria-hidden="true"></canvas>`;}
let OPEN=new Set(); try{OPEN=new Set(JSON.parse(localStorage.getItem('ioik-open'))||[])}catch(e){}
function saveOpen(){try{localStorage.setItem('ioik-open',JSON.stringify([...OPEN]))}catch(e){}}

function medal(id,size,locked){
  const st=STORIES[id];
  return `<span class="medal${locked?' locked':''}" style="--era:${st.era};${size?`--size:${size}px`:''}" aria-hidden="true">${ICONS[st.icon]}</span>`;
}
function plate(id){
  const st=STORIES[id];
  return `<div class="plate" style="--era:${st.era}" role="img" aria-label="Illustration: ${esc(st.who.name)}, ${esc(st.place)}, ${esc(st.year)}">${artCanvas(artOf(id),id,tintFor(id))}<span class="scene">${SCENES[id]()}</span><span class="cap"><span class="year">${esc(st.year)}</span><span class="nm">${esc(st.who.name)}</span></span><span class="sc pl">${esc(deckOf(id).name)} deck</span></div>`;
}
function heroMini(id){
  const st=STORIES[id];
  return `<div class="hero" style="--era:${st.era}" role="img" aria-label="${esc(st.who.name)}, ${esc(st.year)}">${artCanvas(artOf(id),id,tintFor(id))}<span class="scene">${SCENES[id]()}</span><span class="hcap"><span class="hy">${esc(st.year)}</span><span class="hn">${esc(st.who.name)}</span></span><span class="hd">${esc(st.title)}</span></div>`;
}
function mini(id,locked){
  const st=STORIES[id];
  return `<span class="mini${locked?' locked':''}" style="--era:${st.era}" aria-hidden="true">${artCanvas(artOf(id),id+'-m',tintFor(id))}<span class="mi">${ICONS[st.icon]}</span></span>`;
}
function pcard(id,opts={}){
  const st=STORIES[id], d=deckOf(id);
  if(opts.back) return `<span class="pcard back" aria-hidden="true"><span class="pb-in"><span class="pb-mono">?</span><span class="pb-deck">${esc(d.name)}</span><span class="pb-t">${esc(st.title)}</span></span></span>`;
  return `<span class="pcard${opts.big?' big':''}" style="--era:${st.era}"><span class="pc-art">${artCanvas(artOf(id),id+'-c',tintFor(id))}<span class="scene">${SCENES[id]()}</span><span class="pc-corner"><b>${esc(st.year)}</b>${ICONS[st.icon]}</span></span><span class="pc-body"><b class="pc-n">${esc(st.who.name)}</b><i class="pc-e">${esc(st.who.epithet)}</i><span class="pc-d">${esc(d.name)} deck</span></span></span>`;
}
function deckHTML(p){
  const done=p.ids.filter(i=>P.done[i]).length;
  return `<details class="deck" data-deck="${p.id}"${OPEN.has(p.id)?' open':''}>
    <summary>${artCanvas(p.art,'deck-'+p.id,'')}
      <span class="dk-t"><span class="sc">Deck</span><b>${esc(p.name)}</b></span>
      <span class="dk-m"><span>${done}/${p.ids.length} cards</span><span class="dk-bar"><i style="width:${Math.round(done/p.ids.length*100)}%"></i></span></span>
      <span class="chev" aria-hidden="true"></span>
    </summary>
    <div class="dk-body"><p class="note">${esc(p.blurb)}</p>
      ${p.ids.map(i=>{const s=STORIES[i];return `<button class="row" data-open="${i}">${mini(i,!P.done[i])}<span><span class="t">${esc(s.title)}</span><br><span class="k">${esc(s.who.name)} · ${esc(s.year)}</span></span><span class="pill ${P.done[i]?'done':'new'}">${P.done[i]?'Collected':'New'}</span></button>`}).join('')}
    </div>
  </details>`;
}

function renderHome(){
  const doneCount=ORDER.filter(i=>P.done[i]).length;
  const next=ORDER.find(i=>!P.done[i]) || ORDER[(new Date().getDate())%ORDER.length];
  const st=STORIES[next];
  const streak=currentStreak();
  const hand=ORDER.filter(i=>P.done[i]).slice(-4); while(hand.length<4) hand.push(null);
  app.innerHTML=`
  <div class="wrap">
    <header class="mast">
      ${BRAND_HTML}
      <p>One card from history, five minutes a day.</p>
    </header>
    <div class="stats" aria-label="Your progress">
      <span class="chip"><b>${streak}</b>-day streak</span>
      <span class="chip"><b>${P.xp}</b> XP</span>
      <span class="chip"><b>${doneCount}</b> of ${ORDER.length} cards</span>
    </div>
    <section aria-labelledby="today">
      <p class="sc" id="today" style="margin:0 0 8px">${P.done[next]?'Draw again':'Today’s draw'}</p>
      <button class="feature" data-open="${next}">
        ${plate(next)}
        <div class="body">
          <h2>${esc(st.title)}</h2>
          <span class="kicker">Meet ${esc(st.who.name)}, ${esc(st.who.epithet.toLowerCase())}</span>
          <span class="cta">${P.done[next]?'Read again':'Draw this card'} · 5 min</span>
        </div>
      </button>
    </section>
    <section class="path" aria-labelledby="sb-h">
      <div class="path-head"><h3 id="sb-h">Scoreboard</h3><span class="sc">Everyone playing</span></div>
      <div class="board" id="board">${boardHTML()}</div>
    </section>
    <section class="path" aria-labelledby="dk-h">
      <div class="path-head"><h3 id="dk-h">The decks</h3><span class="sc">${PATHS.length} decks · ${ORDER.length} cards</span></div>
      <div class="decks">${PATHS.map(deckHTML).join('')}</div>
    </section>
    <button class="link" data-go="collection">
      <span><span class="sc">Your collection</span><br>${doneCount} of ${ORDER.length} cards collected</span>
      <span class="fan">${hand.map((i,k)=>`<span class="fan-c" style="--k:${k}">${i?mini(i,false):'<span class="mini back"></span>'}</span>`).join('')}</span>
    </button>
    <section class="path" aria-labelledby="rq-h">
      <div class="path-head"><h3 id="rq-h">Request a card</h3><span class="sc">Who or what next?</span></div>
      <form class="form" id="reqform">
        <label for="reqtext" class="note" style="padding:0">Name a person, event or invention you would like a card about.</label>
        <textarea id="reqtext" class="field" maxlength="280" placeholder="For example: the first Tour de France, or how the jet engine was invented"></textarea>
        <div class="rowb"><span class="note" id="reqmsg" style="padding:0"></span><button class="small" type="submit" id="reqsend">Send request</button></div>
      </form>
      <div class="rqs" id="rqs">${reqsHTML()}</div>
    </section>
    <p class="foot">${PROFILE&&!PROFILE.solo?`Playing as ${esc(PROFILE.name)} \u00b7 family code ${esc(PROFILE.code)}. `:'Playing solo. '}Progress is saved on this device${PROFILE&&!PROFILE.solo?' and to the family scoreboard':''}. <button class="textbtn" data-act="rejoin">Change</button></p>
  </div>`;
  fillNames();
}

function renderStory(){
  const st=STORIES[S.id]; const total=st.cards.length+st.quiz.length;
  const pos = S.view==='story' ? S.step : st.cards.length+S.qi;
  const segs=Array.from({length:total},(_,i)=>`<i class="${i<=pos?'f':''}"></i>`).join('');
  let inner='', nav='';
  if(S.view==='story'){
    const c=st.cards[S.step];
    inner=`${heroMini(S.id)}
      <article class="chapter" id="chapter">
        <div class="fig" style="--era:${st.era}"><span class="vig" aria-hidden="true">${ICONS[PICS[S.id][S.step][0]]}</span><span class="lab"><span class="sc">Part ${S.step+1} of ${st.cards.length} · Pictured</span><b>${esc(PICS[S.id][S.step][1])}</b></span></div>
        <h2>${esc(c.h)}</h2>
        <p>${esc(c.t)}</p>
      </article>`;
    nav=`<button data-act="prev" ${S.step===0?'disabled':''}>Back</button>
         <button class="primary" data-act="next">${S.step===st.cards.length-1?'Play the card':'Next'}</button>`;
  } else {
    const q=st.quiz[S.qi]; const answered=S.picked!==null;
    inner=`${heroMini(S.id)}<div class="q">
        <span class="sc">Play the card · question ${S.qi+1} of ${st.quiz.length}</span>
        <h2>${esc(q.q)}</h2>
        ${q.o.map((o,i)=>{let c='';if(answered){if(i===q.a)c='right';else if(i===S.picked)c='wrong';}
          return `<button class="opt ${c}" data-pick="${i}" ${answered?'disabled':''}>${esc(o)}</button>`}).join('')}
        ${answered?`<p class="why"><b>${S.picked===q.a?'Correct.':'Not quite.'}</b> ${esc(q.why)}</p>`:''}
      </div>`;
    nav=`<button class="primary" data-act="qnext" ${answered?'':'disabled'}>${S.qi===st.quiz.length-1?'Collect the card':'Next question'}</button>`;
  }
  app.innerHTML=`<div class="story">
    <div class="bar">
      <button class="iconbtn" data-act="close" aria-label="Close card">✕</button>
      <div class="segs" aria-hidden="true">${segs}</div>
      ${canSpeak && S.view==='story'?`<button class="iconbtn ${S.listening?'on':''}" data-act="listen" aria-pressed="${S.listening}">${S.listening?'Stop':'Listen'}</button>`:''}
    </div>
    <div class="stage" id="stage">${inner}</div>
    <div class="nav">${nav}</div>
  </div>`;
}

function renderDone(){
  const st=STORIES[S.id];
  app.innerHTML=`<div class="finish">
    <span class="sc">Card collected</span>
    ${pcard(S.id,{big:true})}
    <p class="score">${S.score} of ${st.quiz.length} correct · +${S.gained} XP · ${currentStreak()}-day streak</p>
    <div class="take"><span class="sc">The takeaway</span><p>${esc(st.take)}</p></div>
    <button class="cta" data-go="home">Back to the decks</button>
  </div>`;
}

function renderCollection(){
  const n=ORDER.filter(i=>P.done[i]).length;
  app.innerHTML=`<div class="wrap">
    <button class="iconbtn back" data-go="home">← Decks</button>
    <header class="mast"><h1 style="font-size:40px">Your <span>collection</span></h1><p>${n} of ${ORDER.length} cards collected. Play a card to add it here.</p></header>
    ${PATHS.map(p=>`<section class="path" aria-label="${esc(p.name)}">
      <div class="path-head"><h3>${esc(p.name)}</h3><span class="sc">${p.ids.filter(i=>P.done[i]).length}/${p.ids.length}</span></div>
      <div class="grid">${p.ids.map(i=>`<button class="cardbtn" data-open="${i}" aria-label="${esc(STORIES[i].title)}${P.done[i]?'':' (not collected yet)'}">${P.done[i]?pcard(i):pcard(i,{back:true})}</button>`).join('')}</div>
    </section>`).join('')}
  </div>`;
}

function render(){
  if(S.view==='home') renderHome();
  else if(S.view==='story'||S.view==='quiz') renderStory();
  else if(S.view==='done') renderDone();
  else if(S.view==='collection') renderCollection();
  else if(S.view==='join') renderJoin();
  window.scrollTo(0,0);
  paintArt(app);
}
app.addEventListener('toggle',e=>{
  const d=e.target; if(!d.matches||!d.matches('details.deck')) return;
  if(d.open) OPEN.add(d.dataset.deck); else OPEN.delete(d.dataset.deck);
  saveOpen(); paintArt(d);
},true);

function readCurrent(){
  const st=STORIES[S.id]; const c=st.cards[S.step];
  speak(c.h+'. '+c.t, ()=>{
    if(!S.listening||S.view!=='story') return;
    if(S.step<st.cards.length-1){ S.step++; render(); readCurrent(); }
    else { S.listening=false; render(); }
  });
}

function open(id){ stopSpeech(); S={view:'story',id,step:0,qi:0,picked:null,score:0,listening:false}; render(); }
function finish(){
  const st=STORIES[S.id];
  const first=!P.done[S.id];
  const gained=S.score*10+(first?20:5);
  P.done[S.id]=true; P.xp+=gained;
  const today=localDay(0);
  if(P.last!==today){ P.streak = (P.last===localDay(-1)) ? P.streak+1 : 1; P.last=today; }
  save(); S.gained=gained; S.view='done'; render(); pushProgress();
}

app.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.open){ open(b.dataset.open); return; }
  if(b.dataset.go){ stopSpeech(); S.view=b.dataset.go; render(); return; }
  if(b.dataset.pick!==undefined && S.picked===null){
    S.picked=+b.dataset.pick; if(S.picked===STORIES[S.id].quiz[S.qi].a) S.score++; render(); return;
  }
  const a=b.dataset.act; const st=S.id&&STORIES[S.id];
  if(a==='solo'){ PROFILE={solo:true}; saveProfile(PROFILE); location.reload(); return; }
  if(a==='rejoin'){ stopSpeech(); S.view='join'; render(); return; }
  if(a==='close'){ stopSpeech(); S.view='home'; render(); }
  else if(a==='prev'&&S.step>0){ S.step--; render(); if(S.listening) readCurrent(); }
  else if(a==='next'){
    if(S.step<st.cards.length-1){ S.step++; render(); if(S.listening) readCurrent(); }
    else { stopSpeech(); S.listening=false; S.view='quiz'; S.qi=0; S.picked=null; render(); }
  }
  else if(a==='listen'){
    S.listening=!S.listening;
    if(S.listening){ render(); readCurrent(); } else { stopSpeech(); render(); }
  }
  else if(a==='qnext'){
    if(S.qi<st.quiz.length-1){ S.qi++; S.picked=null; render(); } else finish();
  }
});

app.addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.target;
  if(f.id==='joinform'){
    const name=(document.getElementById('jname').value||'').trim().slice(0,30);
    const code=cleanCode(document.getElementById('jcode').value);
    const msg=document.getElementById('jmsg');
    if(!name){ msg.textContent='Type your first name.'; return; }
    if(code.length<4){ msg.textContent='Type the family code you were sent. It is at least 4 letters or numbers.'; return; }
    PROFILE={name,code}; saveProfile(PROFILE); location.reload(); return;
  }
  if(f.id==='reqform'){
    const ta=document.getElementById('reqtext'); const msg=document.getElementById('reqmsg');
    const text=(ta.value||'').trim().slice(0,280);
    if(!text){ msg.textContent='Type a person, event or invention first.'; return; }
    if(PROFILE&&PROFILE.solo){ msg.textContent='Join a family scoreboard to send requests.'; return; }
    if(SH.state!=='on'){ msg.textContent='The scoreboard isn’t connected yet. Try again in a moment.'; return; }
    const btn=document.getElementById('reqsend'); btn.disabled=true; msg.textContent='Sending…';
    const fs=SH.fs;
    fs.addDoc(fs.collection(SH.db,'families',PROFILE.code,'requests'),{uid:SH.me,text,at:new Date().toISOString()})
      .then(()=>{ ta.value=''; msg.textContent='Sent. Thanks!'; })
      .catch(()=>{ msg.textContent='Couldn’t send that. Check your connection and try again.'; })
      .finally(()=>{ btn.disabled=false; });
  }
});

/* swipe between chapters */
let sx=null;
app.addEventListener('touchstart',e=>{ if(S.view==='story') sx=e.touches[0].clientX; },{passive:true});
app.addEventListener('touchend',e=>{
  if(sx===null||S.view!=='story') return;
  const dx=e.changedTouches[0].clientX-sx; sx=null;
  if(Math.abs(dx)<60) return;
  const btn=app.querySelector(`[data-act="${dx<0?'next':'prev'}"]`); if(btn&&!btn.disabled) btn.click();
},{passive:true});

/* boot */
if(!PROFILE) S.view='join';
render();
initShared();
if('serviceWorker' in navigator){ window.addEventListener('load',()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); }); }
