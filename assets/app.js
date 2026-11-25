(() => {
  const items = Array.isArray(window.WORK) ? window.WORK : (typeof WORK !== 'undefined' ? WORK : []);
  const categories = ['All','Reel scripts','Billboards','Social media','Long-form','Spec work','Poetry'];
  const DISPLAY = {'Reel scripts':'Reel Scripts','Social media':'Social','Long-form':'Long-form','Spec work':'Spec Work'};
  const showNames = (name) => DISPLAY[name] || name;
  const asset = 'assets/';
  let filter='All'; let limit=6; let previousFocus=null;
  const e=(s)=>String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const clean=(s)=>String(s??'').replace(/^[“”]/g,'').slice(0,130);
  const filters=document.getElementById('workFilters');
  const grid=document.getElementById('workGrid');
  if(!grid)return;
  function visual(item){
    if(item.image && item.image.startsWith('p')) return `<div class="card-media"><img loading="lazy" src="${asset+e(item.image)}" alt="Portfolio artwork for ${e(item.client)}"></div>`;
    const type=item.type==='Poetry'?'poem':item.type==='Spec work'?'spec':item.type==='Long-form'?'longform':'';
    const phrase=(item.teaser||item.title).replaceAll('“','').replaceAll('”','');
    return `<div class="card-media"><div class="typographic-img ${type}">${e(phrase)}</div></div>`;
  }
  function card(item){return `<article class="work-card">${visual(item)}<div class="card-content"><span class="card-type">${e(showNames(item.type).toUpperCase())} · ${e(item.client.toUpperCase())}</span><h3>${e(item.title)}</h3><p>${e(item.brief)}</p><button type="button" data-project="${e(item.id)}">Explore project <span>↗</span></button></div></article>`}
  function renderFilters(){filters.innerHTML=categories.map(c=>`<button type="button" data-filter="${e(c)}" class="${c===filter?'active':''}" aria-pressed="${c===filter}">${e(showNames(c))}</button>`).join('')}
  function render(){
    renderFilters();const matched=filter==='All'?items:items.filter(x=>x.type===filter);
    grid.innerHTML=matched.slice(0,limit).map(card).join('');
    document.getElementById('visibleCount').textContent=String(matched.length).padStart(2,'0');
    const more=document.getElementById('loadMore');more.hidden=matched.length<=limit;more.textContent='Show more work ↗';
    if(!matched.length)grid.innerHTML='<p>No items in this category yet.</p>';
  }
  function chooseFilter(value,scroll=true){filter=categories.includes(value)?value:'All';limit=6;render();if(scroll)document.querySelector('#work')?.scrollIntoView({behavior:'smooth',block:'start'});}
  filters.addEventListener('click',ev=>{const btn=ev.target.closest('[data-filter]');if(btn) chooseFilter(btn.dataset.filter,false)});
  document.querySelector('#loadMore')?.addEventListener('click',()=>{limit+=6;render()});
  document.querySelectorAll('[data-category-link]').forEach(link=>link.addEventListener('click',()=>{const value=link.dataset.categoryLink;if(value==='Poetry'){chooseFilter(value,false)}else chooseFilter(value,false)}));
  document.querySelectorAll('[data-filter-direct]').forEach(link=>link.addEventListener('click',()=>chooseFilter(link.dataset.filterDirect)));
  const modal=document.getElementById('projectModal');const inner=document.getElementById('modalInner');const modalClose=document.getElementById('modalClose');
  const scripts={
    trees:[['HOOK','Wide shot of a big tree. “What if some of your child’s favourite teachers never actually taught a class?”'],['SCENE 01','The camera moves from the textured bark to the canopy. “Some of the most experienced teachers on this campus have never stepped inside a classroom.”'],['SCENE 02','Children gather in a circle beneath the tree while the educator sits with them. “They’ve watched thousands of conversations, making room for every question, every story and every curious pause.”'],['OUTRO','The scene returns to the tree, alone again. Prakriya Green Wisdom School — Education for Life.']],
    under:[['HOOK','A close-up of a pottery wheel moving. “There is a strange expectation that growth should always look flawless.”'],['SCENE','Mud-covered hands shape clay; a student adjusts a dance movement; a sketch is erased and begun again.'],['CLOSING','“Here, finishing isn’t the goal. We are much more interested in what you are becoming.”']],
    headphones:[['THE BRIEF','Write a six-word story that sells noise-cancelling headphones.'],['THE IDEA','The world screams. She chose silence.'],['THE THINKING','The line sells the feeling of choosing silence without needing to name the product.']],
    brick:[['THE BRIEF','Sell an ordinary red brick in fewer than fifty words.'],['THE THOUGHT','Entire worlds can start with this brick. Its ancestors have been holding up civilizations, empires, and kingdoms. Lay the first one. History is in your hands.']]
  };
  function openModal(id){
    const w=items.find(x=>x.id===id);if(!w)return;
    previousFocus=document.activeElement;
    const photo=w.image?`<img class="modal-image" src="${asset+e(w.image)}" alt="Portfolio visual from ${e(w.client)}">`:`<div class="modal-typography">${e(w.teaser||w.title)}</div>`;
    const extra=scripts[id]?`<div class="modal-extra"><h3>SELECTED SCRIPT & CREATIVE NOTES</h3>${scripts[id].map(([k,v])=>`<div class="script-line"><strong>${e(k)}</strong><span>${e(v)}</span></div>`).join('')}</div>`:'';
    inner.innerHTML=`<span class="modal-kicker">${e(showNames(w.type).toUpperCase())} / SELECTED PORTFOLIO</span><h2 id="modalTitle">${e(w.title)}</h2><p class="modal-client">${e(w.client)} · ${e(w.label)}</p>${photo}<div class="modal-columns"><div><h3>THE BRIEF</h3><p>${e(w.brief)}</p></div><div><h3>THE WORDS</h3><blockquote>${e(w.excerpt||w.teaser)}</blockquote></div></div>${extra}<div class="modal-links">${w.link?`<a href="${e(w.link)}" target="_blank" rel="noopener noreferrer">${e(w.linkLabel||'View published work')} ↗</a>`:''}<a class="secondary" href="Aastha%20portfolio.pdf#page=${Number(w.page)}" target="_blank" rel="noopener noreferrer">Read in original portfolio · p. ${Number(w.page)} ↗</a></div><p class="modal-footnote">Work samples and project descriptions are based on Aastha’s supplied 30-page portfolio. Where the original includes published links, they are provided above. Images are from the supplied portfolio or are decorative concept imagery.</p>`;
    modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');modalClose.focus();
  }
  function closeModal(){modal.hidden=true;modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');previousFocus?.focus()}
  document.body.addEventListener('click',ev=>{const btn=ev.target.closest('[data-project]');if(btn){ev.preventDefault();openModal(btn.dataset.project)}});
  document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));modalClose?.addEventListener('click',closeModal);
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape' && !modal.hidden)closeModal();if(ev.key==='Tab'&&!modal.hidden){const links=[...modal.querySelectorAll('a[href],button:not([disabled])')];const first=links[0],last=links[links.length-1];if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus()}else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus()}}});
  const menuBtn=document.getElementById('menuToggle');const menu=document.getElementById('mobileMenu');menuBtn?.addEventListener('click',()=>{let open=menu.hidden;menu.hidden=!open;menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu')});
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;menuBtn.setAttribute('aria-expanded','false')}));
  render();
})();
