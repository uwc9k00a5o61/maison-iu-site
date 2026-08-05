/* MAISON IU concepts v3 — shared motion + interactions. Gated by prefers-reduced-motion. */
(function(){
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal(){
    var items = document.querySelectorAll('[data-reveal], .stagger');
    if(RM || !('IntersectionObserver' in window)){ items.forEach(function(el){ el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var el = en.target, d = parseFloat(el.getAttribute('data-delay')||'0');
          if(el.classList.contains('stagger')){
            Array.prototype.forEach.call(el.children, function(ch,i){ ch.style.transitionDelay = (i*90)+'ms'; });
          } else if(d){ el.style.transitionDelay = d+'ms'; }
          el.classList.add('in'); io.unobserve(el);
        }
      });
    }, {threshold:0.14, rootMargin:'0px 0px -8% 0px'});
    items.forEach(function(el){ io.observe(el); });
  }

  function parallax(){
    if(RM) return;
    var nodes = document.querySelectorAll('.parallax');
    if(!nodes.length) return;
    var ticking=false;
    function upd(){
      var vh = window.innerHeight;
      nodes.forEach(function(el){
        var r = el.getBoundingClientRect();
        var speed = parseFloat(el.getAttribute('data-speed')||'0.08');
        var mid = r.top + r.height/2 - vh/2;
        var shift = Math.max(-60, Math.min(60, -mid*speed));
        el.style.transform = 'translate3d(0,'+shift.toFixed(1)+'px,0)';
      });
      ticking=false;
    }
    function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(upd); } }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll, {passive:true});
    upd();
  }

  function menu(){
    var b = document.querySelector('.burger'), m = document.getElementById('mmenu');
    if(!b || !m) return;
    function close(){ m.classList.remove('open'); b.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
    b.addEventListener('click', function(){
      var open = m.classList.toggle('open');
      b.setAttribute('aria-expanded', open?'true':'false');
      document.body.style.overflow = open?'hidden':'';
    });
    m.addEventListener('click', function(e){ if(e.target===m || e.target.closest('a')) close(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
  }

  function init(){ reveal(); parallax(); menu(); }
  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
