// Faster photo decoding, with a higher-resolution fallback; 0.8-second undo.
(function(){
var oldDel=del;
del=function(i){oldDel(i);if(deletedEntries.length){clearTimeout(window.undoTimer);window.undoTimer=setTimeout(clearUndo,560);}};
clearUndo=function(){
clearTimeout(window.undoTimer);window.undoTimer=null;deletedEntries=[];
var b=document.querySelector('.undo-bar');if(!b)return;
b.style.pointerEvents='none';b.removeAttribute('class');b.className='undo-bar undo-leaving';
if(b.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
b.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(8px)'}],{duration:240,easing:'ease-out',fill:'forwards'}).onfinish=function(){b.remove();};
}else b.remove();
};
scanPhoto=async function(el){
var file=el.files&&el.files[0];if(!file)return;
stopScan();var token=scanSession,url=URL.createObjectURL(file);
scanMessage('Reading barcode photo...');
var fast=loadScanner().catch(function(){return null;});
var strong=loadStrongScanner().catch(function(){return null;});
try{
var im=new Image();im.src=url;await im.decode();if(token!==scanSession)return;
var c=barcodeCanvas(im,0,960),code=null;
if(window.BarcodeDetector)try{
var formats=await BarcodeDetector.getSupportedFormats();
var d=new BarcodeDetector({formats:formats.filter(function(f){return /^(ean_13|ean_8|upc_a|upc_e|code_128|itf)$/.test(f);})});
var hits=await d.detect(c);var hit=hits.find(function(x){return foodCode(x.rawValue);});code=hit&&hit.rawValue;
}catch(e){}
var z=code?null:await fast,reader=z?newScanner(z):null;
if(token!==scanSession)return;
if(!code)code=await decodeBarcodeCanvas(c,reader,null);
if(!code){var wasm=await strong;if(token!==scanSession)return;code=await decodeBarcodeCanvas(c,reader,wasm);}
if(!code){for(var pass=0;pass<9;pass++){
if(token!==scanSession)return;
code=await decodeBarcodeCanvas(barcodeCanvas(im,pass,1920),reader,wasm);if(code)break;
}}
if(!code)throw Error('no-barcode');
if(token===scanSession)scannedCode(code);
}catch(e){if(token===scanSession)scanMessage('No clear barcode found. Try a sharper photo with all bars visible, or type the number.');}
finally{URL.revokeObjectURL(url);el.value='';}
};
})();
