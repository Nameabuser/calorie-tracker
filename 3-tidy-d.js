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
