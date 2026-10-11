/* Usability pass. Saved data, food sources and cam-v7 remain unchanged. */
(function(){
'use strict';
window.UX_BUILD='easy-v1';
var draft=null,baseR=R,baseGo=go,baseRenderFood=renderFood,baseOpenReview=openReview;
function defaultMeal(date){
 var h=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',hourCycle:'h23'}).format(date||new Date()));
 return h<11?'Breakfast':h<16?'Lunch':h<19?'Snack':'Dinner';
}
window.defaultMeal=defaultMeal;
function capture(){
 var d=document.getElementById('date'),m=document.getElementById('meal'),q=document.getElementById('q');
 if(P===1&&d&&m)draft={d:d.value,meal:m.value,q:q.value,open:document.getElementById('serving').open};
}
window.go=function(p){
 if(p===1&&P!==1){draft={d:today(),meal:defaultMeal(),q:'1',open:false};customMode=false;savedMode=false;barMode=false;extraMode='';Q='';}
 else if(P===1&&p!==1)draft=null;
 return baseGo(p);
};
window.R=function(){
 capture();baseR();
 var app=document.getElementById('app');
 if(P===0){
  var cards=Array.from(app.children),firstMeal=app.querySelector('.mealcard');
  var mealHeading=Array.from(app.querySelectorAll('h2')).find(e=>e.textContent.startsWith('Meals'));
  var nutrition=cards.filter(e=>e.querySelector('h3')&&['Goal rings','Macros','Micronutrients'].includes(e.querySelector('h3').textContent));
  if(firstMeal&&mealHeading){
   var intro=app.querySelector('.welcome');if(intro)intro.querySelector('p').textContent='Search a food or scan a pack, check your portion, then add it.';
   var anchor=app.querySelector('.welcome')||app.querySelector('.c');
   var meals=[mealHeading,mealHeading.nextElementSibling].concat(Array.from(app.querySelectorAll('.mealcard')));
   meals.forEach(e=>{if(e){anchor.after(e);anchor=e;}});
   var details=document.createElement('details');details.className='c nutrition-details';
   details.innerHTML='<summary>Nutrition & progress</summary><p class=note>Your goal rings, macros and known nutrients.</p>';
   nutrition.forEach(e=>details.append(e));app.append(details);
  }
 }
 if(P===1){
  var d=document.getElementById('date'),m=document.getElementById('meal'),q=document.getElementById('q'),serving=document.getElementById('serving');
  if(draft){d.value=draft.d;m.value=draft.meal;q.value=draft.q;serving.open=draft.open;}
  else m.value=defaultMeal();
  m.dispatchEvent(new Event('change'));
  [d,m,q].forEach(e=>e.addEventListener('change',capture));
  var bar=app.querySelector('.addbar'),s=document.getElementById('s');
  if(s){var label=app.querySelector('label[for=s]');bar.prepend(s);bar.prepend(label);s.placeholder='Search food, e.g. roti or eggs';s.setAttribute('aria-label','Search foods');}
  if(customMode||savedMode||barMode||extraMode){var online=bar.querySelector('button[onclick*="moreFood"]');if(online)online.closest('.f').remove();}
  var recent=app.querySelector('.quick-list');
  if(recent){recent.open=true;var summary=recent.querySelector('summary');summary.textContent='Recently eaten';var help=recent.querySelector('p');help.textContent='Add the same portion to '+m.value.toLowerCase()+'.';m.addEventListener('change',()=>help.textContent='Add the same portion to '+m.value.toLowerCase()+'.');}
  if(savedMode){var note=Array.from(app.querySelectorAll('.c')).find(e=>e.querySelector('h3')?.textContent==='Saved meals')?.querySelector('.note');if(note)note.textContent='Log a saved meal in one tap. It uses its saved meal group unless you open the date and meal settings.';}
  if(extraMode==='review'){
   var review=Array.from(app.querySelectorAll('.c')).find(e=>e.querySelector('h3')?.textContent==='Check your portion');
   if(review){var notes=review.querySelectorAll('p.help-line');if(notes[1])notes[1].textContent='Adjust the amount you ate.';var add=review.querySelector('button[onclick="logReview()"]');if(add)add.textContent='Add to '+m.value;m.addEventListener('change',()=>{if(add)add.textContent='Add to '+m.value;});}
  }
 }
};
window.renderFood=function(){
 baseRenderFood();var el=document.getElementById('foodlist');if(!el)return;
 var sources=el.querySelector('details.help');if(sources)el.append(sources);
 el.querySelectorAll('.pick').forEach(b=>b.textContent='Portion');
 var empty=el.querySelector('.empty');if(empty&&filter==='fav'&&!Q){empty.querySelector('strong').textContent='Your favourites go here';empty.querySelector('p').textContent='Tap the star beside a food to save it for next time.';}
};
window.openReview=function(item,quantity){baseOpenReview(item,quantity);var review=Array.from(document.querySelectorAll('.c')).find(e=>e.querySelector('h3')?.textContent==='Check your portion');if(review)review.scrollIntoView({block:'start',behavior:'auto'});};
window.quickAdd=function(i){var x=D.m.find(y=>String(y.i)===String(i));if(x)add(x.n,x.k,x.mac?{...x.mac}:undefined,{d:today(),meal:defaultMeal()},x.micro?{...x.micro}:undefined);};
var style=document.createElement('style');style.textContent='.nutrition-details>summary{font-weight:700;min-height:44px;cursor:pointer;padding:10px 0}.nutrition-details>.c{box-shadow:none;padding:12px 0;border:0}.quick-list>summary{font-weight:700;padding:8px 0}.quick-list[open]>summary{list-style:none}.addbar input[type=search]{min-height:52px;background:var(--cd);border:1px solid var(--bd);font-size:17px}.addbar label{display:block;font-weight:600;margin:0 0 5px}.addbar{position:relative;top:auto}.foodactions .pick{min-width:70px}.mealcard .meal-save{margin-top:8px}';document.head.append(style);
var proteinRates={Lower:1.2,Medium:1.6,Higher:1.8};
window.autoPG=function(g){
 var goal=g||D.g, level=proteinRates[D.proteinLevel]?D.proteinLevel:'Higher';
 var p=D.bw?proteinRates[level]*D.bw:.3*goal/4;
 return Math.min(500,Math.max(10,Math.round(p)));
};
window.chooseProteinLevel=function(level){
 if(!proteinRates[level])return;
 D.proteinLevel=level;D.pm=false;D.pg=window.autoPG();sv();
};
var originalR=window.R;
window.R=function(){
 originalR();
 var note=Array.from(document.querySelectorAll('.c small')).find(e=>e.textContent==='One tap adds the same portion to today, in its original meal group.');
 if(note)note.textContent='Same portion, added to '+defaultMeal().toLowerCase()+'.';
 if(P===3){
  var card=Array.from(document.querySelectorAll('.c')).find(e=>e.querySelector('h3')?.textContent==='Your goals');
  var protein=card&&card.querySelector('button[onclick^="setPG"]');
  if(card&&protein){
   var level=D.proteinLevel&&proteinRates[D.proteinLevel]?D.proteinLevel:'Higher';
   var box=document.getElementById('protein-level-options');
   if(!box){box=document.createElement('div');box.id='protein-level-options';box.className='protein-level-options';protein.after(box);}
   box.innerHTML='<p class="note">Automatic protein level'+(D.bw?' · based on body weight':' · body weight not set')+'</p><div class="f">'+Object.keys(proteinRates).map(function(name){return '<button class="ch '+(name===level?'active':'')+'" aria-pressed="'+(name===level)+'" onclick="chooseProteinLevel(\''+name+'\')">'+name+' · '+proteinRates[name]+' g/kg</button>';}).join('')+'</div><p class="note">Lower 1.2 · Medium 1.6 · Higher 1.8 g/kg. Without body weight, the existing calorie-based estimate is used.</p>';
  }
 }
};

R();
})();


var goalsRender=window.R;
window.R=function(){
 goalsRender();
 if(P===3){
  var card=Array.from(document.querySelectorAll('.c')).find(e=>e.querySelector('h3')?.textContent==='Your goals');
  if(card){
   card.querySelectorAll('p').forEach(e=>e.remove());
   var old=document.getElementById('protein-level-options');if(old)old.remove();
   var weight=Array.from(card.querySelectorAll('button')).find(b=>b.textContent.includes('Body weight (optional)'));
   if(weight){var note=document.createElement('p');note.className='note';note.textContent='Auto protein uses your body weight. Goals are editable targets, not medical advice.';weight.after(note);}
  }
 }
};
