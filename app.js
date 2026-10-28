const data = window.CONTENT;
const $ = id => document.getElementById(id);
const img = name => { const value=window.IMAGES[name]; if(!value)throw Error(`Missing image: ${name}`); return value; };
const icon = name => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
document.documentElement.style.setProperty('--texture',`url("${img('paper')}")`);
document.querySelectorAll('img[data-image]').forEach(image=>image.src=img(image.dataset.image));
let activePage='home',activeProject=null,groupNames=[],activeGroup='',gallery=[],imageIndex=0,returnScroll=0,lastFocus=null,toastTimer;

function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,2300);}
function closeMenu(){ $('menu').hidden=true;$('shell').inert=!$('detail').hidden;$('detail').inert=false;document.querySelectorAll('[aria-controls="menu"]').forEach(button=>button.setAttribute('aria-expanded','false'));document.body.style.overflow=$('detail').hidden?'':'hidden';if(lastFocus&&lastFocus.getClientRects().length)lastFocus.focus(); }
function go(id){$('detail').hidden=true;$('lightbox').hidden=true;closeMenu();document.body.style.overflow='';activePage=id;document.querySelectorAll('.page').forEach(page=>page.classList.toggle('active',page.id===id));window.scrollTo(0,0);$('menu-open').focus({preventScroll:true});}
$('enter').onclick=()=>{$('cover').hidden=true;$('shell').hidden=false;document.body.style.overflow='';go('home');};
$('view-all').onclick=()=>go('works');
document.querySelectorAll('[data-go]').forEach(button=>button.onclick=()=>go(button.dataset.go));
function openMenu(event){lastFocus=event.currentTarget;$('menu').querySelectorAll('[data-go]').forEach(button=>{if(button.dataset.go===($('detail').hidden?activePage:'works'))button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});$('menu').hidden=false;document.body.style.overflow='hidden';lastFocus.setAttribute('aria-expanded','true');$('shell').inert=true;$('detail').inert=true;$('menu-close').focus();}
$('menu-open').onclick=openMenu;$('detail-menu-open').onclick=openMenu;
$('menu-close').onclick=closeMenu;$('menu-backdrop').onclick=closeMenu;document.body.style.overflow='hidden';

function homeRow(project){
 const button=document.createElement('button');button.className='home-row';button.setAttribute('aria-label',`查看${project.title}`);
 const image=document.createElement('img');image.src=img(project.cover);image.alt=project.title;
 const text=document.createElement('div');const small=document.createElement('small');small.textContent=`${project.number} / ${project.category}`;const h3=document.createElement('h3');h3.textContent=project.title;const p=document.createElement('p');p.textContent=project.subtitle;text.append(small,h3,p);
 button.append(image,text);button.insertAdjacentHTML('beforeend',icon('diagonal'));button.onclick=()=>openProject(project);return button;
}
data.projects.slice(1).forEach(project=>$('home-projects').append(homeRow(project)));
$('featured-brand').onclick=()=>openProject(data.projects[0]);
['全部','品牌设计','界面设计','插画','IP设计','摄影'].forEach((category,index)=>{
 const button=document.createElement('button');button.textContent=category;button.setAttribute('aria-pressed',String(index===0));
 button.onclick=()=>{$('chapters').querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));renderWorks(category);};$('chapters').append(button);
});
function renderWorks(category='全部'){
 const projects=data.projects.filter(project=>category==='全部'||project.category===category);$('work-list').textContent='';$('chapter-label').textContent=category==='全部'?'作品选集':category;$('work-count').textContent=`${projects.length} 组`;
 projects.forEach(project=>{
  const button=document.createElement('button');button.className='work-card';button.setAttribute('aria-label',`查看${project.title}`);
  const frame=document.createElement('div');frame.className='work-image'+(['ethnic','dessert','photography'].includes(project.id)?' portrait':'');const image=document.createElement('img');image.src=img(project.cover);image.alt=project.title;image.loading='lazy';frame.append(image);
  const meta=document.createElement('div');meta.className='work-meta';const label=document.createElement('span');label.textContent=`${project.number} / ${project.category}`;meta.append(label);meta.insertAdjacentHTML('beforeend',icon('diagonal'));
  const heading=document.createElement('h2');heading.textContent=project.title;const caption=document.createElement('p');caption.textContent=project.subtitle;button.append(frame,meta,heading,caption);button.onclick=()=>openProject(project);$('work-list').append(button);
 });
}
renderWorks();
data.skills.forEach((skill,index)=>{const row=document.createElement('div');const number=document.createElement('small');number.textContent=String(index+1).padStart(2,'0');const label=document.createElement('span');label.textContent=skill;row.append(number,label);$('skill-list').append(row);});
$('phone').textContent=data.phone;$('phone').href=`tel:${data.phone}`;$('phone').setAttribute('aria-label',`拨打电话 ${data.phone}`);$('wechat').textContent=data.wechat;$('email').textContent=data.email;$('email').href=`mailto:${data.email}`;$('email').setAttribute('aria-label',`发送邮件至 ${data.email}`);
document.querySelectorAll('.copy-button').forEach(button=>button.append(document.createTextNode('复制')));
async function copy(value,label){
 if(window.ResumeNative){window.ResumeNative.copyText(value);toast(`${label}已复制`);return;}
 try{await navigator.clipboard.writeText(value);toast(`${label}已复制`);}catch{const input=document.createElement('textarea');input.value=value;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();toast(ok?`${label}已复制`:'请长按文字复制');}
}
$('copy-phone').onclick=()=>copy(data.phone,'电话');$('copy-wechat').onclick=()=>copy(data.wechat,'微信');$('copy-email').onclick=()=>copy(data.email,'邮箱');

function openProject(project,continuing=false){
 if(!continuing)returnScroll=window.scrollY;
 activeProject=project;$('detail-category').textContent=`${project.number} / ${project.category}`;$('detail-header-title').textContent=project.category;$('detail-title').textContent=project.title;$('detail-subtitle').textContent=project.subtitle;$('detail-description').textContent=project.description;
 groupNames=Object.keys(project.groups);$('detail-tabs').textContent='';
 if(groupNames.length>1)groupNames.forEach((name,index)=>{const button=document.createElement('button');button.textContent=name;button.setAttribute('aria-pressed',String(index===0));button.onclick=()=>{$('detail-tabs').querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));renderGallery(name);};$('detail-tabs').append(button);});
 renderGallery(groupNames[0]);const next=data.projects[(data.projects.indexOf(project)+1)%data.projects.length];$('next-project').querySelector('span').textContent=next.title;$('next-project').onclick=()=>openProject(next,true);
 $('detail').hidden=false;$('shell').inert=true;$('detail').scrollTop=0;document.body.style.overflow='hidden';$('detail-back').focus();
}
function renderGallery(name){
 activeGroup=name;gallery=activeProject.groups[name];$('detail-gallery').textContent='';$('detail-gallery').classList.toggle('screens',activeProject.id==='interface'&&['一级页面','二级页面','三级页面'].includes(name));
 gallery.forEach((key,index)=>{
  const button=document.createElement('button');button.className='detail-image';button.setAttribute('aria-label',`放大${name}图片${index+1}`);
  const image=document.createElement('img');image.src=img(key);image.alt=`${activeProject.title} · ${name} · ${index+1}`;button.append(image);button.insertAdjacentHTML('beforeend',`<span>${icon('zoom')}查看大图 / ${String(index+1).padStart(2,'0')}</span>`);button.onclick=()=>openImage(index);$('detail-gallery').append(button);
 });
}
function closeDetail(){ $('detail').hidden=true;$('shell').inert=false;document.body.style.overflow='';window.scrollTo(0,returnScroll); }
$('detail-back').onclick=closeDetail;
function openImage(index){imageIndex=index;updateImage();$('lightbox').hidden=false;$('lightbox-close').focus();}
function updateImage(){ $('large-image').src=img(gallery[imageIndex]);$('large-image').alt=`${activeProject.title} · ${activeGroup} · ${imageIndex+1}`;$('lightbox-title').textContent=activeProject.title;$('image-index').textContent=`${imageIndex+1} / ${gallery.length}`;$('image-prev').disabled=imageIndex===0;$('image-next').disabled=imageIndex===gallery.length-1;document.querySelector('.lightbox-stage').classList.remove('zoomed'); }
$('lightbox-close').onclick=()=>$('lightbox').hidden=true;
$('image-prev').onclick=()=>{if(imageIndex>0){imageIndex--;updateImage();}};
$('image-next').onclick=()=>{if(imageIndex<gallery.length-1){imageIndex++;updateImage();}};
$('image-zoom').onclick=()=>document.querySelector('.lightbox-stage').classList.toggle('zoomed');
window.handleBack=()=>{if(!$('lightbox').hidden){$('lightbox').hidden=true;return true;}if(!$('menu').hidden){closeMenu();return true;}if(!$('detail').hidden){closeDetail();return true;}if(!$('cover').hidden)return false;if(activePage!=='home'){go('home');return true;}return false;};
document.addEventListener('keydown',event=>{if(event.key==='Escape')window.handleBack();if(event.key==='Tab'&&!$('menu').hidden){const buttons=$('menu').querySelectorAll('.menu-panel button');const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
