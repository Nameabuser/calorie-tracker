/* UI tidy pass: segmented protein control, compact More, tidy Today nutrition, friendlier History. Data and handlers unchanged. */
(function(){
'use strict';
var openDays={};
var st=document.createElement('style');
st.textContent='.seg{position:relative;display:grid;grid-template-columns:repeat(3,1fr);background:var(--in,#e8f0ea);border-radius:12px;padding:3px;margin:8px 0}.seg-hl{position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px)/3);background:#1b7f4b;border-radius:10px;transition:transform .22s ease;transform:translateX(calc(var(--i,0)*100%))}.seg button{position:relative;z-index:1;background:transparent!important;border:0!important;box-shadow:none!important;margin:0!important;min-height:40px;padding:6px 2px;font-size:14px;font-weight:600;color:var(--tx,#143d27)}.seg button.on{color:#fff!important}'
+'.bk-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.bk-row button{background:var(--in,#e8f0ea)!important;color:#167b49!important;border:1px solid var(--bd,#d5e3da)!important;border-radius:12px;font-weight:700;margin:0!important;min-height:42px;font-size:14px;padding:6px 4px}.bk-tiny{font-size:12px;color:var(--mu,#5f7a6a);margin:8px 0 0}.bk-file{font-size:13px!important;padding:6px!important;min-height:0!important;margin-top:6px}.foot{font-size:12px;color:var(--mu,#5f7a6a);text-align:center;margin:6px 4px 90px}'
+'.nutrition-details .note.short{font-size:12px;margin:2px 0 8px}.micro small.dim{display:none}.metrics strong.dash{opacity:.45}'
+'.hx-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:4px 0 8px}.hx-top h2{margin:0;font-size:22px}.hx-top .seg{margin:0;width:190px}.hx-top .seg button{white-space:nowrap}.hx-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}.hx-sum div{background:var(--cd,#fff);border:1px solid var(--bd,#d5e3da);border-radius:12px;padding:8px 6px;text-align:center}.hx-sum strong{display:block;font-size:17px}.hx-sum small{font-size:11px;color:var(--mu,#5f7a6a)}'
+'details.hx-day{background:var(--cd,#fff);border:1px solid var(--bd,#d5e3da);border-radius:12px;margin:6px 0;padding:0 12px}.hx-day>summary{text-align:left;align-items:stretch;list-style:none;min-height:50px;display:flex;flex-direction:column;justify-content:center;cursor:pointer;padding:6px 0}.hx-day>summary::-webkit-details-marker{display:none}.hx-d{display:flex;justify-content:space-between;width:100%;text-align:left;font-weight:700;font-size:15px}.hx-m{font-size:12px;color:var(--mu,#5f7a6a)}.hx-e{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--bd,#d5e3da);font-size:14px}.hx-e small{color:var(--mu,#5f7a6a)}.hx-e button{min-height:34px;padding:4px 10px;font-size:13px;margin:0}.hx-more{margin:10px 0}.hx-more>summary{font-weight:700;min-height:44px;display:flex;align-items:center;cursor:pointer}.hx-more .rep{box-shadow:none;border:0;padding:0}.hx-empty{padding:20px 4px;color:var(--mu,#5f7a6a)}';
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
 if(box&&!box.querySelector('.seg')){
  var btns=Array.from(box.querySelectorAll('button')),idx=Math.max(0,btns.findIndex(function(b){return b.classList.contains('active');}));
  var names=['Lower','Medium','Higher'],rates=['1.2','1.6','1.8'];
  var h='<div class="seg" role="group" aria-label="Automatic protein level" style="--i:'+idx+'"><span class="seg-hl"></span>'+names.map(function(n,i){return '<button class="'+(i===idx?'on':'')+'" aria-pressed="'+(i===idx)+'" onclick="segPick(this,\''+n+'\','+i+')">'+n+' '+rates[i]+'</button>';}).join('')+'</div>';
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
 try{
  if(P===0)tidyToday();
  if(P===3)tidyMore();
  if(P===2)tidyHistory();
 }catch(e){}
};
R();
})();
