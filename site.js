/* MAISON IU — shared UI (drawer + reveal) */
(function(){
  var b=document.getElementById('burger'),d=document.getElementById('drawer'),c=document.getElementById('drawerClose');
  function close(){ if(d) d.classList.remove('open'); }
  if(b&&d) b.addEventListener('click',function(){ d.classList.toggle('open'); });
  if(c) c.addEventListener('click',close);
  if(d) d.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',close); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  }
})();
