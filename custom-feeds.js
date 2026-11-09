(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const posts = [...document.querySelectorAll('.content-list .content')];
  const authors = [...new Map(posts.map(p => {
    const a = $('.author__name', p);
    return a ? [a.textContent.trim(), {id:'author:' + a.textContent.trim(),name:a.textContent.trim(),image:$('.author__avatar img', p)?.getAttribute('src')}] : null;
  }).filter(Boolean)).values()];
  authors.push(...[
    {id:'author:S.Capusta',name:'S.Capusta',image:'./feed-assets/source-3.webp'},
    {id:'author:Joe cocker',name:'Joe cocker',image:'./feed-assets/source-4.webp'}
  ].filter(author=>!authors.some(existing=>existing.id===author.id)));
  const authorIds=authors.map(author=>author.id);
  const trends=['Сенсорный MacBook Pro','Взлом холодильников','Кибератака на Beget','OpenAI лимиты Pro','Gemini 4 Carbon','Взлом Binance']
    .map(name=>({id:'trend:'+name,name}));
  const sourceIds=new Set([...authorIds,...trends.map(trend=>trend.id)]);

  const outlineIcons = {
    bookmark: ['Закладка','M6 4h12v17l-6-4-6 4z'],
    folder: ['Папка','M3 7V5a2 2 0 0 1 2-2h5l3 3h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7h18'],
    category_finance: ['Финансы','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9m3-10v12'],
    book: ['Книга','M5 3h14v18H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2M4 17h15'],
    category_education: ['Обучение','m2 8 10-5 10 5-10 5L2 8m4 2v7c4 3 8 3 12 0v-7m4-2v8'],
    pencil: ['Карандаш','m4 16 12-12a2 2 0 0 1 4 4L8 20l-5 1 1-5m10-10 4 4'],
    code: ['Код','m8 4-3 2v4l-2 2 2 2v4l3 2m8-16 3 2v4l2 2-2 2v4l-3 2'],
    terminal: ['Терминал','M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m2 5 3 3-3 3m6 1h4'],
    music: ['Музыка','M9 17V5l11-2v12M9 5l11-2M9 17a3 3 0 1 1-3-3c2 0 3 1 3 3m11-2a3 3 0 1 1-3-3c2 0 3 1 3 3'],
    category_design: ['Палитра','M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4 1 1 0 0 1 1-2h2c3 0 4-2 4-4a9 9 0 0 0-9-8M7 10h.01M10 6h.01M15 6h.01M18 10h.01'],
    category_health: ['Здоровье','M5 3v6a5 5 0 0 0 10 0V3m-12 0h4m6 0h4m-7 11v3a4 4 0 0 0 8 0v-3m0-4a2 2 0 1 0 0 4 2 2 0 0 0 0-4'],
    category_b2b: ['Портфель','M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M5 6h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2'],
    chart: ['График','M3 11h5v10H3zM10 3h5v18h-5zM17 8h4v13h-4z'],
    category_content: ['Блокнот','M7 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2M3 7h4M3 12h4M3 17h4m5-10h5m-5 5h5'],
    category_law: ['Весы','M12 3v18m-6 0h12M4 6h16M6 6l-4 8h8L6 6m12 0-4 8h8l-4-8'],
    category_travel: ['Самолет','m21 3-6 18-4-8-8-4L21 3m-10 10 5-5'],
    globe: ['Глобус','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18'],
    flask: ['Наука','M8 3h8M9 3v7l-5 9a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-5-9V3M7 15h10'],
    category_ai: ['Мозг','M12 5c-3-4-7-1-6 2-4 0-5 5-2 7-2 4 2 7 5 5 0 3 3 3 3 0V5m0 0c3-4 7-1 6 2 4 0 5 5 2 7 2 4-2 7-5 5 0 3-3 3-3 0M6 7l2 2m10-2-2 2M4 14l3-1m13 1-3-1'],
    heart: ['Сердце','M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 0 9 8 15 8-6 12-11 8-15'],
    star: ['Звезда','m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z'],
    category_dev: ['Разработка','m8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 18'],
    category_city: ['Город','M3 21V9h7v12M10 21V3h8v18m0-9h3v9M6 12v1m0 3v1m8-10v1m0 3v1m0 3v1'],
    category_marketing: ['Маркетинг','m3 10 17-6v16L3 14v-4m3 5 2 6h4l-2-5m10-9v10'],
    category_invest: ['Рост','m3 17 7-7 4 4 7-10m-6 0h6v6'],
    category_cloud: ['Облако','M6 18a5 5 0 0 1-1-10 7 7 0 0 1 13-1 5.5 5.5 0 0 1 0 11H6'],
    game: ['Игры','M7 7h10c3 0 4 4 5 11 0 3-4 3-6-1H8c-2 4-6 4-6 1 1-7 2-11 5-11m-2 5h6m-3-3v6m8-4h.01m3 3h.01']
  };
  const iconOptions = Object.entries(outlineIcons).map(([id,[name]]) => [id,name]);
  const validIcon = id => Object.hasOwn(outlineIcons,id) ? id : 'bookmark';
  const iconSVG = id => `<svg class="icon cf-outline-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${outlineIcons[validIcon(id)][1]}" fill="none"/></svg>`;
  let baseActive = 'https://vc.ru/popular';
  const presets = [
    {id:'preset:ai',name:'Нейросети и технологии',icon:'category_ai',description:'AI, ChatGPT, будущее и авторы о технологиях',sources:['topic:AI','topic:ChatGPT','topic:Будущее','author:КОД - техножурнал','author:Ринат Шакиров']},
    {id:'preset:business',name:'Бизнес и стартапы',icon:'category_b2b',description:'Предпринимательство, компании и новые идеи',sources:['topic:Бизнес','topic:Стартапы','author:Mikhail Tokovinin','author:Dmitry Filonov']},
    {id:'preset:travel',name:'Вокруг света',icon:'category_travel',description:'Путешествия, города и жизнь за рубежом',sources:['topic:Путешествия','author:Владимир Титов']}
  ];
  let state = {custom:[], visible:[], order:[], active:null};
  try {
    const saved = JSON.parse(localStorage.getItem('vc-custom-feeds-v1'));
    if (saved && Array.isArray(saved.custom) && Array.isArray(saved.visible)) {
      state.custom = saved.custom.filter(f => typeof f.id === 'string' && f.id.startsWith('custom:') && typeof f.name === 'string' && Array.isArray(f.sources)).map(f=>({...f,sources:f.sources.filter(id=>typeof id==='string')}));
      state.visible = saved.visible.filter(id=>[...presets,...state.custom].some(f=>f.id===id));
      state.order = Array.isArray(saved.order) ? saved.order : [];
      state.active = state.visible.includes(saved.active) ? saved.active : null;
    }
  } catch {}
  const all = () => [...presets,...state.custom];
  const orderedFeeds = () => {
    const byId = new Map(all().map(feed=>[feed.id,feed]));
    const ids = [...new Set([...state.order,...byId.keys()])];
    return ids.map(id=>byId.get(id)).filter(Boolean);
  };
  const visibleFeeds = () => orderedFeeds().filter(feed=>state.visible.includes(feed.id));
  const save = () => {try {localStorage.setItem('vc-custom-feeds-v1',JSON.stringify(state));} catch {toast('Не удалось сохранить настройки в браузере');}};
  const toast = text => {document.querySelector('.cf-status')?.remove();const e=document.createElement('div');e.className='cf-status';e.role='status';e.textContent=text;document.body.append(e);setTimeout(()=>e.remove(),3000);};
  const navbar = $('.feed-sorting .navbar');
  if (!navbar) return;
  const trigger=document.createElement('button');trigger.className='cf-trigger';trigger.title='Добавить ленту';trigger.setAttribute('aria-label','Добавить ленту');trigger.innerHTML='<svg class="icon" width="20" height="20" aria-hidden="true"><use href="#sprite-plus"></use></svg><span>Добавить ленту</span>';
  $('.navbar__right',navbar).prepend(trigger);

  const empty=document.createElement('div');empty.className='cf-empty';empty.hidden=true;empty.innerHTML='<h3>Нет просмотренных постов</h3>';$('.content-list')?.prepend(empty);
  const mobileNav=document.createElement('nav');mobileNav.className='cf-mobile-nav';mobileNav.setAttribute('aria-label','Ленты');$('.feed-sorting').before(mobileNav);
  function renderMobileNav(){
    const previousScroll=$('.cf-mobile-scroll',mobileNav)?.scrollLeft || 0;
    const baseFeeds=[['https://vc.ru/popular','Популярное'],['https://vc.ru/new','Свежее'],['https://vc.ru/my','Подписки']];
    mobileNav.innerHTML='<div class="cf-mobile-scroll" role="tablist" aria-label="Ленты">'+baseFeeds.map(([url,name])=>`<button type="button" role="tab" aria-selected="${!state.active && baseActive===url}" data-mobile-base="${url}">${name}</button>`).join('')+visibleFeeds().map(f=>`<button type="button" role="tab" aria-selected="${state.active===f.id}" data-mobile-feed="${esc(f.id)}">${esc(f.name)}</button>`).join('')+'</div><div class="cf-mobile-actions"><button type="button" class="cf-icon cf-sort-trigger cf-mobile-sort" aria-label="Сортировка ленты" aria-haspopup="menu" aria-controls="cf-sort-popover" aria-expanded="false"><svg class="icon" width="24" height="24" aria-hidden="true"><use href="#sprite-sort"></use></svg></button><button type="button" class="cf-icon cf-mobile-manage" aria-label="Настроить ленты" title="Добавить или настроить ленты"><svg class="icon" width="24" height="24" aria-hidden="true"><use href="#sprite-plus"></use></svg></button></div>';
    const scroll=$('.cf-mobile-scroll',mobileNav);scroll.scrollLeft=previousScroll;
    if(mobileNav.getBoundingClientRect().width){
      const active=$('[aria-selected=true]',scroll),area=scroll.getBoundingClientRect(),box=active?.getBoundingClientRect();
      if(box && box.right>area.right)scroll.scrollLeft+=box.right-area.right;
      else if(box && box.left<area.left)scroll.scrollLeft-=area.left-box.left;
    }
  }
  mobileNav.onclick=event=>{
    if(event.target.closest('.cf-mobile-manage')){openManager({currentTarget:event.target.closest('button')});return;}
    const sorter=event.target.closest('.cf-mobile-sort');if(sorter){toggleSort(sorter,true);return;}
    const button=event.target.closest('[data-mobile-base],[data-mobile-feed]');
    if(button){if(button.dataset.mobileBase){baseActive=button.dataset.mobileBase;state.active=null;}else state.active=button.dataset.mobileFeed;save();renderFeed();}
  };
  const sortOptions=[['date','По дате'],['popular','По популярности'],['viewed','Просмотренные']];
  let feedSort='date';
  const sortLabel=document.createElement('button');sortLabel.type='button';sortLabel.className='cf-sort-trigger cf-sort-label';sortLabel.hidden=true;sortLabel.setAttribute('aria-haspopup','menu');sortLabel.setAttribute('aria-controls','cf-sort-popover');sortLabel.setAttribute('aria-expanded','false');
  $('.feed-sorting__desktop')?.append(sortLabel);
  function toggleSort(button,alignRight=false){
    if(sortPopup.matches(':popover-open'))sortPopup.hidePopover();
    else {renderSort();sortPopup.showPopover();const anchor=button.getBoundingClientRect();sortPopup.style.left=Math.max(16,Math.min(alignRight?anchor.right-sortPopup.offsetWidth:anchor.left,innerWidth-sortPopup.offsetWidth-16))+'px';sortPopup.style.top=Math.max(16,Math.min(anchor.bottom+8,innerHeight-sortPopup.offsetHeight-16))+'px';}
  }
  sortLabel.onclick=()=>toggleSort(sortLabel);
  const viewedPosts=new Set();
  const postPopularity=post=>{const buttons=post.querySelectorAll('button');const text=buttons[buttons.length-1]?.textContent.trim().replace(/\s/g,'').replace(',','.') || '0';return (parseFloat(text)||0)*(/k|к/i.test(text)?1000:1);};
  const sortPopup=document.createElement('div');sortPopup.className='cf-sort-popover';sortPopup.id='cf-sort-popover';sortPopup.setAttribute('popover','auto');sortPopup.setAttribute('role','menu');sortPopup.setAttribute('aria-label','Сортировка ленты');document.body.append(sortPopup);
  function renderSort(){sortPopup.innerHTML=sortOptions.map(([id,name])=>`<button type="button" role="menuitemradio" aria-checked="${feedSort===id}" data-sort="${id}"><span>${name}</span>${feedSort===id?'<svg class="icon" width="20" height="20" aria-hidden="true"><use href="#sprite-tick"></use></svg>':''}</button>`).join('');}
  sortPopup.onclick=event=>{const option=event.target.closest('[data-sort]');if(option){feedSort=option.dataset.sort;sortPopup.hidePopover();lastFeedKey=null;renderFeed();(matchMedia('(max-width:924px)').matches?$('.cf-mobile-sort'):sortLabel)?.focus();}};
  sortPopup.addEventListener('toggle',event=>document.querySelectorAll('.cf-sort-trigger').forEach(button=>button.setAttribute('aria-expanded',String(event.newState==='open'))));
  let lastFeedKey = null;
  function renderFeed() {

    renderSidebar();
    renderMobileNav();
    const feed=all().find(f=>f.id===state.active);
    const personal = Boolean(feed) || baseActive === 'https://vc.ru/my';
    document.documentElement.classList.toggle('cf-personal-feed',personal);
    sortLabel.hidden=!personal;
    sortLabel.innerHTML=`<span>${sortOptions.find(([id])=>id===feedSort)[1]}</span><svg class="icon cf-sort-chevron" width="16" height="16" aria-hidden="true"><use href="#sprite-chevron_down"></use></svg>`;
    document.querySelectorAll('.feed-page__news,.feed-page__seen-posts-count').forEach(e=>{e.hidden=personal;e.style.display=personal?'none':'';});
    const list=$('.content-list');
    const organic=posts.filter(p=>p.parentElement===list);
    const key=state.active || baseActive;
    if(key!==lastFeedKey){
      const previousFirst=[...list.children].find(p=>p.classList.contains('content')&&!p.hidden);
      const shuffled=[...organic];
      for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
      // Demo data: a fresh selection makes every feed switch visibly different.
      const candidates=shuffled.filter(p=>p!==previousFirst);
      const selection=candidates.slice(0,Math.min(candidates.length,6+Math.floor(Math.random()*4)));
      if(personal && feedSort==='popular')selection.sort((a,b)=>postPopularity(b)-postPopularity(a));
      const selected=new Set(selection);
      const ordered=[...selection,...shuffled.filter(p=>!selected.has(p))];
      const slots=organic.map(p=>{const slot=document.createComment('post');p.replaceWith(slot);return slot;});
      slots.forEach((slot,i)=>slot.replaceWith(ordered[i]));
      ordered.forEach(p=>{p.dataset.feedVisible=String(selected.has(p));});
      lastFeedKey=key;
    }
    [...list.children].forEach(e=>{
      if(e===empty)return;
      const isPost=organic.includes(e);
      const show=isPost ? (personal && feedSort==='viewed' ? viewedPosts.has(e) && e.dataset.feedVisible!=='false' : e.dataset.feedVisible!=='false') : !personal;
      e.hidden=!show;e.style.display=show?'':'none';
    });
    empty.hidden=!(personal && feedSort==='viewed' && !organic.some(p=>!p.hidden));
    organic.filter(p=>!p.hidden).forEach(p=>viewedPosts.add(p));
    navbar.querySelectorAll('.tabs__tab').forEach(t=>t.classList.toggle('tabs__tab--active',!feed && t.dataset.localOriginalHref===baseActive));
  }

  navbar.querySelectorAll('.tabs__tab').forEach(t=>t.addEventListener('click',e=>{e.preventDefault();baseActive=t.dataset.localOriginalHref || 'https://vc.ru/popular';state.active=null;save();renderFeed();navbar.querySelectorAll('.tabs__tab').forEach(x=>x.classList.toggle('tabs__tab--active',x===t));}));
  const dialog=document.createElement('dialog');dialog.className='cf-dialog';dialog.setAttribute('aria-labelledby','cf-title');document.body.append(dialog);
  let draft, opener, reordering=false;
  const uiIcon=(name,size=24)=>`<svg class="icon" width="${size}" height="${size}" aria-hidden="true"><use href="#sprite-${name}"></use></svg>`;
  const head=(title,back=false,actions='')=>`<header class="cf-head">${back?`<button class="cf-icon" data-action="back" aria-label="Назад">${uiIcon('back',22)}</button>`:''}<h2 id="cf-title">${title}</h2>${actions}<button class="cf-icon" data-action="close" aria-label="Закрыть">${uiIcon('cross',22)}</button></header>`;
  const pluralCount = (n,[one,few,many]) => n + ' ' + (n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many);
  function feedSourceCount(feed) {
    const selected=feed.sources.filter(id=>sourceIds.has(id));
    const authors=selected.filter(id=>authorIds.includes(id)).length;
    const trendCount=selected.length-authors;
    return [
      authors || !trendCount ? pluralCount(authors,['автор','автора','авторов']) : '',
      trendCount ? pluralCount(trendCount,['тренд','тренда','трендов']) : ''
    ].filter(Boolean).join(' · ');
  }
  const isCustom = feed => feed.id.startsWith('custom:');
  const gripIcon = '<svg class="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="7" cy="4" r="1.5"/><circle cx="13" cy="4" r="1.5"/><circle cx="7" cy="10" r="1.5"/><circle cx="13" cy="10" r="1.5"/><circle cx="7" cy="16" r="1.5"/><circle cx="13" cy="16" r="1.5"/></svg>';
  function feedRow(feed, before, after) {
    const custom=isCustom(feed);
    const id=esc(feed.id);
    const name=esc(feed.name);
    const move=(direction,enabled)=>`<button type="button" class="cf-icon cf-move" data-move="${direction}" aria-label="Переместить «${name}» ${direction<0?'вверх':'вниз'}" ${enabled?'':'disabled'}>${uiIcon(direction<0?'chevron_up':'chevron_down',20)}</button>`;
    const actions=reordering
      ? `<div class="cf-move-actions">${move(-1,before)}${move(1,after)}</div><button type="button" class="cf-icon cf-grip" ${before||after?'':'disabled'} aria-label="Переместить «${name}»" aria-describedby="cf-reorder-help" aria-keyshortcuts="ArrowUp ArrowDown" title="Перетащить">${gripIcon}</button>`
      : `${custom?`<button class="cf-icon" data-edit="${id}" aria-label="Редактировать ${name}">${uiIcon('pen')}</button>`:''}<input class="cf-check" type="checkbox" id="cf-${id}" data-visible="${id}" ${state.visible.includes(feed.id)?'checked':''} aria-label="Показывать ${name}">`;
    return `<li class="cf-row" data-feed-row="${id}"><div class="cf-feed-icon">${iconSVG(feed.icon)}</div><label class="cf-info" ${reordering?'':`for="cf-${id}"`}><div class="cf-name">${name}</div><div class="cf-sub">${esc(custom?feedSourceCount(feed):feed.description)}</div></label><div class="cf-row-actions">${actions}</div></li>`;
  }
  function renderManagerRows() {
    const feeds=orderedFeeds();
    $('.cf-feed-list',dialog).innerHTML=feeds.map((feed,index)=>feedRow(feed,
      index>0,index<feeds.length-1)).join('');
  }
  function manager() {
    draft=null;
    reordering=false;
    const reorder=`<button type="button" class="cf-icon" data-action="reorder" aria-label="Изменить порядок лент" title="Изменить порядок лент" aria-pressed="false">${uiIcon('sort')}</button>`;
    dialog.innerHTML=head('Ваши ленты',false,reorder)+`<div class="cf-body"><span id="cf-reorder-help" hidden>Перетащите ленту или нажмите стрелку вверх или вниз на клавиатуре</span><ul class="cf-feed-list" aria-label="Ленты"></ul></div><footer class="cf-foot"><button class="cf-primary cf-secondary" data-action="create">Добавить новую ленту</button></footer>`;
    renderManagerRows();
  }
  function moveFeed(id, offset, focusSelector, draggedTop) {
    const feeds=orderedFeeds();
    const from=feeds.findIndex(feed=>feed.id===id);
    const to=from+offset;
    if (from<0 || !offset || !feeds[to]) return;
    const motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
    const previousTops=new Map();
    if(motion){
      dialog.querySelectorAll('[data-feed-row]').forEach(row=>previousTops.set(row.dataset.feedRow,row.getBoundingClientRect().top));
      if(draggedTop!==undefined)previousTops.set(id,draggedTop);
    }
    const [feed]=feeds.splice(from,1);
    feeds.splice(to,0,feed);
    state.order=feeds.map(feed=>feed.id);
    save();
    renderFeed();
    renderManagerRows();
    dialog.querySelectorAll('[data-feed-row]').forEach(row=>{
      if(motion){
        const distance=previousTops.get(row.dataset.feedRow)-row.getBoundingClientRect().top;
        if(distance)row.animate([{transform:`translateY(${distance}px)`},{transform:'none'}],{duration:200,easing:'ease-out'});
      }
      if(row.dataset.feedRow===id){
        const focus=row.querySelector(focusSelector) || row.querySelector('[data-move]:enabled');
        focus?.focus({preventScroll:true});
      }
    });
  }
  let drag;
  function endDrag() {
    if(!drag)return;
    drag.target?.removeAttribute('data-drop-side');
    drag.row.classList.remove('cf-dragging');
    drag.row.style.removeProperty('translate');
    drag=null;
  }
  dialog.addEventListener('pointerdown',event=>{
    const handle=event.target.closest('.cf-grip:enabled');
    if(!handle || event.button!==0 || !event.isPrimary)return;
    const row=handle.closest('[data-feed-row]');
    drag={row, startY:event.clientY, startTop:row.getBoundingClientRect().top, offset:0};
    handle.setPointerCapture(event.pointerId);
  });
  dialog.addEventListener('pointermove',event=>{
    if(!drag || !event.isPrimary)return;
    if(!drag.row.classList.contains('cf-dragging') && Math.abs(event.clientY-drag.startY)<4)return;
    drag.row.classList.add('cf-dragging');
    const body=drag.row.closest('.cf-body');
    const bodyBounds=body.getBoundingClientRect();
    if(event.clientY<bodyBounds.top+24)body.scrollTop-=12;
    else if(event.clientY>bodyBounds.bottom-24)body.scrollTop+=12;

    drag.row.style.removeProperty('translate');
    const top=drag.row.getBoundingClientRect().top;
    drag.row.style.translate=`0 ${event.clientY-drag.startY+drag.startTop-top}px`;
    drag.target?.removeAttribute('data-drop-side');
    drag.target=null;
    drag.offset=0;

    const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-feed-row]');
    if(!target || target.parentElement!==drag.row.parentElement)return;
    const rows=[...target.parentElement.children];
    const from=rows.indexOf(drag.row), to=rows.indexOf(target);
    const bounds=target.getBoundingClientRect();
    const after=event.clientY>bounds.top+bounds.height/2;
    const offset=to-from+Number(after)-Number(to>from);
    if(!offset)return;
    drag.offset=offset;
    drag.target=target;
    target.dataset.dropSide=after?'after':'before';
  });
  dialog.addEventListener('pointerup',event=>{
    if(!drag || !event.isPrimary)return;
    const {row,offset}=drag;
    const draggedTop=row.getBoundingClientRect().top;
    endDrag();
    moveFeed(row.dataset.feedRow,offset,'.cf-grip:enabled',draggedTop);
  });
  dialog.addEventListener('lostpointercapture',endDrag);
  dialog.addEventListener('keydown',event=>{
    const handle=event.target.closest('.cf-grip');
    if(!handle || !['ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();
    moveFeed(handle.closest('[data-feed-row]').dataset.feedRow,event.key==='ArrowUp'?-1:1,'.cf-grip:enabled');
  });
  function editor(id) {
    const existing=state.custom.find(f=>f.id===id);
    draft=existing?{...existing,sources:[...new Set(existing.sources.filter(id=>sourceIds.has(id)))]}:{name:'',sources:[],icon:'bookmark'};
    dialog.innerHTML=head(existing?'Редактировать ленту':'Новая лента',true)+`
      <form id="cf-form">
        <div class="cf-body">
          <label class="cf-label" for="cf-name">Название</label>
          <div class="cf-name-row">
            <button type="button" class="cf-icon cf-name-icon" data-action="pick-icon" aria-label="Выбрать иконку ленты" aria-expanded="false" aria-controls="cf-icon-popover">${iconSVG(draft.icon)}</button>
            <div class="cf-name-control"><input class="cf-input" id="cf-name" placeholder="Название ленты" maxlength="40" required value="${esc(draft.name)}" aria-describedby="cf-name-count"><span class="cf-count" id="cf-name-count" aria-label="Осталось символов">${40-draft.name.length}</span></div>
          </div>
          <div class="cf-icon-popover" id="cf-icon-popover" popover="auto" role="group" aria-label="Иконка ленты"><div class="cf-icon-grid"></div></div>
          <div class="cf-source-picker">
            <div class="cf-source-switch" role="group" aria-label="Источники ленты">
              <button type="button" data-source-view="authors" aria-pressed="true" aria-controls="cf-author-panel">Авторы</button>
              <button type="button" data-source-view="trends" aria-pressed="false" aria-controls="cf-trend-panel">Тренды</button>
            </div>
            <div id="cf-author-panel">
              <input class="cf-input" id="cf-search" type="search" placeholder="Поиск авторов" aria-label="Поиск авторов">
              <button type="button" class="cf-primary cf-secondary cf-select-authors" data-action="select-authors">Выбрать всех авторов</button>
              <div id="cf-results"></div>
            </div>
            <div id="cf-trend-panel" hidden>
              <div class="cf-trend-options" role="group" aria-label="Тренды">
                ${trends.map(trend=>`<label class="cf-trend-option"><input type="checkbox" data-source="${esc(trend.id)}" ${draft.sources.includes(trend.id)?'checked':''}><span>${esc(trend.name)}</span></label>`).join('')}
              </div>
            </div>
            <div class="cf-error" role="alert"></div>
          </div>
        </div>
        <footer class="cf-foot">
          <button class="cf-primary" id="cf-save" type="submit">Сохранить</button>
          ${existing?'<button class="cf-danger" type="button" data-action="delete">Удалить ленту</button>':''}
        </footer>
      </form>`;
    updateSources();
    renderIcons();
    const popup=$('#cf-icon-popover',dialog);
    popup.addEventListener('toggle',event=>$('.cf-name-icon',dialog)?.setAttribute('aria-expanded',String(event.newState==='open')));
    $('.cf-body',dialog).addEventListener('scroll',()=>popup.hidePopover());
    $('#cf-name',dialog).focus();
    $('#cf-form',dialog).onsubmit=e=>{
      e.preventDefault();
      const name=draft.name.trim();
      if(!name||!draft.sources.length)return;
      if(all().some(f=>f.id!==draft.id&&f.name.toLocaleLowerCase()===name.toLocaleLowerCase())){
        $('.cf-error',dialog).textContent='Лента с таким названием уже существует';
        return;
      }
      const feed={id:draft.id||'custom:'+crypto.randomUUID(),name,icon:validIcon(draft.icon),sources:[...draft.sources]};
      const index=state.custom.findIndex(f=>f.id===feed.id);
      if(index<0){
        state.custom.push(feed);
        state.visible.push(feed.id);
        state.active=feed.id;
      }else state.custom[index]=feed;
      save();
      renderFeed();
      manager();
      toast(index<0?'Лента создана':'Изменения сохранены');
    };
  }
  function updateEditorControls() {
    const allSelected=authorIds.every(id=>draft.sources.includes(id));
    $('[data-action="select-authors"]',dialog).textContent=allSelected?'Снять выбор со всех авторов':'Выбрать всех авторов';
    $('#cf-save',dialog).disabled=!draft.name.trim()||!draft.sources.length;
  }
  function updateSources() {
    const query=$('#cf-search',dialog).value.trim().toLocaleLowerCase();
    const results=authors.filter(author=>author.name.toLocaleLowerCase().includes(query));
    $('#cf-results',dialog).innerHTML=results.map(author=>`<label class="cf-row"><span class="cf-avatar">${author.image?`<img src="${esc(author.image)}" alt="">`:esc(author.name.slice(0,1))}</span><span class="cf-info cf-name">${esc(author.name)}</span><input type="checkbox" class="cf-check" data-source="${esc(author.id)}" ${draft.sources.includes(author.id)?'checked':''} aria-label="${esc(author.name)}"></label>`).join('')||'<p class="cf-hint">Авторы не найдены</p>';
    updateEditorControls();
  }
  const sidebar = document.querySelector('.sidebar');
  const feedSection = sidebar?.querySelector('.sidebar__section');
  const feedList = feedSection?.querySelector('.sidebar__section-content');
  const openManager = event => {
    opener=event.currentTarget;
    manager();
    dialog.showModal();
  };
  const ownSection=document.createElement('div');
  ownSection.className='sidebar__section cf-own-feeds-section';
  const sidebarTitle=document.createElement('div');
  sidebarTitle.className='sidebar__title cf-sidebar-heading';
  sidebarTitle.innerHTML='<span>Мои ленты</span><button type="button" class="cf-icon cf-sidebar-settings" aria-label="Настроить ленты" title="Настроить ленты"><svg class="icon icon--settings" width="22" height="22" aria-hidden="true"><use href="#sprite-settings"></use></svg></button>';
  const settingsButton=$('.cf-sidebar-settings',sidebarTitle);
  settingsButton.onclick=openManager;
  trigger.onclick=openManager;
  const ownContent=document.createElement('div');
  ownContent.className='sidebar__section-content';
  const sidebarFeeds=document.createElement('div');
  sidebarFeeds.className='cf-sidebar-feeds';
  const addFeedButton=document.createElement('button');
  addFeedButton.type='button';
  addFeedButton.className='sidebar-item cf-add-feed';
  addFeedButton.innerHTML='<svg class="icon" width="24" height="24" aria-hidden="true"><use href="#sprite-plus"></use></svg><span class="sidebar-item__label">Добавить ленту</span>';
  addFeedButton.onclick=openManager;
  ownContent.append(sidebarFeeds,addFeedButton);
  ownSection.append(sidebarTitle,ownContent);
  feedSection?.after(ownSection);
  let collapsedSections = {};
  try { collapsedSections = JSON.parse(localStorage.getItem('vc-sidebar-sections-v1')) || {}; } catch {}
  sidebar?.querySelectorAll(':scope > .sidebar__section').forEach((section,index) => {
    const heading = section.querySelector('.sidebar__title');
    const content = section.querySelector('.sidebar__section-content');
    if(!heading || !content) return;
    const label = heading.querySelector('span')?.textContent.trim() || heading.textContent.trim();
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'cf-section-toggle';
    const targetId = 'cf-sidebar-section-' + index;
    content.id = targetId;
    toggle.setAttribute('aria-controls',targetId);
    toggle.innerHTML = `<span>${esc(label)}</span><svg class="icon cf-section-chevron" width="16" height="16" aria-hidden="true"><use href="#sprite-chevron_down"></use></svg>`;
    if(heading === sidebarTitle) heading.firstElementChild.replaceWith(toggle);
    else heading.replaceChildren(toggle);
    function applyCollapsed(collapsed) {
      toggle.setAttribute('aria-expanded',String(!collapsed));
      content.hidden = collapsed;
      section.classList.toggle('cf-section-collapsed',collapsed);
    }
    applyCollapsed(collapsedSections[label] === true);
    toggle.onclick = () => {
      const collapsed = toggle.getAttribute('aria-expanded') === 'true';
      applyCollapsed(collapsed);
      collapsedSections[label] = collapsed;
      try { localStorage.setItem('vc-sidebar-sections-v1',JSON.stringify(collapsedSections)); } catch {}
    };
  });

  function renderSidebar() {
    const hasFeeds=state.visible.length>0;
    addFeedButton.hidden=hasFeeds;
    settingsButton.hidden=!hasFeeds;
    const subscriptionsLabel=feedList?.querySelector('a[data-local-original-href="https://vc.ru/my"] .sidebar-item__label');
    if(subscriptionsLabel)subscriptionsLabel.textContent='Подписки';
    sidebarFeeds.innerHTML = visibleFeeds().map(f=>`<button type="button" class="sidebar-item cf-sidebar-feed ${state.active===f.id?'sidebar-item--active':''}" data-feed="${esc(f.id)}" ${state.active===f.id?'aria-current="page"':''} title="${esc(f.name)}">${iconSVG(f.icon)}<div class="sidebar-item__text"><span class="sidebar-item__label">${esc(f.name)}</span></div></button>`).join('');
    feedList?.querySelectorAll('a.sidebar-item').forEach(a=>{
      const active = !state.active && a.dataset.localOriginalHref===baseActive;
      a.classList.toggle('sidebar-item--active',active);
      if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
  }
  sidebarFeeds.onclick = event => {
    const button=event.target.closest('[data-feed]');
    if(button){state.active=button.dataset.feed;save();renderFeed();}
  };
  feedList?.querySelectorAll('a.sidebar-item').forEach(a=>a.addEventListener('click',event=>{
    event.preventDefault();baseActive=a.dataset.localOriginalHref;state.active=null;save();renderFeed();
  }));
  function renderIcons() {
    const strip=$('.cf-icon-grid',dialog);
    strip.innerHTML=iconOptions.map(([id,name])=>`<button type="button" class="cf-icon-option" data-icon="${id}" aria-label="${name}" title="${name}" aria-pressed="${validIcon(draft.icon)===id}">${iconSVG(id)}</button>`).join('');
  }
  dialog.addEventListener('close',()=>{
    endDrag();
    const fallback=matchMedia('(max-width:924px)').matches
      ? $('.cf-mobile-manage')
      : state.visible.length ? settingsButton : addFeedButton;
    (opener?.getClientRects().length ? opener : fallback)?.focus();
  });
  dialog.addEventListener('click',e=>{
    if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();return;}
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.action==='pick-icon'){
      const popup=$('#cf-icon-popover',dialog);
      if(popup.matches(':popover-open'))popup.hidePopover();
      else{
        popup.showPopover();
        const anchor=b.getBoundingClientRect();
        popup.style.left=Math.max(16,Math.min(anchor.left,innerWidth-popup.offsetWidth-16))+'px';
        popup.style.top=Math.max(16,Math.min(anchor.bottom+8,innerHeight-popup.offsetHeight-16))+'px';
        popup.querySelector('[aria-pressed=true]')?.focus({preventScroll:true});
      }
      b.setAttribute('aria-expanded',String(popup.matches(':popover-open')));
    }
    if(b.dataset.icon){
      draft.icon=validIcon(b.dataset.icon);
      dialog.querySelectorAll('[data-icon]').forEach(option=>option.setAttribute('aria-pressed',String(option.dataset.icon===draft.icon)));
      const button=$('.cf-name-icon',dialog);button.innerHTML=iconSVG(draft.icon);
      $('#cf-icon-popover',dialog).hidePopover();button.setAttribute('aria-expanded','false');button.focus({preventScroll:true});
    }
    if(b.dataset.action==='close')dialog.close();
    if(b.dataset.action==='back')manager();
    if(b.dataset.action==='create')editor();
    if(b.dataset.edit)editor(b.dataset.edit);
    if(b.dataset.action==='reorder'){
      reordering=!reordering;
      b.setAttribute('aria-pressed',String(reordering));
      renderManagerRows();
    }
    if(b.dataset.move)moveFeed(b.closest('[data-feed-row]').dataset.feedRow,Number(b.dataset.move),`[data-move="${b.dataset.move}"]:enabled`);
    if(b.dataset.sourceView){
      dialog.querySelectorAll('[data-source-view]').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));
      $('#cf-author-panel',dialog).hidden=b.dataset.sourceView!=='authors';
      $('#cf-trend-panel',dialog).hidden=b.dataset.sourceView!=='trends';
    }
    if(b.dataset.action==='select-authors'){
      const allSelected=authorIds.every(id=>draft.sources.includes(id));
      draft.sources=allSelected
        ? draft.sources.filter(id=>!authorIds.includes(id))
        : [...new Set([...draft.sources,...authorIds])];
      updateSources();
    }

    if(b.dataset.action==='delete'){
      const id=draft.id;dialog.innerHTML=head('Удалить ленту?',true)+`<div class="cf-body"><p class="cf-intro">Лента «${esc(draft.name)}» будет удалена. Вы сможете создать новую подборку в любой момент.</p></div><footer class="cf-foot"><button class="cf-primary" data-action="confirm-delete">Удалить</button></footer>`;
      $('[data-action="back"]',dialog).onclick=e=>{e.stopPropagation();editor(id);};
    }
    if(b.dataset.action==='confirm-delete'){const id=draft.id;state.custom=state.custom.filter(f=>f.id!==id);state.order=state.order.filter(x=>x!==id);state.visible=state.visible.filter(x=>x!==id);if(state.active===id)state.active=null;save();renderFeed();manager();toast('Лента удалена');}
  });
  dialog.addEventListener('change',e=>{
    const input=e.target;
    if(input.dataset.visible){
      const id=input.dataset.visible;
      state.visible=input.checked?[...state.visible,id]:state.visible.filter(visible=>visible!==id);
      if(!state.visible.includes(state.active))state.active=null;
      save();
      renderFeed();
    }
    if(input.dataset.source){
      const id=input.dataset.source;
      draft.sources=input.checked?[...draft.sources,id]:draft.sources.filter(source=>source!==id);
      updateEditorControls();
    }
  });
  dialog.addEventListener('input',e=>{
    if(e.target.id==='cf-name'){
      draft.name=e.target.value;
      $('#cf-name-count',dialog).textContent=40-draft.name.length;
      $('.cf-error',dialog).textContent='';
      updateEditorControls();
    }
    if(e.target.id==='cf-search')updateSources();
  });
  document.addEventListener('click', event => {
    const link=event.target.closest('a');
    if(!link)return;
    if(link.dataset.localOriginalHref){event.preventDefault();return;}
    try {
      const url=new URL(link.href,location.href);
      if(url.hostname==='vc.ru'||url.hostname.endsWith('.vc.ru'))event.preventDefault();
    } catch {}
  });
  renderFeed();
})();
