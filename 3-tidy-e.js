 if(P===0){document.querySelectorAll('.swipe-wrap').forEach(function(w){var span=w.querySelector('.swipe-row>span');if(!span)return;span.className='entry-edit';span.setAttribute('role','button');span.setAttribute('tabindex','0');span.setAttribute('aria-label','Edit '+span.textContent);span.onclick=function(){if(!w.querySelector('.swipe-row').classList.contains('revealed'))edOpen(w.getAttribute('data-entry'));};span.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();edOpen(w.getAttribute('data-entry'));}};});
 var note=Array.from(document.querySelectorAll('#app p.note')).find(function(e){return e.textContent.indexOf('Swipe a food left')===0;});if(note)note.textContent='Tap a food to edit. Swipe left to delete.';
 }
 if(P===2){document.querySelectorAll('.hx-e').forEach(function(row){var span=row.querySelector(':scope>span'),del=row.querySelector('button[onclick]');if(!span||!del)return;var match=del.getAttribute('onclick').match(/del\(([^)]+)\)/);if(!match)return;var b=document.createElement('button');b.className='entry-edit';b.innerHTML=span.innerHTML;b.setAttribute('aria-label','Edit '+span.textContent);b.onclick=function(){edOpen(match[1]);};span.replaceWith(b);});}
};
R();
})();
