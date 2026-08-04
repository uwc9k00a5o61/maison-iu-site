/* ============================================================================
   MAISON IU — Hero scroll-scrub watch  ·  Mobile & 3D дизайнер · Этап 3.4
   ----------------------------------------------------------------------------
   Контракт интеграции (Арт-директор):
     initHeroScrub({ mount:'#heroArt', lenis: window.__maisonLenis });
   → монтирует <canvas class="hero-watch"> в #heroArt, крутит 60 кадров орбиты
     по прогрессу hero-сцены. ScrollTrigger.refresh() вызывать ПОСЛЕ монтирования.

   ЕДИНЫЙ LENIS: модуль НЕ создаёт свой Lenis и НЕ дублирует rAF-петлю.

   МАСТЕР-ТАЙМЛАЙН (владелец пина — Арт-директор, applyPhase в home2):
   • Модуль экспортирует window.heroWatchSetProgress(p), p 0→1 — рисует кадр.
     Зови из applyPhase, напр.: heroWatchSetProgress(clamp(progress,0,0.5)/0.5).
   • Если на странице есть window.maisonHeroPhase ИЛИ на canvas стоит
     data-external="1" — модуль НЕ создаёт свой ScrollTrigger (ноль конфликтов,
     один пин). poster-first / preload / reduced-motion остаются.
   STANDALONE (нет мастера): модуль сам вешает ScrollTrigger на #hero
   (end +=90%), обновляемый твоим lenis.on('scroll', ScrollTrigger.update);
   если ScrollTrigger нет — прогресс через lenis / window.maisonOnScroll.

   Опции: { mount, lenis, frames=60, path='assets/hero-frames/orbit_', pad=3,
            ext='.jpg', poster='assets/hero-frames/poster.jpg',
            trigger='#hero', end='+=90%', ratio=760/944 }
   Бэк-компат: если на странице уже есть <canvas id="heroWatch"> — авто-init на нём.
   ========================================================================== */
(function (global) {
  'use strict';
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  function initHeroScrub(opts) {
    opts = opts || {};
    var mount = typeof opts.mount === 'string' ? document.querySelector(opts.mount) : opts.mount;

    var N     = opts.frames || 60;
    var PATH  = opts.path   || 'assets/hero-frames/orbit_';
    var PAD   = opts.pad    || 3;
    var EXT   = opts.ext    || '.jpg';
    var POSTER= opts.poster || (PATH + pad(1) + EXT);
    var RATIO = opts.ratio  || (760 / 944);
    var TRIG  = opts.trigger|| '#hero';
    var END   = opts.end    || '+=90%';
    var lenis = opts.lenis  || global.__maisonLenis || null;
    var reduce= matchMedia('(prefers-reduced-motion:reduce)').matches;

    function pad(i){ return String(i).padStart(PAD, '0'); }
    function src(i){ return PATH + pad(i + 1) + EXT; }

    // canvas: reuse existing #heroWatch canvas or create one inside mount
    var cv = document.getElementById('heroWatch');
    if (!cv || cv.tagName !== 'CANVAS') {
      cv = document.createElement('canvas');
      cv.id = 'heroWatch';
      cv.className = 'hero-watch';
      cv.setAttribute('aria-label', 'Люкс-часы MAISON IU');
      (mount || document.body).appendChild(cv);
    }
    if (cv.dataset.heroInit) return cv.__heroScrub;   // guard double-init
    cv.dataset.heroInit = '1';
    cv.style.aspectRatio = '760 / 944';

    var ctx = cv.getContext('2d', { alpha: true });
    var imgs = new Array(N), loaded = 0, cur = -1, ready = false;

    function size(){
      var w = cv.clientWidth || 320, h = w / RATIO;
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawIndex(cur < 0 ? 0 : cur, true);
    }
    function drawIndex(i, force){
      i = Math.max(0, Math.min(N - 1, i | 0));
      if (i === cur && !force) return;
      var im = imgs[i]; if (!im || !im.complete || !im.naturalWidth) return;
      cur = i;
      var W = cv.clientWidth, H = W / RATIO, iw = im.naturalWidth, ih = im.naturalHeight;
      var s = Math.max(W / iw, H / ih), w = iw * s, h = ih * s, x = (W - w) / 2, y = (H - h) / 2;
      ctx.clearRect(0, 0, W, H); ctx.drawImage(im, x, y, w, h);
    }
    function setProgress(p){ drawIndex(Math.round(clamp(p, 0, 1) * (N - 1))); }

    // poster-first instant paint
    var poster = new Image();
    poster.onload = function(){ if (!ready){ imgs[0] = poster; size(); } };
    poster.src = POSTER;

    // progressive preload
    for (var i = 0; i < N; i++) (function(i){
      var im = new Image();
      im.onload = im.onerror = function(){ if (++loaded >= N){ ready = true; drawIndex(cur < 0 ? 0 : cur, true); } };
      im.src = src(i); imgs[i] = im;
    })(i);

    var st = null;
    function bind(){
      if (reduce){ size(); setProgress(0.32); return; }               // reduced-motion → static ¾ frame
      // If a master timeline owns the pin (Art Director's applyPhase in home2), it drives frames
      // via window.heroWatchSetProgress(p). Then we do NOT create our own ScrollTrigger.
      var external = (cv.dataset.external === '1') || (typeof global.maisonHeroPhase === 'function');
      if (external){ size(); return; }
      if (global.ScrollTrigger){                                       // standalone: own shared ScrollTrigger
        st = global.ScrollTrigger.create({
          trigger: TRIG, start: 'top top', end: END, scrub: 0.6,
          onUpdate: function(self){ setProgress(self.progress); },
          onRefresh: size
        });
        size(); return;
      }
      // fallback: derive hero progress from scroll (via maisonOnScroll / lenis / window)
      var heroEl = document.querySelector(TRIG);
      function frac(){ if (!heroEl) return 0; var r = heroEl.getBoundingClientRect();
        return clamp(-r.top / (r.height || innerHeight), 0, 1); }
      function tick(){ setProgress(frac()); }
      if (typeof global.maisonOnScroll === 'function') global.maisonOnScroll(tick);
      else if (lenis && lenis.on) lenis.on('scroll', tick);
      else global.addEventListener('scroll', tick, { passive: true });
      size(); tick();
    }

    global.addEventListener('resize', size);
    if (document.readyState === 'complete') setTimeout(bind, 0);
    else global.addEventListener('load', function(){ setTimeout(bind, 0); });

    var api = { setProgress: setProgress, refresh: size,
      destroy: function(){ if (st) st.kill(); global.removeEventListener('resize', size); } };
    cv.__heroScrub = api;
    // Master-timeline hook: Art Director's applyPhase() calls this to sync frames to the single pin.
    // p is 0→1 across the "watch" phase, e.g. heroWatchSetProgress(clamp(progress,0,0.5)/0.5).
    global.heroWatchSetProgress = setProgress;
    return api;
  }

  global.initHeroScrub = initHeroScrub;

  // Backward-compat: legacy embed with a pre-placed <canvas id="heroWatch">.
  function auto(){
    var legacy = document.getElementById('heroWatch');
    if (legacy && legacy.tagName === 'CANVAS' && !legacy.dataset.heroInit){
      initHeroScrub({
        mount: legacy.parentNode,
        frames: parseInt(legacy.dataset.frames || '60', 10),
        path: legacy.dataset.path, pad: parseInt(legacy.dataset.pad || '3', 10),
        ext: legacy.dataset.ext, poster: legacy.dataset.poster
      });
    }
  }
  if (document.readyState !== 'loading') auto();
  else document.addEventListener('DOMContentLoaded', auto);
})(window);
