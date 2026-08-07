/**
 * Home intro — script logo pen-writes "Maison IU", then dark curtains part.
 * Ported from home3. Rendered in SSR so it covers the page from first paint
 * (no content flash); an inline script gates it synchronously BEFORE paint:
 *   · once per session   → sessionStorage "miu_intro"
 *   · ?intro=1           → force replay
 *   · reduced-motion     → skip (also removed by CSS pre-paint)
 * Driving the SVG stroke animation from vanilla JS (not React) keeps timing
 * exact and independent of hydration.
 */
const INTRO_JS = `(function(){
  var intro=document.getElementById('miu-intro'); if(!intro) return;
  var force=new URLSearchParams(location.search).get('intro')==='1';
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var seen=false; try{seen=sessionStorage.getItem('miu_intro')==='1';}catch(e){}
  if(reduce || (seen && !force)){ intro.classList.add('gone'); return; }
  try{sessionStorage.setItem('miu_intro','1');}catch(e){}
  document.body.classList.add('introing');
  var sig=intro.querySelector('.sig'), fill=intro.querySelector('.sig-fill'),
      flr=document.getElementById('miu-introFlr'), dsc=intro.querySelector('.dsc'),
      played=false, L=2600, fl=1;
  function play(){ if(played)return; played=true;
    try{var l=sig.getComputedTextLength()*3.4; if(l>200)L=l;}catch(e){}
    sig.style.strokeDasharray=L; sig.style.strokeDashoffset=L;
    try{fl=flr.getTotalLength();}catch(e){} flr.style.strokeDasharray=fl; flr.style.strokeDashoffset=fl;
    requestAnimationFrame(function(){
      sig.style.transition='stroke-dashoffset 1.5s cubic-bezier(.66,0,.34,1)'; sig.style.strokeDashoffset=0;
      setTimeout(function(){ fill.style.opacity=1; },1250);
      setTimeout(function(){ flr.style.transition='stroke-dashoffset .7s ease'; flr.style.strokeDashoffset=0; dsc.style.opacity=1; },1400);
      setTimeout(function(){ intro.classList.add('done'); document.body.classList.remove('introing'); },2550);
      setTimeout(function(){ intro.classList.add('gone'); },3600);
    });
  }
  if(document.fonts&&document.fonts.ready){ document.fonts.ready.then(play); }
  setTimeout(play,1000);
})();`;

export function IntroOverlay() {
  return (
    <>
      <div className="intro" id="miu-intro" aria-hidden="true">
        <div className="curtain top" />
        <div className="curtain bot" />
        <div className="lg">
          <svg className="sglogo" viewBox="0 0 1000 250" aria-label="Maison IU">
            <text
              className="sig"
              x="500"
              y="176"
              textAnchor="middle"
              fontSize="150"
            >
              Maison IU
            </text>
            <text
              className="sig-fill"
              x="500"
              y="176"
              textAnchor="middle"
              fontSize="150"
            >
              Maison IU
            </text>
          </svg>
          <svg
            className="flr"
            viewBox="0 0 360 22"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path id="miu-introFlr" d="M6 15 C 92 3, 182 3, 224 10 S 332 20, 354 6" />
          </svg>
          <div className="dsc">Fine Watches · Jewellery · Bags</div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: INTRO_JS }} />
    </>
  );
}
