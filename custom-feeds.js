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
  const sourceGroups={
    authors:{items:authors,ids:authorIds,search:'Поиск авторов',select:'Выбрать всех авторов',clear:'Снять выбор со всех авторов',empty:'Авторы не найдены'},
    trends:{items:trends,ids:trends.map(trend=>trend.id),search:'Поиск трендов',select:'Выбрать все тренды',clear:'Снять выбор со всех трендов',empty:'Тренды не найдены'}
  };
  const sourceIds=new Set([...authorIds,...sourceGroups.trends.ids]);

  const iconOptions = new Map([
    ['bookmark','Закладка'],
    ['delete','Корзина'],
    ['likes','Сердце'],
    ['pin','Булавка'],
    ['achievement','Достижение'],
    ['egg','Яйцо'],
    ['flag','Флаг'],
    ['headphones','Наушники'],
    ['home','Дом'],
    ['link','Ссылка'],
    ['palette','Палитра'],
    ['stack','Стопка'],
    ['18','18+'],
    ['person','Профиль'],
    ['save','Сохранение'],
    ['lock_full','Замок'],
    ['info','Информация'],
    ['emoji','Улыбка'],
    ['sad','Грусть'],
    ['company_page','Компания'],
    ['feed','Лента'],
    ['image','Изображение'],
    ['invoice','Счёт'],
    ['neuro','Нейро'],
    ['web','Глобус'],
    ['rouble','Рубль'],
  ]);
  const legacyIcons = {
    folder:'stack', category_finance:'invoice', book:'feed', category_education:'achievement',
    pencil:'save', code:'feed', terminal:'feed', music:'headphones', category_design:'palette',
    category_b2b:'company_page', chart:'invoice', category_content:'feed', category_travel:'flag',
    globe:'flag', category_ai:'info', heart:'likes', star:'achievement', category_dev:'feed',
    category_city:'home', category_marketing:'flag', category_invest:'invoice', game:'emoji'
  };
  const validIcon = id => {
    if(iconOptions.has(id))return id;
    return Object.hasOwn(legacyIcons,id)?legacyIcons[id]:'bookmark';
  };
  const iconUrl = id => `./feed-assets/icons/${id}_outline_24.svg`;
  const iconImage = id => `<img class="icon" width="24" height="24" src="${iconUrl(id)}" alt="" draggable="false">`;
  const feedIconId = feed => isCustom(feed) ? validIcon(feed.icon) : feed.icon;
  const sidebarFeedIcon = feed => `<span class="icon cf-sidebar-feed-mask" style="--cf-icon-mask: url(${iconUrl(feedIconId(feed))})" aria-hidden="true"></span>`;
  let baseActive = 'https://vc.ru/popular';
  const presets = [
    {id:'preset:ai',name:'Нейросети и технологии',icon:'neuro',description:'AI, ChatGPT, будущее и авторы о технологиях',sources:['topic:AI','topic:ChatGPT','topic:Будущее','author:КОД - техножурнал','author:Ринат Шакиров']},
    {id:'preset:business',name:'Бизнес и стартапы',icon:'rouble',description:'Предпринимательство, компании и новые идеи',sources:['topic:Бизнес','topic:Стартапы','author:Mikhail Tokovinin','author:Dmitry Filonov']},
    {id:'preset:travel',name:'Вокруг света',icon:'web',description:'Путешествия, города и жизнь за рубежом',sources:['topic:Путешествия','author:Владимир Титов']}
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
  const orderedFeeds = (order=state.order) => {
    const byId = new Map(all().map(feed=>[feed.id,feed]));
    const ids = [...new Set([...order,...byId.keys()])];
    return ids.map(id=>byId.get(id)).filter(Boolean);
  };
  const visibleFeeds = () => orderedFeeds().filter(feed=>state.visible.includes(feed.id));
  const save = () => {
    try {
      localStorage.setItem('vc-custom-feeds-v1',JSON.stringify(state));
      return true;
    } catch {
      toast('Не удалось сохранить настройки в браузере');
      return false;
    }
  };
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
    const feeds=visibleFeeds();
    const manageLabel=feeds.length?'Настроить ленты':'Добавить ленту';
    const manageIcon=feeds.length?'settings':'plus';
    mobileNav.innerHTML='<div class="cf-mobile-scroll" role="tablist" aria-label="Ленты">'+baseFeeds.map(([url,name])=>`<button type="button" role="tab" aria-selected="${!state.active && baseActive===url}" data-mobile-base="${url}">${name}</button>`).join('')+feeds.map(f=>`<button type="button" role="tab" aria-selected="${state.active===f.id}" data-mobile-feed="${esc(f.id)}">${esc(f.name)}</button>`).join('')+`</div><div class="cf-mobile-actions"><button type="button" class="cf-icon cf-sort-trigger cf-mobile-sort" aria-label="Сортировка ленты" aria-haspopup="menu" aria-controls="cf-sort-popover" aria-expanded="false"><svg class="icon" width="24" height="24" aria-hidden="true"><use href="#sprite-sort"></use></svg></button><button type="button" class="cf-icon cf-mobile-manage" aria-label="${manageLabel}" title="${manageLabel}"><svg class="icon" width="24" height="24" aria-hidden="true"><use href="#sprite-${manageIcon}"></use></svg></button></div>`;
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
  let draft, opener, pendingOrder=[];
  let pendingVisible=new Set();
  const uiIcon=(name,size=24)=>`<svg class="icon" width="${size}" height="${size}" aria-hidden="true"><use href="#sprite-${name}"></use></svg>`;
  const head=(title,back=false)=>`<header class="cf-head">${back?`<button class="cf-icon" data-action="back" aria-label="Назад">${uiIcon('back',22)}</button>`:''}<h2 id="cf-title">${title}</h2><button class="cf-icon" data-action="close" aria-label="Закрыть">${uiIcon('cross',22)}</button></header>`;
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
  function feedRow(feed) {
    const custom=isCustom(feed);
    const id=esc(feed.id);
    const name=esc(feed.name);
    return `<li class="cf-row" data-feed-row="${id}">
      <div class="cf-feed-icon">${iconImage(feedIconId(feed))}</div>
      <label class="cf-info" for="cf-${id}"><div class="cf-name">${name}</div><div class="cf-sub">${esc(custom?feedSourceCount(feed):feed.description)}</div></label>
      <div class="cf-row-actions">
        ${custom?`<button class="cf-icon" data-edit="${id}" aria-label="Редактировать ${name}">${uiIcon('pen')}</button>`:''}
        <span class="cf-visibility">
          <input type="checkbox" id="cf-${id}" data-visible="${id}" ${pendingVisible.has(feed.id)?'checked':''} aria-label="Показывать ${name}">
          <span class="cf-visibility-icon" aria-hidden="true"></span>
        </span>
        <button type="button" class="cf-icon cf-grip" aria-label="Переместить «${name}»" aria-describedby="cf-reorder-help" aria-keyshortcuts="ArrowUp ArrowDown" title="Перетащить">${gripIcon}</button>
      </div>
    </li>`;
  }
  function renderManagerRows() {
    $('.cf-feed-list',dialog).innerHTML=orderedFeeds(pendingOrder).map(feedRow).join('');
  }
  function managerChanged() {
    return pendingVisible.size!==state.visible.length || state.visible.some(id=>!pendingVisible.has(id))
      || orderedFeeds().some((feed,index)=>feed.id!==pendingOrder[index]);
  }
  function updateManagerSave() {
    $('[data-action="save-manager"]',dialog).disabled=!managerChanged();
  }
  function manager() {
    draft=null;
    dialog.innerHTML=head('Ваши ленты')+`
      <div class="cf-body">
        <span id="cf-reorder-help" hidden>Перетащите ленту или нажмите стрелку вверх или вниз на клавиатуре</span>
        <ul class="cf-feed-list" aria-label="Ленты"></ul>
        <button type="button" class="cf-row cf-add-feed-row" data-action="create">
          <span class="cf-feed-icon">${uiIcon('plus')}</span><span class="cf-name">Добавить свою ленту</span>
        </button>
      </div>
      <footer class="cf-foot">
        <button type="button" class="cf-primary" data-action="save-manager">Сохранить</button>
      </footer>`;
    renderManagerRows();
    updateManagerSave();
  }
  function moveFeed(id, offset, draggedTop) {
    const feeds=orderedFeeds(pendingOrder);
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
    pendingOrder=feeds.map(feed=>feed.id);
    renderManagerRows();
    updateManagerSave();
    dialog.querySelectorAll('[data-feed-row]').forEach(row=>{
      if(motion){
        const distance=previousTops.get(row.dataset.feedRow)-row.getBoundingClientRect().top;
        if(distance)row.animate([{transform:`translateY(${distance}px)`},{transform:'none'}],{duration:200,easing:'ease-out'});
      }
      if(row.dataset.feedRow===id){
        $('.cf-grip',row).focus({preventScroll:true});
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
    const handle=event.target.closest('.cf-grip');
    if(!handle || event.button!==0 || !event.isPrimary)return;
    const row=handle.closest('[data-feed-row]');
    drag={row, startY:event.clientY, startTop:row.getBoundingClientRect().top, offset:0};
    handle.setPointerCapture(event.pointerId);
  });
  dialog.addEventListener('pointermove',event=>{
    if(!drag || !event.isPrimary)return;
    if(!event.buttons){endDrag();return;}
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
    moveFeed(row.dataset.feedRow,offset,draggedTop);
  });
  dialog.addEventListener('pointercancel',endDrag);
  dialog.addEventListener('lostpointercapture',endDrag);
  dialog.addEventListener('keydown',event=>{
    const handle=event.target.closest('.cf-grip');
    if(!handle || !['ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();
    moveFeed(handle.closest('[data-feed-row]').dataset.feedRow,event.key==='ArrowUp'?-1:1);
  });
  const editableSources = feed => new Set(feed.sources.filter(id=>sourceIds.has(id)));
  function canSaveDraft() {
    if(!draft.sources.length)return false;
    const original=state.custom.find(feed=>feed.id===draft.id);
    if(!original)return true;
    const name=draft.name.trim();
    if(!name)return false;
    const originalSources=editableSources(original);
    return name!==original.name.trim() || validIcon(draft.icon)!==validIcon(original.icon)
      || draft.sources.length!==originalSources.size || draft.sources.some(id=>!originalSources.has(id));
  }
  function sourcePanel(view,id,hidden=false) {
    const {search,select}=sourceGroups[view];
    return `<div id="${id}" data-source-panel="${view}" ${hidden?'hidden':''}>
      <input class="cf-input" type="search" placeholder="${search}" aria-label="${search}" data-source-search>
      <button type="button" class="cf-primary cf-secondary cf-select-sources" data-action="select-sources">${select}</button>
      <div data-source-results></div>
    </div>`;
  }
  function editor(id) {
    const existing=state.custom.find(f=>f.id===id);
    draft=existing?{...existing,icon:validIcon(existing.icon),sources:[...editableSources(existing)]}:{name:'',sources:[],icon:'bookmark'};
    dialog.innerHTML=head(existing?'Редактировать ленту':'Новая лента',true)+`
      <form id="cf-form">
        <div class="cf-body">
          <label class="cf-label" for="cf-name">Название</label>
          <div class="cf-name-control">
            <button type="button" class="cf-icon cf-name-icon" data-action="pick-icon" aria-label="Выбрать иконку ленты" aria-expanded="false" aria-controls="cf-icon-popover">${iconImage(draft.icon)}</button>
            <input class="cf-input" id="cf-name" placeholder="Название ленты" maxlength="40" required value="${esc(draft.name)}" aria-describedby="cf-name-count cf-name-error">
            <span class="cf-count" id="cf-name-count" aria-label="Осталось символов">${40-draft.name.length}</span>
          </div>
          <div class="cf-error" id="cf-name-error" role="alert"></div>
          <div class="cf-icon-popover" id="cf-icon-popover" popover="auto" role="group" aria-label="Иконка ленты"><div class="cf-icon-grid"></div></div>
          <div class="cf-source-picker">
            <div class="cf-source-switch" role="group" aria-label="Источники ленты">
              <button type="button" data-source-view="authors" aria-pressed="true" aria-controls="cf-author-panel">Авторы</button>
              <button type="button" data-source-view="trends" aria-pressed="false" aria-controls="cf-trend-panel">Тренды</button>
            </div>
            ${sourcePanel('authors','cf-author-panel')}
            ${sourcePanel('trends','cf-trend-panel',true)}
          </div>
        </div>
        <footer class="cf-foot">
          ${existing?'<button class="cf-primary cf-secondary cf-danger" type="button" data-action="delete">Удалить ленту</button>':''}
          <button class="cf-primary" id="cf-save" type="submit">Сохранить</button>
        </footer>
      </form>`;
    dialog.querySelectorAll('[data-source-panel]').forEach(renderSourceResults);
    updateEditorControls();
    renderIcons();
    const popup=$('#cf-icon-popover',dialog);
    popup.addEventListener('toggle',event=>$('.cf-name-icon',dialog)?.setAttribute('aria-expanded',String(event.newState==='open')));
    $('.cf-body',dialog).addEventListener('scroll',()=>popup.hidePopover());
    const nameInput=$('#cf-name',dialog);
    nameInput.setCustomValidity(draft.name.trim()?'':'Введите название ленты');
    nameInput.focus();
    $('#cf-form',dialog).onsubmit=e=>{
      e.preventDefault();
      if(!canSaveDraft())return;
      const name=draft.name.trim();
      if(all().some(f=>f.id!==draft.id&&f.name.toLocaleLowerCase()===name.toLocaleLowerCase())){
        const error=$('#cf-name-error',dialog);
        error.textContent='Лента с таким названием уже существует';
        nameInput.setAttribute('aria-invalid','true');
        nameInput.focus();
        error.scrollIntoView({block:'nearest'});
        return;
      }
      const feed={id:draft.id||'custom:'+crypto.randomUUID(),name,icon:validIcon(draft.icon),sources:[...draft.sources]};
      const index=state.custom.findIndex(f=>f.id===feed.id);
      if(index<0){
        state.custom.push(feed);
        state.visible.push(feed.id);
        pendingVisible.add(feed.id);
        pendingOrder.push(feed.id);
        state.active=feed.id;
      }else state.custom[index]=feed;
      save();
      renderFeed();
      manager();
      toast(index<0?'Лента создана':'Изменения сохранены');
    };
  }
  function updateEditorControls() {
    dialog.querySelectorAll('[data-source-panel]').forEach(panel=>{
      const {ids,select,clear}=sourceGroups[panel.dataset.sourcePanel];
      $('[data-action="select-sources"]',panel).textContent=ids.every(id=>draft.sources.includes(id))?clear:select;
    });
    $('#cf-save',dialog).disabled=!canSaveDraft();
  }
  function renderSourceResults(panel) {
    const {items,empty}=sourceGroups[panel.dataset.sourcePanel];
    const query=$('[data-source-search]',panel).value.trim().toLocaleLowerCase();
    const results=items.filter(source=>source.name.toLocaleLowerCase().includes(query));
    $('[data-source-results]',panel).innerHTML=results.map(source=>{
      const avatar=panel.dataset.sourcePanel==='authors'
        ? `<span class="cf-avatar">${source.image?`<img src="${esc(source.image)}" alt="">`:esc(source.name.slice(0,1))}</span>`
        : '';
      return `<label class="cf-row">${avatar}<span class="cf-info cf-name">${esc(source.name)}</span><input type="checkbox" class="cf-check" data-source="${esc(source.id)}" ${draft.sources.includes(source.id)?'checked':''} aria-label="${esc(source.name)}"></label>`;
    }).join('')||`<p class="cf-hint">${empty}</p>`;
  }
  const sidebar = document.querySelector('.sidebar');
  const feedSection = sidebar?.querySelector('.sidebar__section');
  const feedList = feedSection?.querySelector('.sidebar__section-content');
  const openManager = event => {
    opener=event.currentTarget;
    pendingVisible=new Set(state.visible);
    pendingOrder=orderedFeeds().map(feed=>feed.id);
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
    sidebarFeeds.innerHTML = visibleFeeds().map(f=>`<button type="button" class="sidebar-item cf-sidebar-feed ${state.active===f.id?'sidebar-item--active':''}" data-feed="${esc(f.id)}" ${state.active===f.id?'aria-current="page"':''} title="${esc(f.name)}">${sidebarFeedIcon(f)}<div class="sidebar-item__text"><span class="sidebar-item__label">${esc(f.name)}</span></div></button>`).join('');
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
    strip.innerHTML=[...iconOptions].map(([id,name])=>`<button type="button" class="cf-icon-option" data-icon="${id}" aria-label="${name}" title="${name}" aria-pressed="${validIcon(draft.icon)===id}">${iconImage(id)}</button>`).join('');
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
      const button=$('.cf-name-icon',dialog);button.innerHTML=iconImage(draft.icon);
      $('#cf-icon-popover',dialog).hidePopover();button.setAttribute('aria-expanded','false');button.focus({preventScroll:true});
      updateEditorControls();
    }
    if(b.dataset.action==='close')dialog.close();
    if(b.dataset.action==='back')manager();
    if(b.dataset.action==='create')editor();
    if(b.dataset.edit)editor(b.dataset.edit);
    if(b.dataset.action==='save-manager' && managerChanged()){
      const previous=state;
      state={
        ...state,
        visible:[...pendingVisible],
        order:[...pendingOrder],
        active:pendingVisible.has(state.active)?state.active:null
      };
      if(!save()){
        state=previous;
        return;
      }
      renderFeed();
      dialog.close();
    }
    if(b.dataset.sourceView){
      dialog.querySelectorAll('[data-source-view]').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));
      $('#cf-author-panel',dialog).hidden=b.dataset.sourceView!=='authors';
      $('#cf-trend-panel',dialog).hidden=b.dataset.sourceView!=='trends';
    }
    if(b.dataset.action==='select-sources'){
      const panel=b.closest('[data-source-panel]');
      const {ids}=sourceGroups[panel.dataset.sourcePanel];
      const allSelected=ids.every(id=>draft.sources.includes(id));
      draft.sources=allSelected
        ? draft.sources.filter(id=>!ids.includes(id))
        : [...new Set([...draft.sources,...ids])];
      renderSourceResults(panel);
      updateEditorControls();
    }

    if(b.dataset.action==='delete'){
      const id=draft.id;dialog.innerHTML=head('Удалить ленту?',true)+`<div class="cf-body"><p class="cf-intro">Лента «${esc(draft.name)}» будет удалена. Вы сможете создать новую подборку в любой момент.</p></div><footer class="cf-foot"><button class="cf-primary" data-action="confirm-delete">Удалить</button></footer>`;
      $('[data-action="back"]',dialog).onclick=e=>{e.stopPropagation();editor(id);};
    }
    if(b.dataset.action==='confirm-delete'){const id=draft.id;state.custom=state.custom.filter(f=>f.id!==id);state.order=state.order.filter(x=>x!==id);state.visible=state.visible.filter(x=>x!==id);pendingVisible.delete(id);pendingOrder=pendingOrder.filter(x=>x!==id);if(state.active===id)state.active=null;save();renderFeed();manager();toast('Лента удалена');}
  });
  dialog.addEventListener('change',e=>{
    const input=e.target;
    if(input.dataset.visible){
      const id=input.dataset.visible;
      if(input.checked)pendingVisible.add(id);
      else pendingVisible.delete(id);
      updateManagerSave();
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
      e.target.setCustomValidity(draft.name.trim()?'':'Введите название ленты');
      $('#cf-name-count',dialog).textContent=40-draft.name.length;
      e.target.removeAttribute('aria-invalid');
      $('#cf-name-error',dialog).textContent='';
      updateEditorControls();
    }
    if(e.target.hasAttribute('data-source-search'))renderSourceResults(e.target.closest('[data-source-panel]'));
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
