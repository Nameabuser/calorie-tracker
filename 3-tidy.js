/* UI tidy pass: protein level control, compact More, tidy Today nutrition, friendlier History. Data and handlers unchanged. */
(function(){
'use strict';
var openDays={};
var st=document.createElement('style');
st.textContent='.seg{position:relative;display:grid;grid-template-columns:repeat(3,1fr);background:var(--in,#e8f0ea);border-radius:12px;padding:3px;margin:8px 0}.seg-hl{position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px)/3);background:#1b7f4b;border-radius:10px;transition:transform .22s ease;transform:translateX(calc(var(--i,0)*100%))}.seg button{position:relative;z-index:1;background:transparent!important;border:0!important;box-shadow:none!important;margin:0!important;min-height:40px;padding:6px 2px;font-size:14px;font-weight:600;color:var(--tx,#143d27)}.seg button.on{color:#fff!important}'
+'.bk-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.bk-row button{background:var(--in,#e8f0ea)!important;color:#167b49!important;border:1px solid var(--bd,#d5e3da)!important;border-radius:12px;font-weight:700;margin:0!important;min-height:42px;font-size:14px;padding:6px 4px}.bk-tiny{font-size:12px;color:var(--mu,#5f7a6a);margin:8px 0 0}.bk-file{font-size:13px!important;padding:6px!important;min-height:0!important;margin-top:6px}.foot{font-size:12px;color:var(--mu,#5f7a6a);text-align:center;margin:6px 4px 90px}'
+'.micro small.dim{display:none}.metrics strong.dash{opacity:.45}'
+'.hx-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:4px 0 8px}.hx-top h2{margin:0;font-size:22px}.hx-top .seg{margin:0;width:190px}.hx-top .seg button{white-space:nowrap}.hx-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}.hx-sum div{background:var(--cd,#fff);border:1px solid var(--bd,#d5e3da);border-radius:12px;padding:8px 6px;text-align:center}.hx-sum strong{display:block;font-size:17px}.hx-sum small{font-size:11px;color:var(--mu,#5f7a6a)}'
+'details.hx-day{background:var(--cd,#fff);border:1px solid var(--bd,#d5e3da);border-radius:12px;margin:6px 0;padding:0 12px}.hx-day>summary{text-align:left;align-items:stretch;list-style:none;min-height:50px;display:flex;flex-direction:column;justify-content:center;cursor:pointer;padding:6px 0}.hx-day>summary::-webkit-details-marker{display:none}.hx-d{display:flex;justify-content:space-between;width:100%;text-align:left;font-weight:700;font-size:15px}.hx-m{font-size:12px;color:var(--mu,#5f7a6a)}.hx-e{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--bd,#d5e3da);font-size:14px}.hx-e small{color:var(--mu,#5f7a6a)}.hx-e button{min-height:34px;padding:4px 10px;font-size:13px;margin:0}.hx-more{margin:10px 0}.hx-more>summary{font-weight:700;min-height:44px;display:flex;align-items:center;cursor:pointer}.hx-more .rep{box-shadow:none;border:0;padding:0}.hx-empty{padding:20px 4px;color:var(--mu,#5f7a6a)}';
st.textContent+='html,body,button,input,select,a,[role=button],.portion-step{touch-action:manipulation}.protein-level-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0}.protein-level-row label{font-weight:600;font-size:15px}.protein-level-row select{flex:0 1 62%;width:auto;min-width:0;min-height:44px;padding:8px 36px 8px 12px;border:1px solid var(--bd,#dce9df);border-radius:12px;background-color:var(--in,#eaf2ec);color:var(--tx,#173b27);font:inherit;font-size:15px}';
document.head.appendChild(st);
function E(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function cardByTitle(t){return Array.from(document.querySelectorAll('#app .c')).find(function(e){var h=e.querySelector('h3');return h&&h.textContent===t;});}
window.segPick=function(btn,level,i){var s=btn.parentNode;s.style.setProperty('--i',i);Array.from(s.children).forEach(function(b){b.classList.remove('on');});btn.classList.add('on');setTimeout(function(){chooseProteinLevel(level);},200);};
function tidyToday(){
 var gr=cardByTitle('Goal rings');if(gr){var gn=gr.querySelector('.note');if(gn){gn.textContent='Protein counts entries with recorded macros.';gn.classList.add('short');}}
 var nd=document.querySelector('.nutrition-details>.note');if(nd)nd.remove();
 var m=cardByTitle('Macros');if(m){var n=m.querySelector('.note');if(n){n.textContent='Counts entries with macros only.';n.classList.add('short');}}
 var u=cardByTitle('Micronutrients');
 if(u){var n2=u.querySelector('.note');if(n2){n2.textContent='Known subtotals only, not a full daily total.';n2.classList.add('short');}
  u.querySelectorAll('.micro>div').forEach(function(d){var s=d.querySelector('strong'),sm=d.querySelectorAll('small');if(s&&s.textContent==='Unknown'){s.textContent='-';s.classList.add('dash');if(sm[1])sm[1].classList.add('dim');}else if(sm[1]){sm[1].textContent=sm[1].textContent.replace(' have data',' logged');}});}
}
function tidyMore(){
 var box=document.getElementById('protein-level-options');
 if(box){
  var names=['Lower','Medium','Higher'],rates=['1.2','1.6','1.8'];
  var level=window.D&&window.D.proteinLevel&&names.indexOf(window.D.proteinLevel)>=0?window.D.proteinLevel:'Higher';
  var h='<div class="protein-level-row"><label for="protein-level-select">Protein level</label><select id="protein-level-select" aria-label="Protein level" onchange="chooseProteinLevel(this.value)">'+names.map(function(n,i){return '<option value="'+n+'"'+(n===level?' selected':'')+'>'+n+' ('+rates[i]+' g/kg)</option>';}).join('')+'</select></div>';
  box.innerHTML=h;
 }
 var safe=cardByTitle('Keep your data safe');
 if(safe&&!safe.querySelector('.bk-row')){
  var bs=Array.from(safe.querySelectorAll(':scope>button')),lab={'Download backup':'Download','Backup (copy)':'Copy','Restore from text':'Restore'};
  var row=document.createElement('div');row.className='bk-row';
  bs.forEach(function(b){var t=lab[b.textContent.trim()];if(t)b.textContent=t;row.appendChild(b);});
  var h3=safe.querySelector('h3');h3.after(row);
  var l=safe.querySelector('label[for=restore]');if(l){l.style.fontSize='12px';l.textContent='Restore from a backup file';}
  var f=safe.querySelector('#restore');if(f)f.classList.add('bk-file');
  var n=safe.querySelector('.note');if(n){n.className='bk-tiny';n.textContent='Saved only on this phone. Back up before clearing data or changing phones.';}
 }
 var about=cardByTitle('About');
 if(about){var p=document.createElement('p');p.className='foot';p.textContent='Calories v3.4 · IST · values are estimates, not medical advice';about.replaceWith(p);}
}
function tidyHistory(){
 var app=document.getElementById('app'),rep=app.querySelector('.c.rep');if(!rep||app.querySelector('.hx-top'))return;
 var n=typeof reportRange!=='undefined'?reportRange:7;
 var dates=[];for(var i=0;i<n;i++)dates.push(days(-i));
 var logged=dates.filter(function(d){return D.m.some(function(x){return x.d===d;});});
 var sum=logged.reduce(function(a,d){return a+tot(d);},0);
 var pAvg=0;if(logged.length){var ps=logged.reduce(function(a,d){return a+macros(d).p;},0);pAvg=Math.round(ps/logged.length);}
 var seg='<div class="seg" style="grid-template-columns:repeat(2,1fr);--i:'+(n===30?1:0)+'"><span class="seg-hl" style="width:calc((100% - 6px)/2)"></span><button class="'+(n===7?'on':'')+'" onclick="setReportRange(7)" style="grid-column:1">7 days</button><button class="'+(n===30?'on':'')+'" onclick="setReportRange(30)" style="grid-column:2">30 days</button></div>';
 var h='<div class="hx-top"><h2>History</h2>'+seg+'</div>';
 h+='<div class="hx-sum"><div><strong>'+logged.length+'/'+n+'</strong><small>days logged</small></div><div><strong>'+(logged.length?Math.round(sum/logged.length):'-')+'</strong><small>kcal / logged day</small></div><div><strong>'+(logged.length?pAvg+' g':'-')+'</strong><small>protein / day</small></div></div>';
 if(!logged.length)h+='<p class="hx-empty">Nothing logged in this period yet.</p>';
 logged.forEach(function(d){
  var es=D.m.filter(function(x){return x.d===d;}),m=macros(d),hasM=es.some(function(x){return x.mac;});
  var label=new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'});
  h+='<details class="hx-day" data-d="'+d+'"'+(openDays[d]?' open':'')+'><summary><span class="hx-d"><span>'+E(d===today()?'Today':label)+'</span><span>'+tot(d)+' kcal</span></span><span class="hx-m">'+(hasM?'P '+Math.round(m.p)+' · C '+Math.round(m.c)+' · F '+Math.round(m.f)+' g':'Macros not recorded')+' · '+es.length+' item'+(es.length>1?'s':'')+'</span></summary>';
  es.forEach(function(x){h+='<div class="hx-e"><span>'+E(x.n)+'<br><small>'+E(x.meal||'Unsorted')+' · '+x.k+' kcal</small></span><button class="x" aria-label="Delete '+E(x.n)+'" onclick="del('+x.i+')">Delete</button></div>';});
  h+='</details>';
 });
 var wrap=document.createElement('div');wrap.innerHTML=h;
 var more=document.createElement('details');more.className='hx-more';more.innerHTML='<summary>Charts & nutrient report</summary>';
 var oldH2=app.querySelector('h2');
 rep.querySelectorAll('.f').forEach(function(f){f.remove();});
 more.appendChild(rep);
 if(oldH2)oldH2.remove();
 app.insertBefore(more,app.firstChild);
 Array.from(wrap.childNodes).reverse().forEach(function(c){app.insertBefore(c,app.firstChild);});
 app.querySelectorAll('details.hx-day').forEach(function(dt){dt.addEventListener('toggle',function(){openDays[dt.getAttribute('data-d')]=dt.open;});});
}
var prev=window.R;
window.R=function(){
 prev();
 if(P===0)tidyToday();
(function(){
'use strict';
var openDays={};
var st=document.createElement('style');
st.textContent='.seg{position:relative;display:grid;grid-template-columns:repeat(3,1fr);background:var(--in,#e8f0ea);border-radius:12px;padding:3px;margin:8px 0}.seg-hl{position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px)/3);background:#1b7f4b;border-radius:10px;transition:transform .22s ease;transform:translateX(calc(var(--i,0)*100%))}.seg button{position:relative;z-index:1;background:transparent!important;border:0!important;box-shadow:none!important;margin:0!important;min-height:40px;padding:6px 2px;font-size:14px;font-weight:600;color:var(--tx,#143d27)}.seg button.on{color:#fff!important}'
+'.bk-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.bk-row button{background:var(--in,#e8f0ea)!important;color:#167b49!important;border:1px solid var(--bd,#d5e3da)!important;border-radius:12px;font-weight:700;margin:0!important;min-height:42px;font-size:14px;padding:6px 4px}.bk-tiny{font-size:12px;color:var(--mu,#5f7a6a);margin:8px 0 0}.bk-file{font-size:13px!important;padding:6px!important;min-height:0!important;margin-top:6px}.foot{font-size:12px;color:var(--mu,#5f7a6a);text-align:center;margin:6px 4px 90px}'
+'.micro small.dim{display:none}.metrics strong.dash{opacity:.45}'
+'.hx-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:4px 0 8px}.hx-top h2{margin:0;font-size:22px}.hx-top .seg{margin:0;width:190px}.hx-top .seg button{white-space:nowrap}.hx-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}.hx-sum div{background:var(--cd,#fff);border:1px solid var(--bd,#d5e3da);border-radius:12px;padding:8px 6px;text-align:center}.hx-sum strong{display:block;font-size:17px}.hx-sum small{font-size:11px;color:var(--mu,#5f7a6a)}'
+'details.hx-day{background:var(--cd,#fff);border:1px solid var(--bd,#d5e3da);border-radius:12px;margin:6px 0;padding:0 12px}.hx-day>summary{text-align:left;align-items:stretch;list-style:none;min-height:50px;display:flex;flex-direction:column;justify-content:center;cursor:pointer;padding:6px 0}.hx-day>summary::-webkit-details-marker{display:none}.hx-d{display:flex;justify-content:space-between;width:100%;text-align:left;font-weight:700;font-size:15px}.hx-m{font-size:12px;color:var(--mu,#5f7a6a)}.hx-e{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--bd,#d5e3da);font-size:14px}.hx-e small{color:var(--mu,#5f7a6a)}.hx-e button{min-height:34px;padding:4px 10px;font-size:13px;margin:0}.hx-more{margin:10px 0}.hx-more>summary{font-weight:700;min-height:44px;display:flex;align-items:center;cursor:pointer}.hx-more .rep{box-shadow:none;border:0;padding:0}.hx-empty{padding:20px 4px;color:var(--mu,#5f7a6a)}';
st.textContent+='html,body,button,input,select,a,[role=button],.portion-step{touch-action:manipulation}.protein-level-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0}.protein-level-row label{font-weight:600;font-size:15px}.protein-level-row select{flex:0 1 62%;width:auto;min-width:0;min-height:44px;padding:8px 36px 8px 12px;border:1px solid var(--bd,#dce9df);border-radius:12px;background-color:var(--in,#eaf2ec);color:var(--tx,#173b27);font:inherit;font-size:15px}';
document.head.appendChild(st);
function E(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function cardByTitle(t){return Array.from(document.querySelectorAll('#app .c')).find(function(e){var h=e.querySelector('h3');return h&&h.textContent===t;});}
window.segPick=function(btn,level,i){var s=btn.parentNode;s.style.setProperty('--i',i);Array.from(s.children).forEach(function(b){b.classList.remove('on');});btn.classList.add('on');setTimeout(function(){chooseProteinLevel(level);},200);};
function tidyToday(){
 var gr=cardByTitle('Goal rings');if(gr){var gn=gr.querySelector('.note');if(gn){gn.textContent='Protein counts entries with recorded macros.';gn.classList.add('short');}}
 var nd=document.querySelector('.nutrition-details>.note');if(nd)nd.remove();
 var m=cardByTitle('Macros');if(m){var n=m.querySelector('.note');if(n){n.textContent='Counts entries with macros only.';n.classList.add('short');}}
 var u=cardByTitle('Micronutrients');
 if(u){var n2=u.querySelector('.note');if(n2){n2.textContent='Known subtotals only, not a full daily total.';n2.classList.add('short');}
  u.querySelectorAll('.micro>div').forEach(function(d){var s=d.querySelector('strong'),sm=d.querySelectorAll('small');if(s&&s.textContent==='Unknown'){s.textContent='-';s.classList.add('dash');if(sm[1])sm[1].classList.add('dim');}else if(sm[1]){sm[1].textContent=sm[1].textContent.replace(' have data',' logged');}});}
}
function tidyMore(){
 var box=document.getElementById('protein-level-options');
 if(box){
  var names=['Lower','Medium','Higher'],rates=['1.2','1.6','1.8'];
  var level=window.D&&window.D.proteinLevel&&names.indexOf(window.D.proteinLevel)>=0?window.D.proteinLevel:'Higher';
  var h='<div class="protein-level-row"><label for="protein-level-select">Protein level</label><select id="protein-level-select" aria-label="Protein level" onchange="chooseProteinLevel(this.value)">'+names.map(function(n,i){return '<option value="'+n+'"'+(n===level?' selected':'')+'>'+n+' ('+rates[i]+' g/kg)</option>';}).join('')+'</select></div>';
  box.innerHTML=h;
 }
 var safe=cardByTitle('Keep your data safe');
 if(safe&&!safe.querySelector('.bk-row')){
  var bs=Array.from(safe.querySelectorAll(':scope>button')),lab={'Download backup':'Download','Backup (copy)':'Copy','Restore from text':'Restore'};
  var row=document.createElement('div');row.className='bk-row';
  bs.forEach(function(b){var t=lab[b.textContent.trim()];if(t)b.textContent=t;row.appendChild(b);});
  var h3=safe.querySelector('h3');h3.after(row);
  var l=safe.querySelector('label[for=restore]');if(l){l.style.fontSize='12px';l.textContent='Restore from a backup file';}
  var f=safe.querySelector('#restore');if(f)f.classList.add('bk-file');
  var n=safe.querySelector('.note');if(n){n.className='bk-tiny';n.textContent='Saved only on this phone. Back up before clearing data or changing phones.';}
 }
 var about=cardByTitle('About');
 if(about){var p=document.createElement('p');p.className='foot';p.textContent='Calories v3.4 · IST · values are estimates, not medical advice';about.replaceWith(p);}
}
function tidyHistory(){
 var app=document.getElementById('app'),rep=app.querySelector('.c.rep');if(!rep||app.querySelector('.hx-top'))return;
 var n=typeof reportRange!=='undefined'?reportRange:7;
 var dates=[];for(var i=0;i<n;i++)dates.push(days(-i));
 var logged=dates.filter(function(d){return D.m.some(function(x){return x.d===d;});});
 var sum=logged.reduce(function(a,d){return a+tot(d);},0);
 var pAvg=0;if(logged.length){var ps=logged.reduce(function(a,d){return a+macros(d).p;},0);pAvg=Math.round(ps/logged.length);}
 var seg='<div class="seg" style="grid-template-columns:repeat(2,1fr);--i:'+(n===30?1:0)+'"><span class="seg-hl" style="width:calc((100% - 6px)/2)"></span><button class="'+(n===7?'on':'')+'" onclick="setReportRange(7)" style="grid-column:1">7 days</button><button class="'+(n===30?'on':'')+'" onclick="setReportRange(30)" style="grid-column:2">30 days</button></div>';
 var h='<div class="hx-top"><h2>History</h2>'+seg+'</div>';
 h+='<div class="hx-sum"><div><strong>'+logged.length+'/'+n+'</strong><small>days logged</small></div><div><strong>'+(logged.length?Math.round(sum/logged.length):'-')+'</strong><small>kcal / logged day</small></div><div><strong>'+(logged.length?pAvg+' g':'-')+'</strong><small>protein / day</small></div></div>';
 if(!logged.length)h+='<p class="hx-empty">Nothing logged in this period yet.</p>';
 logged.forEach(function(d){
  var es=D.m.filter(function(x){return x.d===d;}),m=macros(d),hasM=es.some(function(x){return x.mac;});
  var label=new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'});
  h+='<details class="hx-day" data-d="'+d+'"'+(openDays[d]?' open':'')+'><summary><span class="hx-d"><span>'+E(d===today()?'Today':label)+'</span><span>'+tot(d)+' kcal</span></span><span class="hx-m">'+(hasM?'P '+Math.round(m.p)+' · C '+Math.round(m.c)+' · F '+Math.round(m.f)+' g':'Macros not recorded')+' · '+es.length+' item'+(es.length>1?'s':'')+'</span></summary>';
  es.forEach(function(x){h+='<div class="hx-e"><span>'+E(x.n)+'<br><small>'+E(x.meal||'Unsorted')+' · '+x.k+' kcal</small></span><button class="x" aria-label="Delete '+E(x.n)+'" onclick="del('+x.i+')">Delete</button></div>';});
  h+='</details>';
 });
 var wrap=document.createElement('div');wrap.innerHTML=h;
 var more=document.createElement('details');more.className='hx-more';more.innerHTML='<summary>Charts & nutrient report</summary>';
 var oldH2=app.querySelector('h2');
 rep.querySelectorAll('.f').forEach(function(f){f.remove();});
 more.appendChild(rep);
 if(oldH2)oldH2.remove();
 app.insertBefore(more,app.firstChild);
 Array.from(wrap.childNodes).reverse().forEach(function(c){app.insertBefore(c,app.firstChild);});
 app.querySelectorAll('details.hx-day').forEach(function(dt){dt.addEventListener('toggle',function(){openDays[dt.getAttribute('data-d')]=dt.open;});});
}
var prev=window.R;
window.R=function(){
 prev();
 if(P===0)tidyToday();
 if(P===3)tidyMore();
 if(P===2)tidyHistory();
};
R();
})();
/* Edit existing logs in place. Optional portion metadata is backward compatible. */
(function(){
'use strict';
var original=null,draft=null,amount=1,unit='servings';
function round(n){return Math.round(n*100)/100;}
function close(){var el=document.getElementById('ed-ov');if(el)el.remove();original=draft=null;}
window.edClose=close;
var style=document.createElement('style');style.textContent='#ed-ov{position:fixed;inset:0;z-index:9999;background:var(--bg,#f4f8f5);color:var(--tx,#143d27);overflow:auto;padding:max(16px,env(safe-area-inset-top)) 16px 100px;-webkit-overflow-scrolling:touch}#ed-ov .ed-card{max-width:520px;margin:auto}#ed-ov h2{font-size:24px}#ed-ov label{display:block;font-size:13px;margin:10px 0 4px}#ed-ov input,#ed-ov select{width:100%;font-size:16px;min-height:44px;box-sizing:border-box}#ed-ov .ed-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}#ed-ov .ed-actions{display:flex;gap:10px;margin-top:18px}#ed-ov .ed-actions button{flex:1;min-height:46px}.entry-edit{border:0;background:transparent;color:inherit;text-align:left;font:inherit;padding:0;flex:1;min-width:0;min-height:44px;margin:0}.entry-edit small{color:var(--mu,#5f7a6a)}';document.head.appendChild(style);
window.edOpen=function(id){
 var x=D.m.find(function(y){return String(y.i)===String(id);});if(!x)return;
 original=JSON.parse(JSON.stringify(x));draft=JSON.parse(JSON.stringify(x));
 var match=x.n.match(/(?:est\.\s*)?(\d+(?:\.\d+)?)\s*g\)/i);
 unit=x.portion&&x.portion.unit==='g'?'g':match?'g':'servings';
 amount=x.portion&&x.portion.value>0?x.portion.value:match?Number(match[1]):1;
 var el=document.createElement('div');el.id='ed-ov';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','ed-title');
 el.innerHTML='<div class="ed-card"><h2 id="ed-title">Edit food</h2><label for="ed-name">Food name</label><input id="ed-name" maxlength="100" value="'+esc(x.n)+'"><div class="ed-grid"><div><label for="ed-amount">'+(unit==='g'?'Grams':'Servings')+'</label><input id="ed-amount" type="number" inputmode="decimal" min="0.01" step="any" value="'+amount+'"></div><div><label for="ed-meal">Meal</label><select id="ed-meal">'+MEALS.map(function(m){return '<option'+(m===(x.meal||'Unsorted')?' selected':'')+'>'+esc(m)+'</option>';}).join('')+'</select></div></div><p class="note">Changing the amount scales recorded nutrition. Or edit the values below.</p><div class="ed-grid">'+[['k','Calories (kcal)'],['p','Protein (g)'],['c','Carbs (g)'],['f','Fat (g)']].map(function(a){var v=a[0]==='k'?x.k:x.mac?x.mac[a[0]]:'';return '<div><label for="ed-'+a[0]+'">'+a[1]+'</label><input id="ed-'+a[0]+'" type="number" inputmode="decimal" min="0" step="any" value="'+v+'" placeholder="Not recorded"></div>';}).join('')+'</div><p class="note">Leave all macro fields blank if unknown. Original date stays '+esc(x.d)+'.</p><div class="ed-actions"><button class="ch" onclick="edSave()">Save changes</button><button onclick="edClose()">Cancel</button></div></div>';
 var old=document.getElementById('ed-ov');if(old)old.remove();document.body.appendChild(el);
 document.getElementById('ed-amount').addEventListener('change',function(){
  var next=Number(this.value);if(!(next>0)||!isFinite(next)){this.value=amount;return;}
  var factor=next/amount;
  ['k','p','c','f'].forEach(function(f){var e=document.getElementById('ed-'+f);if(e.value.trim()!=='')e.value=round(Number(e.value)*factor);});
  if(draft.micro)Object.keys(draft.micro).forEach(function(f){draft.micro[f]=round(draft.micro[f]*factor);});
  var name=document.getElementById('ed-name');if(unit==='g')name.value=name.value.replace(/((?:est\.\s*)?)\d+(?:\.\d+)?\s*g\)/i,'$1'+round(next)+' g)');
  amount=next;
 });
};
window.edSave=function(){
 if(!draft)return;
 var n=document.getElementById('ed-name').value.trim(),k=Number(document.getElementById('ed-k').value),meal=document.getElementById('ed-meal').value;
 var vals=['p','c','f'].map(function(f){return document.getElementById('ed-'+f).value.trim();}),mac;
 if(vals.some(Boolean)){if(vals.some(function(v){return v===''||!isFinite(Number(v))||Number(v)<0||Number(v)>2000;})){alert('Fill all macros (0-2000 g), or leave all blank if unknown.');return;}mac={p:Number(vals[0]),c:Number(vals[1]),f:Number(vals[2])};}
 if(!n||n.length>100||!isFinite(k)||k<1||k>10000||!MEALS.includes(meal)||!validMicro(draft.micro)){alert('Check the name, calories (1-10000) and portion size. Nothing changed.');return;}
 var idx=D.m.findIndex(function(x){return x.i===original.i;});if(idx<0){close();return;}
 var updated=Object.assign({},draft,{n:n,k:Math.round(k),meal:meal,portion:{unit:unit,value:amount}});
 if(mac)updated.mac=mac;else delete updated.mac;
 D.m[idx]=updated;
 if(sv()){close();notify('Food updated');}
};
var prev=window.R;
window.R=function(){prev();
 if(P===0){document.querySelectorAll('.swipe-wrap').forEach(function(w){var span=w.querySelector('.swipe-row>span');if(!span)return;span.className='entry-edit';span.setAttribute('role','button');span.setAttribute('tabindex','0');span.setAttribute('aria-label','Edit '+span.textContent);span.onclick=function(){if(!w.querySelector('.swipe-row').classList.contains('revealed'))edOpen(w.getAttribute('data-entry'));};span.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();edOpen(w.getAttribute('data-entry'));}};});
 var note=Array.from(document.querySelectorAll('#app p.note')).find(function(e){return e.textContent.indexOf('Swipe a food left')===0;});if(note)note.textContent='Tap a food to edit. Swipe left to delete.';
 }
 if(P===2){document.querySelectorAll('.hx-e').forEach(function(row){var span=row.querySelector(':scope>span'),del=row.querySelector('button[onclick]');if(!span||!del)return;var match=del.getAttribute('onclick').match(/del\(([^)]+)\)/);if(!match)return;var b=document.createElement('button');b.className='entry-edit';b.innerHTML=span.innerHTML;b.setAttribute('aria-label','Edit '+span.textContent);b.onclick=function(){edOpen(match[1]);};span.replaceWith(b);});}
};
R();
})();
