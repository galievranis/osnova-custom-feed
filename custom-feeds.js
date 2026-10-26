(() => {
  'use strict';
  const variant = new URLSearchParams(location.search).get('variant') === '2' ? 2 : 1;
  document.documentElement.dataset.feedVariant = String(variant);
  const $ = (s, root = document) => root.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const posts = [...document.querySelectorAll('.content-list .content')];
  const authors = [...new Map(posts.map(p => {
    const a = $('.author__name', p);
    return a ? [a.textContent.trim(), {id:'author:' + a.textContent.trim(),name:a.textContent.trim(),image:$('.author__avatar img', p)?.getAttribute('src')}] : null;
  }).filter(Boolean)).values()];
  const referenceAvatars = {"Маркетинг": "./feed-assets/source-0.webp", "Сервисы": "./feed-assets/source-1.webp", "AI": "./feed-assets/source-2.webp", "S.Capusta": "./feed-assets/source-3.webp", "Joe cocker": "./feed-assets/source-4.webp"};
  const topics = ['AI','Будущее','ChatGPT','Путешествия','Бизнес','Стартапы','Маркетинг','Дизайн','Технологии','Финансы'].map(name => ({id:'topic:'+name,name,image:referenceAvatars[name] || [...document.querySelectorAll('.content')].find(p=>p.querySelector('.content-header__topic')?.textContent.trim()===name)?.querySelector('.author__avatar-sticker img')?.getAttribute('src')}));
  Object.entries(referenceAvatars).filter(([name]) => !topics.some(t=>t.name===name) && !authors.some(a=>a.name===name)).forEach(([name,image]) => {
    (name==='Сервисы'?topics:authors).push({id:(name==='Сервисы'?'topic:':'author:')+name,name,image});
  });
  const tags=['нейросети','бизнес','стартапы','дизайн','маркетинг','технологии','путешествия','продукт','разработка'].map(name=>({id:'tag:'+name,name}));
  const sources = [...topics,...authors,...tags];
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
  let state = {custom:[], visible:[], active:null};
  try {
    const saved = JSON.parse(localStorage.getItem('vc-custom-feeds-v1'));
    if (saved && Array.isArray(saved.custom) && Array.isArray(saved.visible)) {
      state.custom = saved.custom.filter(f => typeof f.id === 'string' && f.id.startsWith('custom:') && typeof f.name === 'string' && Array.isArray(f.sources)).map(f=>({...f,sources:f.sources.filter(id=>sources.some(s=>s.id===id))}));
      state.visible = saved.visible.filter(id=>[...presets,...state.custom].some(f=>f.id===id));
      state.active = state.visible.includes(saved.active) ? saved.active : null;
    }
  } catch {}
  const all = () => [...presets,...state.custom];
  const save = () => {try {localStorage.setItem('vc-custom-feeds-v1',JSON.stringify(state));} catch {toast('Не удалось сохранить настройки в браузере');}};
  const toast = text => {document.querySelector('.cf-status')?.remove();const e=document.createElement('div');e.className='cf-status';e.role='status';e.textContent=text;document.body.append(e);setTimeout(()=>e.remove(),3000);};
  const navbar = $('.feed-sorting .navbar');
  if (!navbar) return;
  const trigger=document.createElement('button');trigger.className='cf-trigger';trigger.title='Добавить ленту';trigger.setAttribute('aria-label','Добавить ленту');trigger.innerHTML='<svg class="icon" width="20" height="20" aria-hidden="true"><use href="#sprite-plus"></use></svg><span>Добавить ленту</span>';
  $('.navbar__right',navbar).prepend(trigger);

  const empty=document.createElement('div');empty.className='cf-empty';empty.hidden=true;empty.innerHTML='<h3>Пока нет публикаций</h3><p>В доступной ленте нет постов выбранных авторов и тем.</p>';$('.content-list')?.prepend(empty);
  const variantTabs = document.createElement('div');
  variantTabs.className='cf-variant-tabs';
  variantTabs.setAttribute('role','navigation');
  variantTabs.setAttribute('aria-label','Моя лента');
  $('.content-list')?.before(variantTabs);
  const variants = document.createElement('nav');
  variants.className='cf-variant-switch';variants.setAttribute('aria-label','Вариант интерфейса');
  variants.innerHTML=[1,2].map(v=>`<a href="?variant=${v}" ${v===variant?'aria-current="page"':''}>Вариант ${v}</a>`).join('');
  document.body.append(variants);
  if(variant===2 && state.active)baseActive='https://vc.ru/my';
  const sortOptions=[['date','По дате'],['popular','По популярности'],['viewed','Просмотренные']];
  let feedSort='date';
  const viewedPosts=new Set();
  const originalIndex=new Map(posts.map((p,i)=>[p,i]));
  const postPopularity=post=>{const buttons=post.querySelectorAll('button');const text=buttons[buttons.length-1]?.textContent.trim().replace(/\s/g,'').replace(',','.') || '0';return (parseFloat(text)||0)*(/k|к/i.test(text)?1000:1);};
  const sortPopup=document.createElement('div');sortPopup.className='cf-sort-popover';sortPopup.id='cf-sort-popover';sortPopup.setAttribute('popover','auto');sortPopup.setAttribute('role','menu');sortPopup.setAttribute('aria-label','Сортировка ленты');document.body.append(sortPopup);
  function renderSort(){sortPopup.innerHTML=sortOptions.map(([id,name])=>`<button type="button" role="menuitemradio" aria-checked="${feedSort===id}" data-sort="${id}"><span>${name}</span>${feedSort===id?'<svg class="icon" width="20" height="20" aria-hidden="true"><use href="#sprite-tick"></use></svg>':''}</button>`).join('');}
  sortPopup.onclick=event=>{const option=event.target.closest('[data-sort]');if(option){feedSort=option.dataset.sort;sortPopup.hidePopover();lastFeedKey=null;renderFeed();$('.cf-sort-trigger').focus();}};
  sortPopup.addEventListener('toggle',event=>$('.cf-sort-trigger')?.setAttribute('aria-expanded',String(event.newState==='open')));
  let lastFeedKey = null;
  function renderFeed() {

    if(variant===2 && state.active)baseActive='https://vc.ru/my';
    renderSidebar();
    const personalTabs = variant===2 && baseActive==='https://vc.ru/my';
    const tabFeeds=state.visible.map(id=>all().find(f=>f.id===id)).filter(Boolean);
    variantTabs.hidden=!personalTabs;
    document.documentElement.classList.toggle('cf-personal-v2',personalTabs);
    variantTabs.innerHTML=personalTabs ? `<div class="cf-feed-tabs-scroll" role="tablist" aria-label="Ленты"><button type="button" role="tab" aria-selected="${!state.active}" data-personal-feed="">Подписки</button>`+tabFeeds.map(f=>`<button type="button" role="tab" aria-selected="${state.active===f.id}" data-personal-feed="${esc(f.id)}">${esc(f.name)}</button>`).join('')+'</div><button type="button" class="cf-icon cf-sort-trigger" aria-label="Сортировка ленты" aria-haspopup="menu" aria-expanded="false" aria-controls="cf-sort-popover"><svg class="icon" width="24" height="24" aria-hidden="true"><use href="#sprite-sort"></use></svg></button>' : '';

    const feed=all().find(f=>f.id===state.active);
    const personal = Boolean(feed) || baseActive === 'https://vc.ru/my';
    document.querySelectorAll('.feed-page__news,.feed-page__seen-posts-count').forEach(e=>{e.hidden=personal;e.style.display=personal?'none':'';});
    const list=$('.content-list');
    const organic=posts.filter(p=>p.parentElement===list);
    const key=state.active || baseActive;
    if(key!==lastFeedKey){
      const shuffled=[...organic];
      for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
      if(personalTabs){
        if(feedSort==='popular')shuffled.sort((a,b)=>postPopularity(b)-postPopularity(a));
        else shuffled.sort((a,b)=>originalIndex.get(a)-originalIndex.get(b));
      }
      const slots=organic.map(p=>{const slot=document.createComment('post');p.replaceWith(slot);return slot;});
      slots.forEach((slot,i)=>slot.replaceWith(shuffled[i]));
      const size=Math.min(shuffled.length,8+Math.floor(Math.random()*5));
      shuffled.forEach((p,i)=>{p.dataset.feedVisible=String(i<size);});
      lastFeedKey=key;
    }
    [...list.children].forEach(e=>{
      if(e===empty)return;
      const isPost=organic.includes(e);
      const show=isPost ? (personalTabs && feedSort==='viewed' ? viewedPosts.has(e) : e.dataset.feedVisible!=='false') : !personal;
      e.hidden=!show;e.style.display=show?'':'none';
    });
    empty.hidden=!(personalTabs && feedSort==='viewed' && !organic.some(p=>!p.hidden));
    if(!empty.hidden)empty.innerHTML='<h3>Нет просмотренных постов</h3>';
    organic.filter(p=>!p.hidden).forEach(p=>viewedPosts.add(p));
    organic.forEach(p=>p.classList.remove('cf-first-post'));
    [...list.children].find(p=>p.classList.contains('content')&&!p.hidden)?.classList.add('cf-first-post');
    navbar.querySelectorAll('.tabs__tab').forEach(t=>t.classList.toggle('tabs__tab--active',(variant===2 || !feed) && t.dataset.localOriginalHref===baseActive));
  }

  variantTabs.onclick=event=>{
    const sortButton=event.target.closest('.cf-sort-trigger');
    if(sortButton){
      if(sortPopup.matches(':popover-open'))sortPopup.hidePopover();
      else {renderSort();sortPopup.showPopover();const anchor=sortButton.getBoundingClientRect();sortPopup.style.left=Math.max(16,Math.min(anchor.right-sortPopup.offsetWidth,innerWidth-sortPopup.offsetWidth-16))+'px';sortPopup.style.top=Math.min(anchor.bottom+8,innerHeight-sortPopup.offsetHeight-16)+'px';}
      return;
    }
    const button=event.target.closest('[data-personal-feed]');
    if(button){baseActive='https://vc.ru/my';state.active=button.dataset.personalFeed || null;save();renderFeed();}
  };
  navbar.querySelectorAll('.tabs__tab').forEach(t=>t.addEventListener('click',e=>{e.preventDefault();baseActive=t.dataset.localOriginalHref || 'https://vc.ru/popular';state.active=null;save();renderFeed();navbar.querySelectorAll('.tabs__tab').forEach(x=>x.classList.toggle('tabs__tab--active',x===t));}));
  const dialog=document.createElement('dialog');dialog.className='cf-dialog';dialog.setAttribute('aria-labelledby','cf-title');document.body.append(dialog);
  let draft, selectedVisible=[], opener;
  const head=(title,back=false)=>`<header class="cf-head">${back?'<button class="cf-icon" data-action="back" aria-label="Назад"><svg class="icon icon--back" width="22" height="22"><use href="#sprite-back"></use></svg></button>':''}<h2 id="cf-title">${title}</h2><button class="cf-icon" data-action="close" aria-label="Закрыть"><svg class="icon" width="22" height="22"><use href="#sprite-cross"></use></svg></button></header>`;
  const sourceCount = n => n + ' ' + (n % 10 === 1 && n % 100 !== 11 ? 'источник' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'источника' : 'источников');
  const row=(f,custom)=>`<div class="cf-row">${variant===1?`<div class="cf-feed-icon">${iconSVG(f.icon)}</div>`:''}<label class="cf-info" for="cf-${esc(f.id)}"><div class="cf-name">${esc(f.name)}</div><div class="cf-sub">${esc(custom?sourceCount(f.sources.length):f.description)}</div></label>${custom?`<button class="cf-icon" data-edit="${esc(f.id)}" aria-label="Редактировать ${esc(f.name)}"><svg class="icon icon--pen" width="24" height="24"><use href="#sprite-pen"></use></svg></button>`:''}<input class="cf-check" type="checkbox" id="cf-${esc(f.id)}" data-visible="${esc(f.id)}" ${selectedVisible.includes(f.id)?'checked':''} aria-label="Показывать ${esc(f.name)}"></div>`;
  function manager() {
    draft=null;
    dialog.innerHTML=head('Ваши ленты')+`<div class="cf-body"><h3 class="cf-section">Готовые подборки</h3>${presets.map(f=>row(f,false)).join('')}<h3 class="cf-section">Мои ленты</h3>${state.custom.length?state.custom.map(f=>row(f,true)).join(''):'<p class="cf-hint">Здесь будут ваши персональные подборки.</p>'}</div><footer class="cf-foot"><button class="cf-primary cf-secondary" data-action="create">Создать свою ленту</button></footer>`;
  }
  function editor(id) {
    const existing=state.custom.find(f=>f.id===id);
    draft=existing?{...existing,sources:[...existing.sources]}:{name:'',sources:[],icon:'bookmark'};
    dialog.innerHTML=head(existing?'Редактировать ленту':'Новая лента',true)+`<form id="cf-form"><div class="cf-body"><label class="cf-label" for="cf-name">Название</label><div class="cf-name-control">${variant===1?`<button type="button" class="cf-icon cf-name-icon" data-action="pick-icon" aria-label="Выбрать иконку ленты" aria-expanded="false" aria-controls="cf-icon-popover">${iconSVG(draft.icon)}</button>`:''}<input class="cf-input" id="cf-name" placeholder="Название ленты" maxlength="40" required value="${esc(draft.name)}" aria-describedby="cf-name-count"><span class="cf-count" id="cf-name-count" aria-label="Осталось символов">${40-draft.name.length}</span></div>${variant===1?'<div class="cf-icon-popover" id="cf-icon-popover" popover="auto" role="group" aria-label="Иконка ленты"><div class="cf-icon-grid"></div></div>':''}<div class="cf-source-picker"><input class="cf-input" id="cf-search" type="search" placeholder="Поиск авторов, тем и тегов" aria-label="Поиск авторов, тем и тегов"><div class="cf-segments" role="tablist" aria-label="Тип источников"><button type="button" role="tab" aria-selected="true" data-kind="topic">Темы</button><button type="button" role="tab" aria-selected="false" data-kind="author">Авторы</button><button type="button" role="tab" aria-selected="false" data-kind="tag">Теги</button></div><div id="cf-results"></div><div class="cf-error" role="alert"></div></div></div><footer class="cf-foot">${existing?'<button class="cf-danger" type="button" data-action="delete">Удалить ленту</button>':''}<button class="cf-primary" id="cf-save" type="submit">${existing?'Сохранить':'Создать ленту'}</button></footer></form>`;
    updateSources();if(variant===1){renderIcons();$('#cf-icon-popover',dialog).addEventListener('toggle',event=>$('.cf-name-icon',dialog)?.setAttribute('aria-expanded',String(event.newState==='open')));$('.cf-body',dialog).addEventListener('scroll',()=>$('#cf-icon-popover',dialog)?.hidePopover());}$('#cf-name',dialog).focus();
    $('#cf-form',dialog).onsubmit=e=>{e.preventDefault();const name=draft.name.trim();if(!name||!draft.sources.length)return;if(all().some(f=>f.id!==draft.id&&f.name.toLocaleLowerCase()===name.toLocaleLowerCase())){$('.cf-error',dialog).textContent='Лента с таким названием уже существует';return;}const feed={id:draft.id||'custom:'+crypto.randomUUID(),name,icon:validIcon(draft.icon),sources:[...draft.sources]};const i=state.custom.findIndex(f=>f.id===feed.id);if(i<0){state.custom.push(feed);selectedVisible.push(feed.id);}else state.custom[i]=feed;state.visible=[...selectedVisible];if(i<0)state.active=feed.id;if(!state.visible.includes(state.active))state.active=null;save();renderFeed();manager();toast(i<0?'Лента создана':'Изменения сохранены');};
  }
  function updateSources() {
    const kind=$('[data-kind][aria-selected=true]',dialog).dataset.kind;
    const query=$('#cf-search',dialog).value.trim().toLocaleLowerCase();
    const results=sources.filter(s=>s.id.startsWith(kind+':')&&s.name.toLocaleLowerCase().includes(query.replace(/^#/,'')));
    $('#cf-results',dialog).innerHTML=results.map((s,i)=>`<label class="cf-row"><span class="cf-avatar">${kind==='tag'?'#':s.image?`<img src="${esc(s.image)}" alt="">`:esc(s.name.slice(0,1))}</span><span class="cf-info"><span class="cf-name">${esc(s.name)}</span><div class="cf-sub">${kind==='topic'?'Тема':kind==='tag'?'Тег':'Автор'}</div></span><input type="checkbox" class="cf-check" data-source="${esc(s.id)}" ${draft.sources.includes(s.id)?'checked':''} aria-label="${esc(s.name)}"></label>`).join('')||'<p class="cf-hint">Ничего не найдено. Попробуйте другое имя или тему.</p>';
    $('#cf-save',dialog).disabled=!draft.name.trim()||!draft.sources.length;
  }
  trigger.onclick=()=>{opener=document.activeElement;selectedVisible=[...state.visible];manager();dialog.showModal();};
  const sidebar = document.querySelector('.sidebar');
  const feedSection = sidebar?.querySelector('.sidebar__section');
  const feedList = feedSection?.querySelector('.sidebar__section-content');
  const sidebarTitle = document.createElement('div');
  sidebarTitle.className = 'sidebar__title cf-sidebar-heading';
  sidebarTitle.innerHTML = '<span>Ленты</span><button type="button" class="cf-icon cf-sidebar-settings" aria-label="Настроить ленты" title="Настроить ленты"><svg class="icon icon--settings" width="22" height="22" aria-hidden="true"><use href="#sprite-settings"></use></svg></button>';
  feedSection?.prepend(sidebarTitle);
  const otherSection = document.createElement('div');
  otherSection.className = 'sidebar__section';
  otherSection.innerHTML = '<div class="sidebar__title">Прочее</div><div class="sidebar__section-content"></div>';
  ['https://vc.ru/m','https://vc.ru/discovery'].forEach(url => {
    const item = sidebar?.querySelector(`a[data-local-original-href="${url}"]`);
    if(item) otherSection.lastElementChild.append(item);
  });
  feedSection?.after(otherSection);
  const sidebarFeeds = document.createElement('div');
  sidebarFeeds.className = 'cf-sidebar-feeds';
  feedList?.append(sidebarFeeds);
  const openManager = event => { opener=event.currentTarget;selectedVisible=[...state.visible];manager();dialog.showModal(); };
  sidebarTitle.querySelector('button').onclick = openManager;
  if(variant===2){
    sidebarTitle.remove();
    [...otherSection.lastElementChild.children].forEach(item=>feedList.append(item));
    otherSection.remove();
    sidebarFeeds.hidden=true;
    const myLink=feedList.querySelector('a[data-local-original-href="https://vc.ru/my"]');
    const myRow=document.createElement('div');myRow.className='cf-my-feed-row';
    myLink?.before(myRow);if(myLink)myRow.append(myLink);
    const edit=document.createElement('button');edit.className='cf-icon cf-my-feed-edit';edit.type='button';
    edit.setAttribute('aria-label','Изменить ленты');edit.title='Изменить ленты';
    edit.innerHTML='<svg class="icon icon--pen" width="24" height="24"><use href="#sprite-pen"></use></svg>';
    edit.onclick=openManager;myRow.append(edit);
  }
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
    sidebarFeeds.innerHTML = (variant===2 ? [] : state.visible).map(id=>all().find(f=>f.id===id)).filter(Boolean).map(f=>`<button type="button" class="sidebar-item cf-sidebar-feed ${state.active===f.id?'sidebar-item--active':''}" data-feed="${esc(f.id)}" ${state.active===f.id?'aria-current="page"':''} title="${esc(f.name)}">${iconSVG(f.icon)}<div class="sidebar-item__text"><span class="sidebar-item__label">${esc(f.name)}</span></div></button>`).join('');
    feedList?.querySelectorAll('a.sidebar-item').forEach(a=>{
      const active = (variant===2 || !state.active) && a.dataset.localOriginalHref===baseActive;
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
  dialog.addEventListener('close',()=>opener?.focus());
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
    if(b.dataset.kind){dialog.querySelectorAll('[data-kind]').forEach(x=>x.setAttribute('aria-selected',String(x===b)));updateSources();}

    if(b.dataset.action==='delete'){
      const id=draft.id;dialog.innerHTML=head('Удалить ленту?',true)+`<div class="cf-body"><p class="cf-intro">Лента «${esc(draft.name)}» будет удалена. Вы сможете создать новую подборку в любой момент.</p></div><footer class="cf-foot"><button class="cf-primary" data-action="confirm-delete">Удалить</button></footer>`;
      $('[data-action="back"]',dialog).onclick=e=>{e.stopPropagation();editor(id);};
    }
    if(b.dataset.action==='confirm-delete'){const id=draft.id;state.custom=state.custom.filter(f=>f.id!==id);selectedVisible=selectedVisible.filter(x=>x!==id);state.visible=state.visible.filter(x=>x!==id);if(state.active===id)state.active=null;save();renderFeed();manager();toast('Лента удалена');}
  });
  dialog.addEventListener('change',e=>{const t=e.target;if(t.dataset.visible){selectedVisible=t.checked?[...selectedVisible,t.dataset.visible]:selectedVisible.filter(id=>id!==t.dataset.visible);state.visible=[...selectedVisible];if(!state.visible.includes(state.active))state.active=null;save();renderFeed();}if(t.dataset.source){draft.sources=t.checked?[...draft.sources,t.dataset.source]:draft.sources.filter(id=>id!==t.dataset.source);updateSources();}});
  dialog.addEventListener('input',e=>{if(e.target.id==='cf-name'){draft.name=e.target.value.slice(0,40);e.target.value=draft.name;$('#cf-name-count',dialog).textContent=40-draft.name.length;$('.cf-error',dialog).textContent='';$('#cf-save',dialog).disabled=!draft.name.trim()||!draft.sources.length;}if(e.target.id==='cf-search')updateSources();});
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
