const installButton=document.getElementById('install-app');
const installHelp=document.getElementById('install-help');
const offlineState=document.getElementById('offline-state');
let installPrompt=null;
const standalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
if(standalone)installButton.hidden=true;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
window.addEventListener('appinstalled',()=>{installButton.hidden=true;});
installButton.onclick=async()=>{
 if(installPrompt){await installPrompt.prompt();installPrompt=null;return;}
 installHelp.hidden=false;document.getElementById('cover').inert=true;document.getElementById('install-close').focus();
};
function closeHelp(){installHelp.hidden=true;document.getElementById('cover').inert=false;installButton.focus({preventScroll:true});}
document.getElementById('install-close').onclick=closeHelp;
installHelp.addEventListener('click',event=>{if(event.target===installHelp)closeHelp();});
document.addEventListener('keydown',event=>{if(!installHelp.hidden&&event.key==='Escape')closeHelp();});
if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(registration=>{
  const watch=worker=>{if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='redundant')offlineState.textContent='联网后可准备离线内容';});};
  watch(registration.installing);registration.addEventListener('updatefound',()=>watch(registration.installing));
  navigator.serviceWorker.ready.then(()=>{offlineState.textContent='离线内容已就绪';});
 }).catch(()=>{offlineState.textContent='可联网浏览';});
}else{offlineState.textContent='可联网浏览';}
