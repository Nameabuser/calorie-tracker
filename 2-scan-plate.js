/* Scan plate: photo -> Gemini (user's own key, kept in this phone's localStorage only) -> editable estimate -> log. */
(function(){
'use strict';
var KEY='gemkey',MODELS=['gemini-3.8-flash','gemini-3.5-flash-lite','gemini-2.5-flash'];
var API='https://generativelanguage.googleapis.com/v1beta/models/';
var items=[],meal='Lunch';
function gk(){try{return (localStorage.getItem(KEY)||'').trim();}catch(e){return '';}}
function E(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function num(v){v=Number(v);return isFinite(v)&&v>=0?v:0;}
function r1(v){return Math.round(v*10)/10;}
var st=document.createElement('style');
st.textContent='#sp-ov{position:fixed;inset:0;z-index:9999;background:var(--bg,#f4f8f5);color:var(--tx,#143d27);overflow:auto;-webkit-overflow-scrolling:touch;padding:max(16px,env(safe-area-inset-top)) 16px 40px}#sp-ov h2{margin:8px 0}#sp-ov .sp-row{border:1px solid var(--bd,#d5e3da);border-radius:14px;padding:12px;margin:10px 0;background:var(--cd,#fff)}#sp-ov input,#sp-ov select{width:100%;box-sizing:border-box;font-size:16px;min-height:44px;margin:4px 0}#sp-ov .sp-g{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}#sp-ov .sp-g label{font-size:12px}#sp-ov button{min-height:44px;font-size:16px;margin:6px 0}#sp-ov .sp-err{color:#b3261e;font-weight:600}#sp-ov .sp-est{font-size:13px;opacity:.8}.sp-card{margin:0 0 12px}.sp-card button{width:100%}';
document.head.appendChild(st);
function ov(){var o=document.getElementById('sp-ov');if(!o){o=document.createElement('div');o.id='sp-ov';document.body.appendChild(o);}return o;}
function close(){var o=document.getElementById('sp-ov');if(o)o.remove();}
window.spClose=close;
function msg(title,body,extra){
 ov().innerHTML='<h2>'+E(title)+'</h2><p class="'+(extra==='err'?'sp-err':'')+'">'+E(body)+'</p>'+(extra==='key'?'<button class="ch" onclick="spClose();go(3)">Open More to add key</button>':'')+'<button onclick="spClose()">Close</button>';
}
function shrink(file){
 return new Promise(function(res,rej){
  var u=URL.createObjectURL(file),im=new Image();
  im.onload=function(){
   var m=1280,s=Math.min(1,m/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');
   c.width=Math.max(1,Math.round(im.naturalWidth*s));c.height=Math.max(1,Math.round(im.naturalHeight*s));
   c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
   res(c.toDataURL('image/jpeg',0.85).split(',')[1]);
  };
  im.onerror=function(){URL.revokeObjectURL(u);rej(new Error('badimg'));};
  im.src=u;
 });
}
var PROMPT='You are a nutrition estimator. Look at this photo of a meal. List each distinct food or drink you can see (Indian dishes are common; name them as an Indian would, e.g. "Dal tadka", "Roti"). For each, estimate the portion in grams (or ml for drinks) and the total calories (kcal), protein, carbs and fat in grams for that portion. Be realistic, not optimistic. If there is no food in the photo, return an empty list. Reply ONLY with JSON: {"items":[{"name":string,"grams":number,"kcal":number,"protein":number,"carbs":number,"fat":number}]}';
function call(model,b64){
 var body={contents:[{parts:[{text:PROMPT},{inline_data:{mime_type:'image/jpeg',data:b64}}]}],generationConfig:{responseMimeType:'application/json',temperature:0.2}};
 return fetch(API+model+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':gk()},body:JSON.stringify(body)});
}
async function run(b64){
 var last=null;
 for(var i=0;i<MODELS.length;i++){
  var r=await call(MODELS[i],b64);
  if(r.ok)return r.json();
  last=r;
  if(r.status!==404&&r.status!==403||i===MODELS.length-1)break;
  /* 404 = model not available for this key; 403 may be key or model access - try next model once */
 }
 var e=new Error('http');e.status=last.status;throw e;
}
function parse(j){
 var t=j&&j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts;
 if(!t)throw new Error('empty');
 var s=t.map(function(p){return p.text||'';}).join('').replace(/^\s*```(?:json)?/i,'').replace(/```\s*$/,'').trim();
 var o=JSON.parse(s),a=Array.isArray(o)?o:o.items;
 if(!Array.isArray(a))throw new Error('shape');
 return a.slice(0,15).map(function(x){return {n:String(x.name||'Food').slice(0,60),g:num(x.grams),k:num(x.kcal),p:num(x.protein),c:num(x.carbs),f:num(x.fat)};}).filter(function(x){return x.k>0;});
}
function totals(){var t={k:0,p:0,c:0,f:0};items.forEach(function(x){t.k+=x.k;t.p+=x.p;t.c+=x.c;t.f+=x.f;});return t;}
function draw(){
 var o=ov(),t=totals();
 var h='<h2>Plate estimate</h2><p class="sp-est">AI estimate from a photo. Portions are rough, so check and edit before adding.</p>';
 if(!items.length)h+='<p>No food found. Try a clearer, closer photo.</p>';
 items.forEach(function(x,i){
  h+='<div class="sp-row"><input aria-label="Food name" value="'+E(x.n)+'" onchange="spSet('+i+',\'n\',this.value)"><div class="sp-g"><div><label>Grams</label><input type="number" inputmode="decimal" min="0" value="'+r1(x.g)+'" onchange="spSet('+i+',\'g\',this.value)"></div><div><label>kcal</label><input type="number" inputmode="decimal" min="0" value="'+Math.round(x.k)+'" onchange="spSet('+i+',\'k\',this.value)"></div><div><label>Protein</label><input type="number" inputmode="decimal" min="0" value="'+r1(x.p)+'" onchange="spSet('+i+',\'p\',this.value)"></div><div><label>Carbs</label><input type="number" inputmode="decimal" min="0" value="'+r1(x.c)+'" onchange="spSet('+i+',\'c\',this.value)"></div></div><div class="sp-g"><div><label>Fat</label><input type="number" inputmode="decimal" min="0" value="'+r1(x.f)+'" onchange="spSet('+i+',\'f\',this.value)"></div></div><button onclick="spDel('+i+')">Remove</button></div>';
 });
 if(items.length){
  var ms=(window.MEALS||['Breakfast','Lunch','Snack','Dinner']);
  h+='<p><strong>Total: '+Math.round(t.k)+' kcal</strong> · P '+r1(t.p)+' g · C '+r1(t.c)+' g · F '+r1(t.f)+' g</p><label for="sp-meal">Meal</label><select id="sp-meal" onchange="spMeal(this.value)">'+ms.map(function(m){return '<option'+(m===meal?' selected':'')+'>'+E(m)+'</option>';}).join('')+'</select><button class="ch" onclick="spLog()">Add to '+E(meal)+'</button>';
 }
 h+='<button onclick="spClose()">Cancel</button>';
 o.innerHTML=h;
}
window.spSet=function(i,f,v){
 var x=items[i];if(!x)return;
 if(f==='n'){x.n=String(v).slice(0,60);return;}
 v=num(v);
 if(f==='g'&&x.g>0&&v>0){var s=v/x.g;x.k*=s;x.p*=s;x.c*=s;x.f*=s;}
 x[f]=v;draw();
};
window.spDel=function(i){items.splice(i,1);draw();};
window.spMeal=function(m){meal=m;draw();};
window.spLog=function(){
 var d=today(),n=0;
 items.forEach(function(x){
  if(x.k<=0||!x.n.trim())return;
  var name=x.n.trim()+(x.g>0?' (est. '+Math.round(x.g)+' g)':' (est.)');
  add(name,Math.round(x.k),{p:r1(x.p),c:r1(x.c),f:r1(x.f)},{d:d,meal:meal});n++;
 });
 close();
 if(n)notify('Added '+n+' item'+(n>1?'s':'')+' (estimate)');
};
function pick(){
 if(!gk()){ov();msg('Add your Gemini key','Scan plate needs your own free Gemini key. Paste it once in More, under "Scan plate (Gemini key)". It stays on this phone only.','key');return;}
 var inp=document.getElementById('sp-file');
 if(!inp){inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.id='sp-file';inp.style.display='none';document.body.appendChild(inp);
  inp.addEventListener('change',function(){var f=inp.files&&inp.files[0];inp.value='';if(f)scan(f);});}
 inp.click();
}
async function scan(file){
 if(!navigator.onLine){msg('No internet','Scan plate needs a connection. Try again when you are online, or log manually.','err');return;}
 msg('Reading your plate...','This takes a few seconds.');
 try{
  var b64=await shrink(file),j=await run(b64);
  items=parse(j);meal=(typeof defaultMeal==='function'?defaultMeal():'Lunch');draw();
 }catch(e){
  if(e&&e.status===429)msg('Free limit reached','Gemini says too many requests (per-minute or daily free limit). Wait a bit and try later, or log manually.','err');
  else if(e&&(e.status===400||e.status===401||e.status===403))msg('Key not accepted','Gemini rejected the key or request. Check the key in More > Scan plate, then try again.','err');
  else if(e&&e.status===404)msg('Model unavailable','None of the Gemini models responded for this key. Try again later.','err');
  else if(e&&e.status)msg('Gemini error','Gemini returned an error ('+e.status+'). Try again later, or log manually.','err');
  else if(e&&e.message==='badimg')msg('Photo problem','Could not read that photo. Try another one.','err');
  else if(e instanceof TypeError)msg('No internet','Could not reach Gemini. Check your connection and try again.','err');
  else msg('Could not read the result','The estimate came back in an unexpected form. Try again with a clearer photo.','err');
 }
}
window.spPick=pick;
window.spSaveKey=function(){var v=(document.getElementById('sp-key')||{}).value||'';v=v.trim();if(!v)return;try{localStorage.setItem(KEY,v);}catch(e){alert('Could not save the key on this phone.');return;}notify('Gemini key saved on this phone');R();};
window.spClearKey=function(){try{localStorage.removeItem(KEY);}catch(e){}notify('Gemini key removed');R();};
var prev=window.R;
window.R=function(){
 prev();
 var app=document.getElementById('app');if(!app)return;
 if(P===1&&!document.getElementById('sp-card')){
  var c=document.createElement('div');c.id='sp-card';c.className='sp-card';
  c.innerHTML='<button class="ch" onclick="spPick()">Scan plate (AI estimate)</button>';
  var h2=app.querySelector('h2');if(h2)h2.after(c);else app.insertBefore(c,app.firstChild);
 }
 if(P===3&&!document.getElementById('sp-keycard')){
  var k=document.createElement('div');k.id='sp-keycard';k.className='c';
  var has=!!gk();
  k.innerHTML='<h3>Scan plate (Gemini key)</h3><p class="note">'+(has?'A key is saved on this phone.':'No key saved yet.')+' Get a free key at aistudio.google.com. It is stored only on this phone, never in backups or online, and is sent only to Google when you scan.</p><input id="sp-key" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Paste Gemini key"><button onclick="spSaveKey()">Save key</button>'+(has?'<button onclick="spClearKey()">Remove key</button>':'');
  var cards=Array.from(app.querySelectorAll('.c')),safe=cards.find(function(e){var h=e.querySelector('h3');return h&&h.textContent==='Keep your data safe';});
  if(safe)app.insertBefore(k,safe);else app.appendChild(k);
 }
};
R();
})();
