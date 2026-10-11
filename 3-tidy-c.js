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
