/* ═══════════════════════════════════════════════════════════════
   CONFIGURATION — edit the arrays below to populate the site

   HOW TO ADD PHOTOS
   ─────────────────
   1. Drop image files into  images/gallery/
   2. Add an entry: { src, caption_en, caption_zh }
   3. git push → Netlify auto-deploys

   HOW TO ADD VIDEOS
   ─────────────────
   YouTube: https://www.youtube.com/embed/VIDEO_ID
   Vimeo  : https://player.vimeo.com/video/VIDEO_ID

   HOW TO UPDATE THE SCHEDULE
   ──────────────────────────
   Edit SCHEDULE. loc_en/loc_zh = studio name, day_en/day_zh = weekday, time = displayed as-is.
*/

const GALLERY_ITEMS = [
  { src: "images/gallery/ziling3.jpg", caption_en: "Ziling Ma — solo performance",       caption_zh: "马子玲老师独舞" },
  { src: "images/gallery/ziling4.jpg", caption_en: "Ensemble performance",                caption_zh: "群舞演出" },
  { src: "images/gallery/ziling1.JPG", caption_en: "Ziling Ma — Chinese Classical Dance", caption_zh: "中国古典舞老师马子玲" },
  // Add more photos here as the gallery grows
];

const VIDEOS = [
  { url: "https://www.youtube.com/embed/QC90JP2fgz0", title_en: "", title_zh: "" },
  { url: "https://www.youtube.com/embed/WfOysq66WiE", title_en: "", title_zh: "" },
  { url: "https://www.youtube.com/embed/ugDI6wplhfQ", title_en: "", title_zh: "" },
  { url: "https://www.youtube.com/embed/k8I9YhdCqNU", title_en: "", title_zh: "", short: true },
  { url: "https://www.youtube.com/embed/B8OeQrKqe6M", title_en: "", title_zh: "", short: true },
];

const SCHEDULE = [
  { loc_en: "Westborough", loc_zh: "韦斯特伯勒", day_en: "Sunday",   day_zh: "周日", time: "6:00 – 7:30 PM"   },
  { loc_en: "Westborough", loc_zh: "韦斯特伯勒", day_en: "Monday",   day_zh: "周一", time: "7:30 – 9:00 PM",  class_en: "Shenyun + Combinations", class_zh: "神韵+组合" },
  { loc_en: "Natick",      loc_zh: "纳蒂克",     day_en: "Saturday", day_zh: "周六", time: "6:30 – 8:00 PM"   },
  { loc_en: "Cambridge",   loc_zh: "剑桥",       day_en: "Sunday",   day_zh: "周日", time: "10:00 – 11:30 AM" },
];

/* ═══════════════════════════════════════
   LANGUAGE
═══════════════════════════════════════ */
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (LANG[lang][key] !== undefined) el.textContent = LANG[lang][key];
  });

  document.getElementById('lang-toggle').textContent = lang === 'en' ? '中文' : 'EN';

  // Bio language swap
  const bioEn = document.querySelector('.bio-en');
  const bioZh = document.querySelector('.bio-zh');
  if (bioEn) bioEn.style.display = lang === 'en' ? '' : 'none';
  if (bioZh) bioZh.style.display = lang === 'zh' ? '' : 'none';

  renderSchedule();
  renderVideos();
  renderGallery();
  localStorage.setItem('zilingLang', lang);
}

/* ═══════════════════════════════════════
   GALLERY + LIGHTBOX
═══════════════════════════════════════ */
let visibleItems = [];
let lbIndex = 0;

function renderGallery() {
  const grid = document.getElementById('gallery-grid');

  if (!GALLERY_ITEMS.length) {
    grid.innerHTML = `<div class="gallery-empty"><p>${currentLang === 'zh' ? '图片即将上传。将照片放入 images/gallery/ 文件夹后在 js/main.js 中添加路径。' : 'Photos coming soon. Add images to <code>images/gallery/</code> and update <code>js/main.js</code>.'}</p></div>`;
    grid.classList.remove('grid-active');
    return;
  }

  visibleItems = [...GALLERY_ITEMS];

  // Mosaic pattern per group of 5: large(2×2), normal, normal, normal, wide(2×1)
  const sizeClass = i => { const p = i % 5; if (p === 0) return 'large'; if (p === 4) return 'wide'; return ''; };

  grid.classList.add('grid-active');
  grid.innerHTML = visibleItems.map((item, i) => {
    const cls = sizeClass(i);
    const caption = currentLang === 'zh' ? item.caption_zh : item.caption_en;
    return `
      <div class="gallery-item${cls ? ' ' + cls : ''}" data-idx="${i}" role="button" tabindex="0" aria-label="View photo">
        <img src="${item.src}" alt="${caption}" loading="lazy">
        ${caption ? `<span class="gallery-caption">${caption}</span>` : ''}
      </div>`;
  }).join('');

  grid.querySelectorAll('.gallery-item').forEach(el => {
    el.addEventListener('click', () => openLightbox(+el.dataset.idx));
    el.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(+el.dataset.idx); });
  });
}

function openLightbox(idx) {
  lbIndex = idx;
  updateLightboxImage();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightboxImage() {
  const item = visibleItems[lbIndex];
  if (!item) return;
  document.getElementById('lb-img').src = item.src;
  document.getElementById('lb-caption').textContent =
    currentLang === 'zh' ? item.caption_zh : item.caption_en;
}

function lbPrev() { lbIndex = (lbIndex - 1 + visibleItems.length) % visibleItems.length; updateLightboxImage(); }
function lbNext() { lbIndex = (lbIndex + 1) % visibleItems.length; updateLightboxImage(); }

function initLightbox() {
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', lbPrev);
  document.getElementById('lb-next').addEventListener('click', lbNext);
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   lbPrev();
    if (e.key === 'ArrowRight')  lbNext();
  });
}

/* ═══════════════════════════════════════
   SCHEDULE
═══════════════════════════════════════ */
function renderSchedule() {
  const t = LANG[currentLang];

  document.getElementById('schedule-table').innerHTML = `
    <thead>
      <tr>
        <th>${t.sched_loc}</th>
        <th>${t.sched_day}</th>
        <th>${t.sched_time}</th>
      </tr>
    </thead>
    <tbody>
      ${SCHEDULE.map(r => {
        const cls = currentLang === 'zh' ? r.class_zh : r.class_en;
        return `
        <tr>
          <td class="td-loc">${currentLang === 'zh' ? r.loc_zh : r.loc_en}</td>
          <td class="td-day">${currentLang === 'zh' ? r.day_zh : r.day_en}</td>
          <td class="td-time">${r.time}${cls ? `<span class="sched-tag">${cls}</span>` : ''}</td>
        </tr>`;
      }).join('')}
    </tbody>`;
}

/* ═══════════════════════════════════════
   VIDEOS
═══════════════════════════════════════ */
function renderVideos() {
  const wrap = document.getElementById('video-grid');
  if (!VIDEOS.length) {
    wrap.innerHTML = `<div class="video-empty"><p>${currentLang === 'zh' ? '视频即将上线。请在 js/main.js 中添加 YouTube/Vimeo 链接。' : 'Videos coming soon. Add YouTube or Vimeo embed URLs to <code>js/main.js</code>.'}</p></div>`;
    return;
  }

  const regular = VIDEOS.filter(v => !v.short);
  const shorts  = VIDEOS.filter(v =>  v.short);

  const iframeAttrs = 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"';

  const cardHTML = (v, cls, extraClass = '') => `
    <div class="video-card${extraClass ? ' ' + extraClass : ''}">
      <div class="${cls}">
        <iframe src="${v.url}" ${iframeAttrs}></iframe>
      </div>
      ${(v.title_en || v.title_zh) ? `<p class="video-title">${currentLang === 'zh' ? v.title_zh : v.title_en}</p>` : ''}
    </div>`;

  wrap.innerHTML = `
    ${regular.length ? `<div class="video-grid-regular">${regular.map((v, i) => cardHTML(v, 'video-embed', i === 0 ? 'video-card-featured' : '')).join('')}</div>` : ''}
    ${shorts.length  ? `<div class="video-grid-shorts">${shorts.map(v => cardHTML(v, 'video-embed-short')).join('')}</div>` : ''}
  `;
}

/* ═══════════════════════════════════════
   NAV SCROLL STATE
═══════════════════════════════════════ */
function initNav() {
  const nav  = document.getElementById('nav');
  const hero = document.getElementById('hero');
  new IntersectionObserver(([e]) => {
    nav.classList.toggle('scrolled', !e.isIntersecting);
  }, { threshold: 0.15 }).observe(hero);
}

/* ═══════════════════════════════════════
   MOBILE HAMBURGER
═══════════════════════════════════════ */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.classList.remove('open');
    links.classList.remove('open');
  }));
}

/* ═══════════════════════════════════════
   SCROLL FADE-IN
═══════════════════════════════════════ */
function initFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-section').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHamburger();
  initLightbox();
  initFadeIn();

  document.getElementById('lang-toggle').addEventListener('click', () => {
    setLang(currentLang === 'en' ? 'zh' : 'en');
  });

  const saved = localStorage.getItem('zilingLang') || 'en';
  setLang(saved);
});
