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
