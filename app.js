/* If Only I Knew: app logic. Card content lives in decks.js. */
const ORDER = PATHS.flatMap(p=>p.ids);

/* ---------- saved progress (this browser only) ---------- */
const KEY='hindsight-v1';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
const P=Object.assign({done:{},xp:0,streak:0,last:null,week:null,freezeWeek:null,flash:null},load());
const dayStr=d=>d.toISOString().slice(0,10);
function localDay(offset=0){const d=new Date();d.setDate(d.getDate()+offset);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)}
/* Weeks run Monday to Sunday; a week is named by its Monday's date. */
function weekId(){ const d=new Date(); const back=(d.getDay()+6)%7; const m=new Date(d.getFullYear(),d.getMonth(),d.getDate()-back); return m.getFullYear()+'-'+String(m.getMonth()+1).padStart(2,'0')+'-'+String(m.getDate()).padStart(2,'0'); }
/* A streak survives one missed day per week: the streak shield. */
function streakAlive(last,freezeWeek){ if(!last) return false; if(last===localDay(0)||last===localDay(-1)) return true; return last===localDay(-2) && freezeWeek!==weekId(); }
function currentStreak(){ return streakAlive(P.last,P.freezeWeek)?P.streak:0; }
function shieldReady(){ return P.freezeWeek!==weekId(); }
function playedToday(){
  const today=localDay(0); S.shieldUsed=false;
  if(P.last===today) return;
  if(P.last===localDay(-1)) P.streak=(P.streak||0)+1;
  else if(P.last===localDay(-2) && P.freezeWeek!==weekId()){ P.streak=(P.streak||0)+1; P.freezeWeek=weekId(); S.shieldUsed=true; }
  else P.streak=1;
  P.last=today;
}
function addXP(n){ P.xp=(P.xp||0)+n; const w=weekId(); if(!P.week||P.week.id!==w) P.week={id:w,xp:0}; P.week.xp+=n; }
function weekXP(d){ return d&&d.week&&d.week.id===weekId()?(d.week.xp||0):0; }
/* New cards: added within the last 14 days (STORIES[id].added = 'YYYY-MM-DD'). */
function isFresh(id){ const a=STORIES[id]&&STORIES[id].added; if(!a) return false; return (Date.now()-new Date(a+'T00:00:00').getTime())/86400000 <= 14; }
/* Who asked for a card (FULFILLED maps request id -> card id, or -> {card, by}). */
function fulfilledCard(v){ return typeof v==='string'?v:(v&&v.card); }
function requestedBy(cardId){
  if(typeof FULFILLED==='undefined') return '';
  for(const [rid,v] of Object.entries(FULFILLED)){
    if(fulfilledCard(v)!==cardId) continue;
    if(v&&v.by) return v.by;
    const r=(typeof SH!=='undefined'&&SH.reqs||[]).find(x=>x.id===rid);
    if(r) return nameFor(r.uid);
  }
  return '';
}

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

/* ---------- ranks ---------- */
const RANKS=[
  {n:0,   name:'Wanderer',       line:'Every historian starts somewhere.'},
  {n:1,   name:'Apprentice',     line:'Your first card is in the deck.'},
  {n:5,   name:'Scribe',         line:'You are writing history down.'},
  {n:10,  name:'Chronicler',     line:'You keep the record of the ages.'},
  {n:20,  name:'Archivist',      line:'Twenty cards strong. The archive is yours.'},
  {n:35,  name:'Curator',        line:'Your collection belongs in a museum.'},
  {n:50,  name:'Loremaster',     line:'Few know the past as well as you.'},
  {n:75,  name:'Sage of Ages',   line:'Centuries bow to your knowledge.'},
  {n:100, name:'Keeper of Time', line:'The hourglass answers to you.'}
];
const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
function cardsDone(done){ return Object.keys(done||{}).filter(k=>STORIES[k]).length; }
function rankFor(n){ let i=0; RANKS.forEach((r,k)=>{ if(n>=r.n) i=k; }); return i; }
function sealHTML(i,size){ return `<span class="seal" style="--s:${size||40}px" aria-hidden="true"><b>${ROMAN[i]}</b></span>`; }
function rankBlock(){
  const n=cardsDone(P.done), i=rankFor(n), r=RANKS[i], nx=RANKS[i+1];
  const pct=nx?Math.round((n-r.n)/(nx.n-r.n)*100):100;
  return `<button class="rank-card" data-go="ranks">${sealHTML(i,48)}<span class="rk"><span class="sc">Rank ${ROMAN[i]} of ${RANKS.length}</span><b>${esc(r.name)}</b><span class="rk-bar"><i style="width:${pct}%"></i></span><span class="rk-next">${nx?`${nx.n-n} more card${nx.n-n===1?'':'s'} to ${esc(nx.name)}`:'The highest rank of all'}</span></span><span class="chev-r" aria-hidden="true"></span></button>`;
}
function renderRanks(){
  const n=cardsDone(P.done), cur=rankFor(n);
  app.innerHTML=`<div class="wrap">
    <button class="iconbtn back" data-go="home">← Decks</button>
    <header class="mast"><h1 style="font-size:40px">The <span>ranks</span></h1><p>Collect cards to climb the ranks. You have ${n} card${n===1?'':'s'}.</p></header>
    <ol class="ladder">${RANKS.map((r,i)=>`<li class="${i<cur?'got':i===cur?'now':'locked'}">${sealHTML(i,44)}<span><b>${esc(r.name)}</b><br><span class="k">${r.n===0?'Where everyone begins':`${r.n} card${r.n===1?'':'s'}`} · ${esc(r.line)}</span></span>${i===cur?'<span class="pill new">You</span>':i<cur?'<span class="pill done">Reached</span>':''}</li>`).join('')}</ol>
  </div>`;
}

/* ---------- first-time guided tour ---------- */
const TOURS={
  home:[
    {title:'Welcome to If Only I Knew', text:'Each card is a five-minute story from history, with a quick quiz at the end. Here’s a 30-second tour.'},
    {sel:'#otd .otd', title:'On this day', text:'Something that happened on today’s date in history, new every morning. Tap it to read more.'},
    {sel:'.feature', title:'Today’s draw', text:'Tap here to play today’s card. Brand-new cards always turn up here first.'},
    {sel:'.rank-card', title:'Your rank', text:'Every card you collect moves you up the ranks, from Wanderer all the way to Keeper of Time. Tap it to see the full ladder.'},
    {sel:'.stats', title:'Streaks and XP', text:'Play a card each day to build a streak. Your streak shield saves one missed day a week, and a new shield arrives every Monday.'},
    {sel:'.chip.snd', title:'Sound', text:'Chimes for right and wrong answers, plus a little fanfare when you collect a card. On Android your phone buzzes too. Tap here to turn sound off.'},
    {sel:'.flash-card', title:'Flashback quiz', text:'Once you’ve collected two cards, this mixes up questions from cards you’ve already played. The first round each day earns bonus XP.'},
    {sel:'#board', title:'Family scoreboard', text:'See how you’re doing against the family. It’s ranked by this week’s XP and starts again every Monday, so anyone can win a week. The picture next to each name is that player’s emblem.'},
    {sel:'.decks', title:'The decks', text:'Cards are grouped into decks. Tap a deck to open it and pick any card. Collect a whole deck to earn its gold seal.'},
    {sel:'.tl-link', title:'Your timeline', text:'See every card in date order, from Boudica to the present day. The gaps show which cards you still need to collect.'},
    {sel:'#reqform', title:'Request a card', text:'Want a story about someone or something in particular? Ask here. When your idea becomes a card, it’ll say it was requested by you.'}
  ],
  card:[
    {sel:'[data-act="listen"]', title:'Read aloud', text:'Tap Listen and the story is read out to you, turning the pages as it goes. Tap Stop to pause it.'},
    {sel:'.segs', title:'Your progress', text:'Each bar is one part of the story. The last three are the quiz.'},
    {sel:'.fig', title:'What’s pictured', text:'Every part shows the person, place or thing it’s about.'},
    {sel:'.nav .primary', title:'Turn the page', text:'Tap Next, or swipe left on the story. Swipe right to go back a page.'},
    {sel:'[data-act="close"]', title:'Close the card', text:'Tap the cross to go back to the decks at any time. You can start the card again whenever you like.'}
  ],
  done:[
    {sel:'[data-act="share"]', title:'Share your score', text:'Send your score to the family WhatsApp group as a picture and challenge them to beat it.'}
  ],
  whatsnew1:[
    {title:'New in If Only I Knew', text:'A new Speed and Machines deck, plus a few new things to find. Here’s a quick look.'},
    {sel:'#otd .otd', title:'On this day', text:'Something that happened on today’s date in history, new every morning. Tap it to read more.'},
    {sel:'.chip.snd', title:'Sound', text:'Chimes for right and wrong answers, plus a little fanfare when you collect a card. On Android your phone buzzes too. Tap here to turn sound off.'},
    {fam:true, sel:'#board', title:'Your emblem', text:'Your emblem sits next to your name on the scoreboard. Tap Change name or emblem at the bottom of the page to pick a new one.'},
    {sel:'.tl-link', title:'Your timeline', text:'See every card in date order, from Boudica to the present day. The gaps show which cards you still need to collect.'}
  ],
  quiz:[
    {sel:'.q', title:'Play the card', text:'Answer three quick questions. Every answer is in the story you’ve just read. You get 10 XP for each right answer, plus 20 XP the first time you collect a card.'}
  ]
};
function tourSeen(n){ try{return localStorage.getItem('ioik-tour-'+n)==='1'}catch(e){return true} }
function markTour(n){ try{localStorage.setItem('ioik-tour-'+n,'1')}catch(e){} }
let TOUR=null;
function maybeTour(){
  if(TOUR) return;
  let n = S.view==='home'?'home' : S.view==='story'?'card' : S.view==='quiz'?'quiz' : S.view==='done'?'done' : null;
  if(n==='home'&&tourSeen('home')) n='whatsnew1';
  if(!n || tourSeen(n)) return;
  const view={home:'home',whatsnew1:'home',card:'story',quiz:'quiz',done:'done'}[n];
  setTimeout(()=>{ if(!TOUR && S.view===view) startTour(n); },n==='home'||n==='whatsnew1'?900:450);
}
function startTour(n){
  const steps=TOURS[n].filter(st=>(!st.fam||(PROFILE&&!PROFILE.solo))&&(!st.sel||document.querySelector(st.sel)));
  if(!steps.length){ markTour(n); return; }
  if(S.listening){ S.listening=false; stopSpeech(); }
  TOUR={n,steps,i:0};
  const el=document.createElement('div'); el.className='tour'; el.id='tour';
  el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-labelledby','tour-t');
  el.innerHTML='<div class="tour-hole"></div><div class="tour-tip"><span class="sc" id="tour-n"></span><h3 id="tour-t"></h3><p id="tour-x"></p><div class="tour-nav"><button class="textbtn" data-tour="skip">Skip tour</button><span class="tour-dots" aria-hidden="true"></span><button class="small" data-tour="next"></button></div></div>';
  document.body.appendChild(el);
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-tour]'); if(!b) return;
    if(b.dataset.tour==='skip') endTour(); else if(TOUR.i<TOUR.steps.length-1){ TOUR.i++; showStep(); } else endTour();
  });
  showStep();
}
function showStep(){
  const st=TOUR.steps[TOUR.i], el=document.getElementById('tour'); if(!el) return;
  const hole=el.querySelector('.tour-hole'), tip=el.querySelector('.tour-tip');
  el.querySelector('#tour-n').textContent=`${TOUR.i+1} of ${TOUR.steps.length}`;
  el.querySelector('#tour-t').textContent=st.title;
  el.querySelector('#tour-x').textContent=st.text;
  el.querySelector('[data-tour="next"]').textContent=TOUR.i===TOUR.steps.length-1?'Got it':'Next';
  el.querySelector('.tour-dots').innerHTML=TOUR.steps.map((_,k)=>`<i class="${k===TOUR.i?'on':''}"></i>`).join('');
  const target=st.sel&&document.querySelector(st.sel);
  tip.style.top=''; tip.style.bottom='';
  if(!target){ hole.style.display='none'; el.classList.add('dim'); tip.style.top='50%'; tip.style.transform='translateY(-50%)'; el.querySelector('[data-tour="next"]').focus(); return; }
  el.classList.remove('dim'); hole.style.display='block'; tip.style.transform='';
  target.scrollIntoView({block:'center',behavior:'instant'});
  requestAnimationFrame(()=>{
    const r=target.getBoundingClientRect(), pad=6, H=window.innerHeight;
    hole.style.left=(r.left-pad)+'px'; hole.style.top=(r.top-pad)+'px';
    hole.style.width=(r.width+pad*2)+'px'; hole.style.height=(Math.min(r.height,H*.55)+pad*2)+'px';
    if(r.top+Math.min(r.height,H*.55)/2 < H*0.5) tip.style.top=Math.min(H-220,r.top+Math.min(r.height,H*.55)+pad+12)+'px';
    else tip.style.bottom=Math.min(H-220,H-r.top+pad+12)+'px';
    el.querySelector('[data-tour="next"]').focus();
  });
}
function endTour(){ if(!TOUR) return; markTour(TOUR.n); if(TOUR.n==='home') markTour('whatsnew1'); TOUR=null; const el=document.getElementById('tour'); if(el) el.remove(); }
document.addEventListener('keydown',e=>{ if(TOUR&&e.key==='Escape') endTour(); });
window.addEventListener('resize',()=>{ if(TOUR) showStep(); });
function replayTour(){ ['home','card','quiz','done'].forEach(n=>{ try{localStorage.removeItem('ioik-tour-'+n)}catch(e){} }); S.view='home'; render(); }

/* ---------- flashback quiz ---------- */
const FLASH_LEN=5;
function flashPool(){ const out=[]; ORDER.filter(i=>P.done[i]).forEach(id=>STORIES[id].quiz.forEach((q,qi)=>out.push([id,qi]))); return out; }
function flashEntry(){
  const n=cardsDone(P.done);
  if(flashPool().length<FLASH_LEN) return `<div class="flash-card locked"><span class="fl-ico" aria-hidden="true">${FLASH_ICON}</span><span><b>Flashback quiz</b><br><span class="k">Collect ${Math.max(1,2-n)} more card${2-n===1?'':'s'} to unlock a quick quiz on cards you’ve already played.</span></span></div>`;
  const earned=P.flash===localDay(0);
  return `<button class="flash-card" data-act="flash"><span class="fl-ico" aria-hidden="true">${FLASH_ICON}</span><span><b>Flashback quiz</b><br><span class="k">${FLASH_LEN} quick questions from your cards · ${earned?'today’s bonus earned':'up to +25 XP'}</span></span><span class="chev-r" aria-hidden="true"></span></button>`;
}
const FLASH_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3 4v4.5h4.5"/><path d="M12 7.5V12l3 2"/></svg>';
function startFlash(){
  const pool=flashPool(); if(pool.length<FLASH_LEN) return;
  for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  stopSpeech(); S={view:'flash',fq:pool.slice(0,FLASH_LEN),fi:0,picked:null,score:0}; render();
}
function curQ(){ if(S.view==='flash'){ const [id,qi]=S.fq[S.fi]; return STORIES[id].quiz[qi]; } return STORIES[S.id].quiz[S.qi]; }
function renderFlash(){
  const [id]=S.fq[S.fi], st=STORIES[id], q=curQ(), answered=S.picked!==null;
  const segs=S.fq.map((_,i)=>`<i class="${i<=S.fi?'f':''}"></i>`).join('');
  app.innerHTML=`<div class="story">
    <div class="bar"><button class="iconbtn" data-act="close" aria-label="Close flashback quiz">✕</button><div class="segs" aria-hidden="true">${segs}</div></div>
    <div class="stage">${heroMini(id)}<div class="q">
      <span class="sc">Flashback · question ${S.fi+1} of ${S.fq.length}</span>
      <h2>${esc(q.q)}</h2>
      ${q.o.map((o,i)=>{let c='';if(answered){if(i===q.a)c='right';else if(i===S.picked)c='wrong';}
        return `<button class="opt ${c}" data-pick="${i}" ${answered?'disabled':''}>${esc(o)}</button>`}).join('')}
      ${answered?`<p class="why"><b>${S.picked===q.a?'Correct.':'Not quite.'}</b> ${esc(q.why)}</p>`:''}
    </div></div>
    <div class="nav"><button class="primary" data-act="fnext" ${answered?'':'disabled'}>${S.fi===S.fq.length-1?'See my score':'Next question'}</button></div>
  </div>`;
}
function finishFlash(){
  const today=localDay(0), first=P.flash!==today;
  const bonus=first?S.score*5:0;
  P.flash=today; addXP(bonus); playedToday(); save(); pushProgress(); SFX.collect();
  S.bonus=bonus; S.flashFirst=first; S.view='flashdone'; render();
}
function renderFlashDone(){
  app.innerHTML=`<div class="finish">
    <span class="sc">Flashback complete</span>
    <span class="fl-big" aria-hidden="true">${FLASH_ICON}</span>
    <h2 class="fl-score">${S.score} of ${S.fq.length}</h2>
    <p class="score">${S.flashFirst?`+${S.bonus} XP`:'Today’s bonus XP is already earned, but practice still counts'} · ${currentStreak()}-day streak</p>
    ${S.shieldUsed?'<p class="shieldnote">Your streak shield saved your streak. You get a new one on Monday.</p>':''}
    <div class="rowb2"><button class="cta" data-act="flash">Another round</button><button class="cta ghost" data-go="home">Back to the decks</button></div>
  </div>`;
}

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
const SH={tab:'week', state:'loading', me:null, board:{}, reqs:[], fs:null, db:null, writing:Promise.resolve()};
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

function streakOf(d){ return d&&streakAlive(d.last,d.freeze)?(d.streak||0):0; }
function nameFor(uid){ const d=SH.board[uid]; return (d&&d.name) || (uid===SH.me?'You':'Someone'); }
function initialAv(uid){
  const d=SH.board[uid], n=nameFor(uid), h=hashStr(uid)%360, e=d&&d.emblem;
  if(e&&EMBLEMS.some(x=>x[0]===e)) return `<span class="av emb-av" style="background:hsl(${h} 40% 30%)" title="${esc(n)}">${ICONS[e]}</span>`;
  return `<span class="av" style="background:hsl(${h} 45% 40%)">${esc(n.charAt(0).toUpperCase())}</span>`;
}
function boardHTML(){
  if(PROFILE&&PROFILE.solo) return '<p class="note">You are playing solo. <button class="textbtn" data-act="rejoin">Join a family scoreboard</button></p>';
  if(SH.state==='loading') return '<p class="note">Connecting to the scoreboard…</p>';
  if(SH.state==='error') return '<p class="note">The scoreboard can’t be reached right now. Your progress is still saved on this device and will sync next time.</p>';
  const ids=Object.keys(SH.board).filter(id=>SH.board[id]&&SH.board[id].name);
  if(!ids.length) return '<p class="note">Nobody has collected a card yet. Be the first.</p>';
  ids.sort((a,b)=>(weekXP(SH.board[b])-weekXP(SH.board[a]))||((SH.board[b].xp||0)-(SH.board[a].xp||0)));
  const nudge=SH.me&&!PROFILE.emblem?'<p class="note nudge"><button class="textbtn" data-act="rejoin">Pick your emblem</button> to show next to your name.</p>':'';
  const head=nudge+`<div class="bhead"><span>Ranked by this week \u00b7 resets every Monday</span><span>Week / All time</span></div>`;
  return head+ids.map((id,i)=>{const d=SH.board[id]; const n=Object.keys(d.done||{}).filter(k=>STORIES[k]).length;
    return `<div class="prow"><span class="rank">${i+1}</span>${initialAv(id)}<span><span class="pn">${esc(nameFor(id))}${id===SH.me?' (you)':''}</span><br><span class="ps">${esc(RANKS[rankFor(n)].name)} · ${n} card${n===1?'':'s'} · ${streakOf(d)}-day streak</span></span><span class="px2"><b>${weekXP(d)} XP</b><span>${d.xp||0} total</span></span></div>`}).join('');
}
function reqsHTML(){
  if(PROFILE&&PROFILE.solo) return '';
  if(SH.state!=='on'||!SH.reqs.length) return '';
  return '<p class="sc" style="margin:14px 0 0">Requested so far</p>'+SH.reqs.slice(0,12).map(r=>{const fc=(typeof FULFILLED!=='undefined')?fulfilledCard(FULFILLED[r.id]):null; const made=fc&&STORIES[fc]?fc:null;
    return `<div class="rq${made?' made':''}"><span class="tx">${esc(r.text)}</span><span class="by">${esc(nameFor(r.uid))} · ${esc(String(r.at).slice(0,10))}</span>${made?`<button class="added" data-open="${made}"><span aria-hidden="true">✓</span> Added as a card: ${esc(STORIES[made].title)}</button>`:''}</div>`;}).join('');
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
  const body={name:PROFILE.name, emblem:PROFILE.emblem||null, done:Object.assign({},P.done), xp:P.xp||0, streak:P.streak||0, last:P.last||null, week:P.week||null, freeze:P.freezeWeek||null, updated:new Date().toISOString()};
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
      if(remote.week&&(!P.week||remote.week.id>P.week.id||(remote.week.id===P.week.id&&remote.week.xp>P.week.xp))) P.week=remote.week;
      if(remote.freeze&&(!P.freezeWeek||remote.freeze>P.freezeWeek)) P.freezeWeek=remote.freeze;
      save();
    }
    SH.state='on'; clearTimeout(timer);
    pushProgress();
    fs.onSnapshot(fs.collection(db,'families',PROFILE.code,'players'),qs=>{
      const b={}; qs.forEach(d=>{ b[d.id]=d.data(); }); SH.board=b; refreshShared();
    },()=>{ SH.state='error'; refreshShared(); });
    fs.onSnapshot(fs.query(fs.collection(db,'families',PROFILE.code,'requests'),fs.orderBy('at','desc'),fs.limit(30)),qs=>{
      SH.reqs=qs.docs.map(d=>Object.assign({id:d.id},d.data())); refreshShared();
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
        ${emblemPicker(p.emblem)}
        <p class="note" id="jmsg" style="padding:0"></p>
        <button class="cta" type="submit" style="align-self:flex-start">Start playing</button>
      </form>
    </section>
    <button class="textbtn" data-act="solo">Just play on my own</button>
    <p class="foot">Only your first name and your scores are shared, and only with people who have your family code.</p>
  </div>`;
}

/* ---------- sound and vibration ---------- */
let SOUND=(()=>{ try{ return localStorage.getItem('ioik-sound')!=='off'; }catch(e){ return true; } })();
let AC=null;
function audio(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } } if(AC.state==='suspended') AC.resume(); return AC; }
function tone(f,t0,dur,type,vol){
  const c=audio(); if(!c) return;
  const o=c.createOscillator(), g=c.createGain(), t=c.currentTime+t0;
  o.type=type||'sine'; o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol||.15,t+.012); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+.05);
}
function swish(){
  const c=audio(); if(!c) return;
  const len=Math.floor(c.sampleRate*.13), buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5);
  const src=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain();
  src.buffer=buf; f.type='bandpass'; f.frequency.value=2200; f.Q.value=.8; g.gain.value=.22;
  src.connect(f); f.connect(g); g.connect(c.destination); src.start();
}
function buzz(p){ try{ if(SOUND&&navigator.vibrate) navigator.vibrate(p); }catch(e){} }
const SFX={
  flip(){ if(SOUND) swish(); },
  right(){ if(!SOUND) return; tone(660,0,.16,'triangle',.16); tone(990,.08,.3,'triangle',.14); buzz(25); },
  wrong(){ if(!SOUND) return; tone(233,0,.28,'sine',.12); buzz([15,50,15]); },
  collect(){ if(!SOUND) return; [523,659,784].forEach((f,i)=>tone(f,i*.08,.55,'triangle',.12)); buzz(40); },
  rankup(){ if(!SOUND) return; [523,659,784,1047].forEach((f,i)=>tone(f,i*.12,.7,'triangle',.14)); buzz([40,60,40,60,140]); }
};
function toggleSound(){ SOUND=!SOUND; try{ localStorage.setItem('ioik-sound',SOUND?'on':'off'); }catch(e){} if(SOUND) SFX.right(); }

/* ---------- on this day (Wikipedia) ---------- */
let OTD=null;
function otdHTML(){
  if(!OTD) return '';
  return `<a class="otd" href="${esc(OTD.url||'https://en.wikipedia.org/wiki/Wikipedia:Selected_anniversaries')}" target="_blank" rel="noopener"><span class="sc">On this day in ${esc(OTD.year)}</span><span class="otd-t">${esc(OTD.text)}</span><span class="otd-s">From Wikipedia ↗</span></a>`;
}
async function loadOnThisDay(){
  const d=new Date(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'), key='ioik-otd-'+d.getFullYear()+mm+dd;
  try{ const c=JSON.parse(localStorage.getItem(key)); if(c){ OTD=c; refreshOTD(); return; } }catch(e){}
  try{
    const r=await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${mm}/${dd}`);
    if(!r.ok) return;
    const j=await r.json();
    const grim=/kill|dead|death|dies|died|massacre|bomb|murder|attack|shoot|terror|genocide|execut|assassin|suicide|rape|explosion|crash|disaster|riot|hostage|slaughter|lynch|torture|abuse|war crime|casualt|wounded|sink|sank|famine|plague|earthquake|tsunami|hurricane/i;
    const ok=(j.selected||[]).filter(e=>e&&e.text&&typeof e.year==='number'&&e.text.length<260&&!grim.test(e.text));
    if(!ok.length) return;
    const uk=ok.filter(e=>/Brit|England|English|United Kingdom|\bUK\b|London|Scotland|Scottish|Wales|Welsh|Ireland|Irish/i.test(e.text));
    const pool=uk.length?uk:ok, pick=pool[hashStr(mm+dd)%pool.length], page=(pick.pages||[])[0];
    OTD={year:String(pick.year), text:pick.text, url:page&&page.content_urls&&page.content_urls.mobile&&page.content_urls.mobile.page};
    try{ Object.keys(localStorage).filter(k=>k.startsWith('ioik-otd-')).forEach(k=>localStorage.removeItem(k)); localStorage.setItem(key,JSON.stringify(OTD)); }catch(e){}
    refreshOTD();
  }catch(e){}
}
function refreshOTD(){ const el=document.getElementById('otd'); if(el) el.innerHTML=otdHTML(); }

/* ---------- emblems ---------- */
const EMBLEMS=[['raven','Raven'],['rocket','Rocket'],['crown','Crown'],['plane','Spitfire'],['ship','Ship'],['lamp','Lamp'],['gear','Gear'],['shield','Shield'],['wheel','Chariot wheel'],['tree','Oak tree'],['trophy','Trophy'],['galaxy','Galaxy'],['car','Mini'],['flag','Chequered flag'],['enigma','Enigma machine'],['tankard','Tankard']];
let PICKED_EMBLEM=null;
function emblemPicker(cur){
  PICKED_EMBLEM=cur||null;
  return `<fieldset class="emblems"><legend class="sc">Pick your emblem</legend><div class="emb-grid">${EMBLEMS.map(([k,n])=>`<button type="button" class="emb${cur===k?' on':''}" data-emb="${k}" aria-label="${n}" aria-pressed="${cur===k}" title="${n}">${ICONS[k]}</button>`).join('')}</div></fieldset>`;
}

/* ---------- timeline ---------- */
function yearNum(id){ const y=String(STORIES[id].year), m=y.match(/\d+/), n=m?parseInt(m[0],10):0; return /\bBC/i.test(y)?-n:n; }
const ERAS=[[-99999,499,'Ancient and Roman'],[500,1499,'Medieval'],[1500,1799,'Tudors to Georgians'],[1800,1899,'The 1800s'],[1900,1999,'The 1900s'],[2000,99999,'Since 2000']];
function renderTimeline(){
  const ids=[...ORDER].sort((a,b)=>yearNum(a)-yearNum(b)), n=cardsDone(P.done);
  let html='';
  ERAS.forEach(([lo,hi,name])=>{
    const here=ids.filter(i=>yearNum(i)>=lo&&yearNum(i)<=hi); if(!here.length) return;
    html+=`<li class="tl-era"><span class="sc">${name}</span></li>`+here.map(i=>{const s=STORIES[i], got=!!P.done[i];
      return `<li class="tl-item${got?' got':''}"><span class="tl-year">${esc(s.year)}</span><span class="tl-dot" aria-hidden="true"></span><button class="tl-card" data-open="${i}">${mini(i,!got)}<span><b>${got?esc(s.title):'Not collected yet'}</b><br><span class="k">${got?esc(s.who.name):esc(deckOf(i).name)+' deck'}</span></span></button></li>`;}).join('');
  });
  app.innerHTML=`<div class="wrap">
    <button class="iconbtn back" data-go="home">← Decks</button>
    <header class="mast"><h1 style="font-size:40px">Your <span>timeline</span></h1><p>${n} of ${ORDER.length} cards placed in history. Tap any card to play it.</p></header>
    <ol class="timeline">${html}</ol>
  </div>`;
}

/* ---------- share your score ---------- */
function toast(msg){
  let t=document.getElementById('toast'); if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; t.setAttribute('role','status'); document.body.appendChild(t); }
  t.textContent=msg; t.classList.add('on'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),3200);
}
function wrapText(x,text,maxW){ const words=String(text).split(' '), lines=[]; let line=''; words.forEach(w=>{ const t=line?line+' '+w:w; if(x.measureText(t).width>maxW&&line){ lines.push(line); line=w; } else line=t; }); if(line) lines.push(line); return lines; }
async function scoreImage(id,score,total){
  const W=1080, H=1350, AH=Math.round(H*.58), st=STORIES[id];
  const c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d');
  try{ await document.fonts.ready; }catch(e){}
  ART[artOf(id)](x,W,AH,rng(hashStr(id+'-share')));
  if(tintFor(id)){ x.globalAlpha=.3; x.fillStyle=st.era; x.fillRect(0,0,W,AH); x.globalAlpha=1; }
  await new Promise(res=>{
    const svg=SCENES[id]().replace('<svg ',`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${AH}" `);
    const img=new Image(); img.onload=()=>{ x.drawImage(img,0,0,W,AH); res(); }; img.onerror=()=>res();
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  });
  const g=x.createLinearGradient(0,AH*.55,0,AH); g.addColorStop(0,'rgba(21,24,39,0)'); g.addColorStop(1,'rgba(21,24,39,1)'); x.fillStyle=g; x.fillRect(0,AH*.55,W,AH*.45);
  x.fillStyle='#151827'; x.fillRect(0,AH,W,H-AH);
  x.strokeStyle='#d6a64f'; x.lineWidth=6; x.strokeRect(24,24,W-48,H-48);
  const serif="'IM Fell English', Georgia, serif";
  x.fillStyle='#fff8e8'; x.font=`64px ${serif}`; x.fillText(st.year,70,AH-70);
  x.font=`italic 44px ${serif}`; x.fillText(st.who.name,70,AH-20);
  x.textAlign='center';
  x.fillStyle='#d6a64f'; x.font=`italic 52px ${serif}`; x.fillText('If only I knew',W/2,AH+90);
  x.fillStyle='#fff8e8'; x.font=`180px ${serif}`; x.fillText(`${score}/${total}`,W/2,AH+280);
  x.font=`48px ${serif}`; wrapText(x,`on “${st.title}”`,W-160).slice(0,2).forEach((l,i)=>x.fillText(l,W/2,AH+360+i*58));
  x.fillStyle='#d6a64f'; x.font=`italic 54px ${serif}`; x.fillText('Can you beat me?',W/2,H-118);
  x.fillStyle='#a8a192'; x.font=`30px ${serif}`; x.fillText((location.host+location.pathname).replace(/index\.html$/,'').replace(/\/$/,''),W/2,H-62);
  return await new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('no image')),'image/png'));
}
function prepShare(){
  const id=S.id, sc=S.score, tot=STORIES[id].quiz.length; S.shareFile=null;
  scoreImage(id,sc,tot).then(b=>{ if(S.view==='done'&&S.id===id) S.shareFile=new File([b],'if-only-i-knew-score.png',{type:'image/png'}); }).catch(()=>{});
}
async function shareScore(){
  const st=STORIES[S.id], total=st.quiz.length, url=location.origin+location.pathname;
  const text=`I got ${S.score}/${total} on “${st.title}” in If Only I Knew. Can you beat me? ${url}`;
  const btn=document.querySelector('[data-act="share"]'); if(btn){ btn.disabled=true; btn.textContent='Preparing…'; }
  try{
    const file=S.shareFile;
    if(file&&navigator.canShare&&navigator.canShare({files:[file]})){ await navigator.share({files:[file],text}); return; }
    if(navigator.share){ await navigator.share({text}); return; }
    await navigator.clipboard.writeText(text); toast('Copied. Paste it into WhatsApp.');
  }catch(e){
    if(!(e&&e.name==='AbortError')){ try{ await navigator.clipboard.writeText(text); toast('Copied. Paste it into WhatsApp.'); }catch(e2){ toast(text); } }
  }finally{ if(btn){ btn.disabled=false; btn.textContent='Share your score'; } }
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
  },
  /* Speed and Machines: desert sunset over a salt flat, with speed streaks */
  speed(c,w,h,r){
    const hz=h*(.6+r()*.06);
    const g=c.createLinearGradient(0,0,0,hz); g.addColorStop(0,'#2a1846'); g.addColorStop(.5,'#b8475a'); g.addColorStop(1,'#f4a259'); c.fillStyle=g; c.fillRect(0,0,w,hz);
    const sx=w*(.25+r()*.5), sr=Math.min(w,h)*(.16+r()*.06);
    const sg=c.createRadialGradient(sx,hz,0,sx,hz,sr*2.6); sg.addColorStop(0,'rgba(255,230,160,.65)'); sg.addColorStop(1,'rgba(255,200,120,0)'); c.fillStyle=sg; c.fillRect(0,0,w,hz);
    c.save(); c.beginPath(); c.rect(0,0,w,hz); c.clip();
    c.fillStyle='#ffd27a'; c.beginPath(); c.arc(sx,hz,sr,Math.PI,0); c.fill();
    c.fillStyle='#f4a259'; for(let i=0;i<4;i++){const y=hz-sr*(.12+i*.16), t=sr*(.05+i*.012); c.fillRect(sx-sr,y,sr*2,t);}
    const ranges=[['#7a3a5c',.16],['#4e2648',.1],['#2e1a38',.06]];
    ranges.forEach(([col,hh],k)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,hz);let x=0;
      while(x<=w){const y=hz-h*hh*(.4+r()*.9);c.lineTo(x,y);x+=w*(.05+r()*.09);}c.lineTo(w,hz);c.closePath();c.fill();});
    c.restore();
    const fg=c.createLinearGradient(0,hz,0,h); fg.addColorStop(0,'#e9c79a'); fg.addColorStop(1,'#a8795a'); c.fillStyle=fg; c.fillRect(0,hz,w,h-hz);
    c.strokeStyle='rgba(255,245,225,.35)'; c.lineWidth=1;
    for(let i=0;i<7;i++){const y=hz+(h-hz)*Math.pow((i+1)/8,1.6); c.beginPath(); c.moveTo(0,y); c.lineTo(w,y); c.stroke();}
    c.strokeStyle='rgba(120,70,50,.45)'; for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(sx+i*w*.02,hz);c.lineTo(sx+i*w*.35,h);c.stroke();}
    c.lineCap='round';
    for(let i=0;i<9;i++){const y=h*(.08+r()*.78), x0=r()*w*.6, len=w*(.15+r()*.4);
      const lg=c.createLinearGradient(x0,0,x0+len,0); lg.addColorStop(0,'rgba(255,245,225,0)'); lg.addColorStop(1,`rgba(255,245,225,${.25+r()*.35})`);
      c.strokeStyle=lg; c.lineWidth=1+r()*2.2; c.beginPath(); c.moveTo(x0,y); c.lineTo(x0+len,y); c.stroke();}
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
      <span class="dk-t"><span class="sc">Deck${p.ids.some(i=>isFresh(i)&&!P.done[i])?` \u00b7 <span class="dk-new">${p.ids.filter(i=>isFresh(i)&&!P.done[i]).length} new</span>`:''}</span><b>${esc(p.name)}</b></span>
      <span class="dk-m">${done===p.ids.length?'<span class="dk-done">Deck complete</span>':`<span>${done}/${p.ids.length} cards</span>`}<span class="dk-bar"><i style="width:${Math.round(done/p.ids.length*100)}%"></i></span></span>
      <span class="chev" aria-hidden="true"></span>
    </summary>
    <div class="dk-body"><p class="note">${esc(p.blurb)}</p>
      ${p.ids.map(i=>{const s=STORIES[i];return `<button class="row" data-open="${i}">${mini(i,!P.done[i])}<span><span class="t">${esc(s.title)}</span><br><span class="k">${esc(s.who.name)} · ${esc(s.year)}${requestedBy(i)?` · Requested by ${esc(requestedBy(i))}`:''}</span></span>${P.done[i]?'<span class="pill done">Collected</span>':isFresh(i)?'<span class="pill new">New</span>':'<span></span>'}</button>`}).join('')}
    </div>
  </details>`;
}

function renderHome(){
  const doneCount=ORDER.filter(i=>P.done[i]).length;
  const next=ORDER.find(i=>isFresh(i)&&!P.done[i]) || ORDER.find(i=>!P.done[i]) || ORDER[(new Date().getDate())%ORDER.length];
  const st=STORIES[next];
  const streak=currentStreak();
  const hand=ORDER.filter(i=>P.done[i]).slice(-4); while(hand.length<4) hand.push(null);
  app.innerHTML=`
  <div class="wrap">
    <header class="mast">
      ${BRAND_HTML}
      <p>One card from history, five minutes a day.</p>
    </header>
    <div id="otd">${otdHTML()}</div>
    ${rankBlock()}
    ${flashEntry()}
    <div class="stats" aria-label="Your progress">
      <span class="chip"><b>${streak}</b>-day streak</span>
      <span class="chip shield ${shieldReady()?'':'used'}" title="Miss one day a week without losing your streak">Streak shield ${shieldReady()?'ready':'used this week'}</span>
      <span class="chip"><b>${P.xp}</b> XP</span>
      <span class="chip"><b>${doneCount}</b> of ${ORDER.length} cards</span>
      <button class="chip snd" data-act="sound" aria-pressed="${SOUND}">${SOUND?'Sound on':'Sound off'}</button>
    </div>
    <section aria-labelledby="today">
      <p class="sc" id="today" style="margin:0 0 8px">${P.done[next]?'Draw again':'Today’s draw'}</p>
      <button class="feature" data-open="${next}">
        ${plate(next)}
        <div class="body">
          <h2>${esc(st.title)}</h2>
          <span class="kicker">Meet ${esc(st.who.name)}, ${esc(st.who.epithet.charAt(0).toLowerCase()+st.who.epithet.slice(1))}${requestedBy(next)?`. Requested by ${esc(requestedBy(next))}`:''}</span>
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
    <button class="link tl-link" data-go="timeline">
      <span><span class="sc">Your timeline</span><br>See where your cards sit in history</span>
      <span class="tl-spark" aria-hidden="true">${[...ORDER].sort((a,b)=>yearNum(a)-yearNum(b)).map(i=>`<i class="${P.done[i]?'on':''}"></i>`).join('')}</span>
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
    <p class="foot">${PROFILE&&!PROFILE.solo?`Playing as ${esc(PROFILE.name)} \u00b7 family code ${esc(PROFILE.code)}. `:'Playing solo. '}Progress is saved on this device${PROFILE&&!PROFILE.solo?' and to the family scoreboard':''}. <button class="textbtn" data-act="rejoin">${PROFILE&&!PROFILE.solo?'Change name or emblem':'Change'}</button> \u00b7 <button class="textbtn" data-act="howto">How to play</button></p>
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
    ${S.rankUp!=null?`<div class="rankup">${sealHTML(S.rankUp,84)}<span class="sc">Rank up!</span><b>You are now ${/^[AEIOU]/.test(RANKS[S.rankUp].name)?'an':'a'} ${esc(RANKS[S.rankUp].name)}</b><i>${esc(RANKS[S.rankUp].line)}</i></div>`:''}
    ${S.deckDone?`<p class="deckdone">You completed the ${esc(S.deckDone)} deck!</p>`:''}
    ${S.shieldUsed?'<p class="shieldnote">Your streak shield saved your streak. You get a new one on Monday.</p>':''}
    <span class="sc">Card collected</span>
    ${pcard(S.id,{big:true})}
    ${requestedBy(S.id)?`<p class="reqby">Requested by ${esc(requestedBy(S.id))}</p>`:''}
    <p class="score">${S.score} of ${st.quiz.length} correct · +${S.gained} XP · ${currentStreak()}-day streak</p>
    <div class="take"><span class="sc">The takeaway</span><p>${esc(st.take)}</p></div>
    <div class="finish-btns"><button class="cta ghost" data-act="share">Share your score</button><button class="cta" data-go="home">Back to the decks</button></div>
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
  else if(S.view==='ranks') renderRanks();
  else if(S.view==='flash') renderFlash();
  else if(S.view==='flashdone') renderFlashDone();
  else if(S.view==='timeline') renderTimeline();
  window.scrollTo(0,0);
  paintArt(app);
  maybeTour();
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
  const before=rankFor(cardsDone(P.done));
  const d=deckOf(S.id), deckWasDone=d.ids.every(i=>P.done[i]);
  const gained=S.score*10+(first?20:5);
  P.done[S.id]=true; addXP(gained); playedToday();
  const after=rankFor(cardsDone(P.done));
  S.rankUp = after>before ? after : null;
  S.deckDone = (!deckWasDone && d.ids.every(i=>P.done[i])) ? d.name : null;
  save(); S.gained=gained; S.view='done'; render(); pushProgress(); prepShare();
  if(S.rankUp!=null) SFX.rankup(); else SFX.collect();
}

app.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.open){ open(b.dataset.open); return; }
  if(b.dataset.go){ stopSpeech(); S.view=b.dataset.go; render(); return; }
  if(b.dataset.pick!==undefined && S.picked===null){
    S.picked=+b.dataset.pick; if(S.picked===curQ().a){ S.score++; SFX.right(); } else SFX.wrong(); render(); return;
  }
  if(b.dataset.emb){ PICKED_EMBLEM=b.dataset.emb; app.querySelectorAll('.emb').forEach(x=>{const on=x===b; x.classList.toggle('on',on); x.setAttribute('aria-pressed',on);}); return; }
  const a=b.dataset.act; const st=S.id&&STORIES[S.id];
  if(a==='sound'){ toggleSound(); b.textContent=SOUND?'Sound on':'Sound off'; b.setAttribute('aria-pressed',SOUND); return; }
  if(a==='share'){ shareScore(); return; }
  if(a==='howto'){ replayTour(); return; }
  if(a==='flash'){ startFlash(); return; }
  if(a==='fnext'){ if(S.fi<S.fq.length-1){ S.fi++; S.picked=null; render(); } else finishFlash(); return; }
  if(a==='tab-week'||a==='tab-all'){ SH.tab=a==='tab-week'?'week':'all'; refreshShared(); return; }
  if(a==='solo'){ PROFILE={solo:true}; saveProfile(PROFILE); location.reload(); return; }
  if(a==='rejoin'){ stopSpeech(); S.view='join'; render(); return; }
  if(a==='close'){ stopSpeech(); S.view='home'; render(); }
  else if(a==='prev'&&S.step>0){ S.step--; SFX.flip(); render(); if(S.listening) readCurrent(); }
  else if(a==='next'){
    if(S.step<st.cards.length-1){ S.step++; SFX.flip(); render(); if(S.listening) readCurrent(); }
    else { SFX.flip(); stopSpeech(); S.listening=false; S.view='quiz'; S.qi=0; S.picked=null; render(); }
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
    PROFILE={name,code,emblem:PICKED_EMBLEM||null}; saveProfile(PROFILE); location.reload(); return;
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
loadOnThisDay();
if('serviceWorker' in navigator){ window.addEventListener('load',()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); }); }
