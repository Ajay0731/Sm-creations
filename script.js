const body=document.body;
const progressBar=document.getElementById('progressBar');
const currentYear=document.getElementById('currentYear');
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroSection=document.querySelector('.island-hero');
const siteHeader=document.querySelector('.site-header');

if(currentYear){currentYear.textContent=new Date().getFullYear().toString();}

function initializeReferenceHeroParticles(){
  const hero=document.querySelector('.reference-hero');
  const canvas=hero?.querySelector('.reference-particle-canvas');
  const context=canvas?.getContext('2d');
  if(!hero||!canvas||!context)return;

  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer=window.matchMedia('(pointer: coarse)');
  const listeners=new AbortController();
  const {signal}=listeners;
  const colors=['240,0,60','126,0,31','255,255,255'];
  let particles=[];
  let frameId=0;
  let previousFrame=0;
  let width=0;
  let height=0;
  let pixelRatio=1;
  let pointerX=-1e4;
  let pointerY=-1e4;
  let pointerActive=false;
  let lastPointerMove=0;
  let isVisible=true;

  function stopAnimation(){
    if(frameId){cancelAnimationFrame(frameId);frameId=0;}
    previousFrame=0;
  }

  function startAnimation(){
    if(!reducedMotion.matches&&isVisible&&!frameId){frameId=requestAnimationFrame(animate);}
  }

  function resize(){
    const bounds=hero.getBoundingClientRect();
    width=Math.max(1,bounds.width);
    height=Math.max(1,bounds.height);
    pixelRatio=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*pixelRatio);
    canvas.height=Math.round(height*pixelRatio);
    context.setTransform(pixelRatio,0,0,pixelRatio,0,0);

    const isCompact=coarsePointer.matches||width<=640;
    const density=isCompact?1/2500:1/1050;
    const maximum=isCompact?360:1350;
    const count=Math.max(isCompact?110:260,Math.min(maximum,Math.round(width*height*density)));
    particles=Array.from({length:count},()=>({
      homeX:Math.random()*width,
      homeY:Math.random()*height,
      x:0,
      y:0,
      vx:0,
      vy:0,
      radius:.9+Math.random()*.7,
      alpha:.34+Math.random()*.42,
      color:colors[Math.floor(Math.random()*colors.length)]
    }));
    particles.forEach(particle=>{particle.x=particle.homeX;particle.y=particle.homeY;});
    render(0,16.67);
    startAnimation();
  }

  function render(now,delta){
    context.clearRect(0,0,width,height);
    const compact=coarsePointer.matches||width<=640;
    const connectionDistance=compact?58:82;
    const connectionDistanceSquared=connectionDistance*connectionDistance;
    const interactionRadius=compact?112:178;
    const interactionRadiusSquared=interactionRadius*interactionRadius;
    const elapsed=Math.min(delta/16.67,2.5);
    const rippleStrength=pointerActive&&!reducedMotion.matches?Math.exp(-Math.max(0,now-lastPointerMove)/1250):0;

    for(const particle of particles){
      let targetX=particle.homeX;
      let targetY=particle.homeY;
      if(rippleStrength){
        const dx=particle.homeX-pointerX;
        const dy=particle.homeY-pointerY;
        const distanceSquared=dx*dx+dy*dy;
        if(distanceSquared<interactionRadiusSquared){
          const distance=Math.sqrt(distanceSquared)||1;
          const influence=1-distance/interactionRadius;
          const displacement=influence*influence*rippleStrength*(compact?15:27);
          targetX+=dx/distance*displacement;
          targetY+=dy/distance*displacement;
        }
      }
      particle.vx=(particle.vx+(targetX-particle.x)*.045*elapsed)*Math.pow(.79,elapsed);
      particle.vy=(particle.vy+(targetY-particle.y)*.045*elapsed)*Math.pow(.79,elapsed);
      particle.x+=particle.vx*elapsed;
      particle.y+=particle.vy*elapsed;
    }

    const cellSize=connectionDistance;
    const cells=new Map();
    for(let index=0;index<particles.length;index++){
      const particle=particles[index];
      const cellX=Math.floor(particle.x/cellSize);
      const cellY=Math.floor(particle.y/cellSize);
      const cellKey=`${cellX},${cellY}`;
      let cell=cells.get(cellKey);
      if(!cell){cell=[];cells.set(cellKey,cell);}
      cell.push(index);
    }

    context.lineWidth=.65;
    for(let index=0;index<particles.length;index++){
      const particle=particles[index];
      const cellX=Math.floor(particle.x/cellSize);
      const cellY=Math.floor(particle.y/cellSize);
      for(let offsetY=-1;offsetY<=1;offsetY++){
        for(let offsetX=-1;offsetX<=1;offsetX++){
          const neighbors=cells.get(`${cellX+offsetX},${cellY+offsetY}`);
          if(!neighbors)continue;
          for(const neighborIndex of neighbors){
            if(neighborIndex<=index)continue;
            const neighbor=particles[neighborIndex];
            const dx=particle.x-neighbor.x;
            const dy=particle.y-neighbor.y;
            const distanceSquared=dx*dx+dy*dy;
            if(distanceSquared>=connectionDistanceSquared)continue;
            const strength=1-Math.sqrt(distanceSquared)/connectionDistance;
            context.strokeStyle=`rgba(220,18,62,${strength*.19})`;
            context.beginPath();
            context.moveTo(particle.x,particle.y);
            context.lineTo(neighbor.x,neighbor.y);
            context.stroke();
          }
        }
      }
    }

    for(const particle of particles){
      context.fillStyle=`rgba(${particle.color},${particle.alpha})`;
      context.beginPath();
      context.arc(particle.x,particle.y,particle.radius,0,Math.PI*2);
      context.fill();
    }
  }

  function animate(timestamp){
    frameId=0;
    if(reducedMotion.matches||!isVisible)return;
    const delta=previousFrame?timestamp-previousFrame:16.67;
    previousFrame=timestamp;
    render(timestamp,delta);
    frameId=requestAnimationFrame(animate);
  }

  function updatePointer(event){
    const bounds=hero.getBoundingClientRect();
    pointerX=event.clientX-bounds.left;
    pointerY=event.clientY-bounds.top;
    pointerActive=true;
    lastPointerMove=performance.now();
    startAnimation();
  }

  hero.addEventListener('pointermove',updatePointer,{passive:true,signal});
  hero.addEventListener('pointerleave',()=>{pointerActive=false;startAnimation();},{passive:true,signal});
  window.addEventListener('resize',resize,{passive:true,signal});
  reducedMotion.addEventListener('change',()=>{
    if(reducedMotion.matches){stopAnimation();render(0,16.67);}
    else startAnimation();
  },{signal});

  const resizeObserver=new ResizeObserver(resize);
  resizeObserver.observe(hero);
  const visibilityObserver=new IntersectionObserver(entries=>{
    isVisible=entries.some(entry=>entry.isIntersecting);
    if(isVisible)startAnimation();
    else stopAnimation();
  });
  visibilityObserver.observe(hero);

  function cleanup(){
    stopAnimation();
    listeners.abort();
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    window.addEventListener('pageshow',event=>{
      if(event.persisted)initializeReferenceHeroParticles();
    },{once:true});
  }
  window.addEventListener('pagehide',cleanup,{once:true});
  resize();
}

initializeReferenceHeroParticles();

if(heroSection&&!prefersReducedMotion){
  let heroFrame=null;
  let bubbleTimeout=null;
  let artBubbleTimeout=null;
  const cursorBubble=heroSection.querySelector('.hero-cursor-bubble');
  const heroVisual=heroSection.querySelector('.hero-visual-wrap');
  const artCursorBubble=heroSection.querySelector('.hero-art-cursor-bubble');

  heroSection.addEventListener('pointermove',event=>{
    if(heroFrame){return;}
    heroFrame=requestAnimationFrame(()=>{
      const bounds=heroSection.getBoundingClientRect();
      const pointerX=(event.clientX-bounds.left)/bounds.width-.5;
      const pointerY=(event.clientY-bounds.top)/bounds.height-.5;
      heroSection.style.setProperty('--visual-parallax-x',`${pointerX*30}px`);
      heroSection.style.setProperty('--visual-parallax-y',`${pointerY*30}px`);
      heroSection.style.setProperty('--art-parallax-x',`${pointerX*14}px`);
      heroSection.style.setProperty('--art-parallax-y',`${pointerY*14}px`);
      heroSection.style.setProperty('--headline-parallax-x',`${pointerX*6}px`);
      heroSection.style.setProperty('--headline-parallax-y',`${pointerY*6}px`);
      heroSection.style.setProperty('--glow-parallax-x',`${pointerX*20}px`);
      heroSection.style.setProperty('--glow-parallax-y',`${pointerY*20}px`);
      if(cursorBubble){
        cursorBubble.style.left=`${event.clientX-bounds.left}px`;
        cursorBubble.style.top=`${event.clientY-bounds.top}px`;
        cursorBubble.classList.add('visible');
        clearTimeout(bubbleTimeout);
        bubbleTimeout=setTimeout(()=>cursorBubble.classList.remove('visible'),280);
      }
      if(heroVisual&&artCursorBubble){
        const artBounds=heroVisual.getBoundingClientRect();
        const isOverArtwork=event.clientX>=artBounds.left&&event.clientX<=artBounds.right&&event.clientY>=artBounds.top&&event.clientY<=artBounds.bottom;
        if(isOverArtwork){
          artCursorBubble.style.left=`${event.clientX-artBounds.left}px`;
          artCursorBubble.style.top=`${event.clientY-artBounds.top}px`;
          artCursorBubble.classList.add('visible');
          clearTimeout(artBubbleTimeout);
          artBubbleTimeout=setTimeout(()=>artCursorBubble.classList.remove('visible'),280);
        }else{
          artCursorBubble.classList.remove('visible');
          clearTimeout(artBubbleTimeout);
        }
      }
      heroFrame=null;
    });
  });
  heroSection.addEventListener('pointerleave',()=>{
    ['--visual-parallax-x','--visual-parallax-y','--art-parallax-x','--art-parallax-y','--headline-parallax-x','--headline-parallax-y','--glow-parallax-x','--glow-parallax-y'].forEach(property=>heroSection.style.setProperty(property,'0px'));
    if(cursorBubble){cursorBubble.classList.remove('visible');}
    if(artCursorBubble){artCursorBubble.classList.remove('visible');}
    clearTimeout(bubbleTimeout);
    clearTimeout(artBubbleTimeout);
  });
}

function updateHeroScrollMotion(){
  if(!heroSection||prefersReducedMotion){return;}
  const bounds=heroSection.getBoundingClientRect();
  const progress=Math.min(1,Math.max(0,-bounds.top/Math.max(bounds.height,1)));
  heroSection.style.setProperty('--orb-one-scroll-y',`${progress*115}px`);
  heroSection.style.setProperty('--orb-two-scroll-y',`${-progress*95}px`);
  heroSection.style.setProperty('--orb-one-scroll-rotation',`${progress*180}deg`);
  heroSection.style.setProperty('--orb-two-scroll-rotation',`${-progress*220}deg`);
}

function updateHeaderVisibility(){
  if(!siteHeader||!heroSection)return;
  const heroBottom=heroSection.getBoundingClientRect().bottom;
  const currentlyVisible=siteHeader.classList.contains('is-scrolled');
  const shouldShow=currentlyVisible?heroBottom<=18:heroBottom<=-8;
  if(shouldShow===currentlyVisible)return;
  siteHeader.classList.toggle('is-scrolled',shouldShow);
  siteHeader.inert=!shouldShow;
  siteHeader.setAttribute('aria-hidden',String(!shouldShow));
}

function animateMetricValue(metric){
  const value=metric.matches('.stats-card__number')?metric:metric.querySelector('strong');
  if(!value)return;
  const explicitTarget=value.dataset.target;
  if(prefersReducedMotion){
    if(explicitTarget!==undefined)value.textContent=`${explicitTarget}+`;
    return;
  }
  const match=value.textContent.trim().match(/^([\d,]+)(.*)$/);
  if(!match)return;
  const target=Number(explicitTarget??match[1].replaceAll(',',''));
  const suffix=match[2];
  const duration=1800;
  const startedAt=performance.now();
  function frame(now){
    const progress=Math.min(1,(now-startedAt)/duration);
    const eased=1-Math.pow(1-progress,3);
    value.textContent=`${Math.round(target*eased).toLocaleString()}${suffix}`;
    if(progress<1)requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      if(entry.target.matches('.metrics .metric'))animateMetricValue(entry.target);
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.section h2,.solution-card,.work-card,.metric,.client-grid span').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(28px)';el.style.transition='opacity .7s ease, transform .7s ease';revealObserver.observe(el);
});
function initializeStatsCounters(){
  const section=document.querySelector('.stats-section');
  if(!section||section.dataset.countersInitialized==='true')return;
  const elements=[...section.querySelectorAll('.stats-card__number[data-target]')];
  if(!elements.length)return;
  section.dataset.countersInitialized='true';

  const duration=1800;
  let completedInitialCounters=0;
  let initialCountUpComplete=prefersReducedMotion;

  const counters=elements.map(element=>({
    element,
    target:Number(element.dataset.target),
    current:0,
    frameId:null,
    animationId:0
  }));

  function cancelCounter(counter){
    if(counter.frameId!==null)cancelAnimationFrame(counter.frameId);
    counter.frameId=null;
    counter.animationId+=1;
  }

  function animateCounter(counter,from,durationMs,onComplete){
    cancelCounter(counter);
    const animationId=counter.animationId;
    const startedAt=performance.now();
    counter.current=from;
    counter.element.textContent=`${Math.round(from)}+`;

    function frame(now){
      if(animationId!==counter.animationId)return;
      const progress=Math.min(1,(now-startedAt)/durationMs);
      const eased=1-Math.pow(1-progress,3);
      counter.current=from+(counter.target-from)*eased;
      counter.element.textContent=`${Math.round(counter.current)}+`;
      if(progress<1){
        counter.frameId=requestAnimationFrame(frame);
      }else{
        counter.current=counter.target;
        counter.element.textContent=`${counter.target}+`;
        counter.frameId=null;
        if(onComplete)onComplete();
      }
    }

    counter.frameId=requestAnimationFrame(frame);
  }

  counters.forEach(counter=>{
    if(prefersReducedMotion){
      counter.current=counter.target;
      counter.element.textContent=`${counter.target}+`;
      return;
    }

    animateCounter(counter,0,duration,()=>{
      completedInitialCounters+=1;
      if(completedInitialCounters===counters.length)initialCountUpComplete=true;
    });

    counter.element.addEventListener('mouseenter',()=>{
      if(initialCountUpComplete)animateCounter(counter,0,duration);
    });
    counter.element.addEventListener('mouseleave',()=>{
      if(!initialCountUpComplete)return;
      cancelCounter(counter);
      counter.current=counter.target;
      counter.element.textContent=`${counter.target}+`;
    });
    counter.element.addEventListener('focus',()=>{
      if(initialCountUpComplete)animateCounter(counter,0,duration);
    });
    counter.element.addEventListener('blur',()=>{
      if(!initialCountUpComplete)return;
      cancelCounter(counter);
      counter.current=counter.target;
      counter.element.textContent=`${counter.target}+`;
    });
  });
}

initializeStatsCounters();

const serviceSection=document.querySelector('#services');
const serviceCards=serviceSection?[...serviceSection.querySelectorAll('.service-list__card')]:[];
let pageScrollFrame=null;

function updateServiceScrollMotion(){
  if(!serviceSection||serviceCards.length!==3)return;
  const sectionTop=serviceSection.getBoundingClientRect().top;
  const sectionHeight=serviceSection.offsetHeight;
  const start=window.innerHeight*.88;
  const finish=-sectionHeight*.3;
  const progress=Math.min(1,Math.max(0,(start-sectionTop)/(start-finish)));
  const offset=Math.min(150,Math.max(38,window.innerWidth*.105));
  const fade=.08+progress*.92;
  serviceCards[0].style.setProperty('--service-x',`${-offset*(1-progress)}px`);
  serviceCards[0].style.setProperty('--service-y','0px');
  serviceCards[0].style.setProperty('--service-opacity',fade.toFixed(3));
  serviceCards[1].style.setProperty('--service-x','0px');
  serviceCards[1].style.setProperty('--service-y',`${(1-progress)*24}px`);
  serviceCards[1].style.setProperty('--service-opacity',progress.toFixed(3));
  serviceCards[2].style.setProperty('--service-x',`${offset*(1-progress)}px`);
  serviceCards[2].style.setProperty('--service-y','0px');
  serviceCards[2].style.setProperty('--service-opacity',fade.toFixed(3));
}

function updatePageScrollState(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  if(progressBar)progressBar.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
  updateHeaderVisibility();
  updateHeroScrollMotion();
  updateServiceScrollMotion();
}

function schedulePageScrollUpdate(){
  if(pageScrollFrame)return;
  pageScrollFrame=requestAnimationFrame(()=>{
    updatePageScrollState();
    pageScrollFrame=null;
  });
}

window.addEventListener('scroll',schedulePageScrollUpdate,{passive:true});
window.addEventListener('resize',schedulePageScrollUpdate);
updatePageScrollState();

const brandMarquee=document.querySelector('.brand-marquee');
const brandTrack=document.querySelector('.brand-marquee__track');
const brandLogos=[...document.querySelectorAll('.brand-logo')];
const brandStyles=document.createElement('style');
brandStyles.textContent='.brand-marquee{position:relative;overflow:hidden;margin:52px 0 30px;padding:16px 0;touch-action:pan-y;user-select:none}.brand-marquee__track{display:flex;align-items:center;gap:24px;width:max-content;will-change:transform;transition:transform .55s ease}.brand-logo{flex:0 0 clamp(160px,17vw,240px);height:120px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.02);color:rgba(255,255,255,.42);filter:grayscale(1) blur(1.5px);opacity:.7;transform:scale(.9);transition:filter .5s ease,opacity .5s ease,transform .5s ease,color .5s ease;overflow:hidden}.brand-logo span{font-size:clamp(16px,2vw,24px);letter-spacing:2.5px;white-space:nowrap}.brand-logo.is-center{color:#fff;filter:grayscale(0) blur(0);opacity:1;transform:scale(1)}body.light .brand-logo{border-color:rgba(0,0,0,.1);background:rgba(0,0,0,.02);color:rgba(16,16,16,.5)!important}body.light .brand-logo.is-center{color:#111!important}.brand-marquee:before,.brand-marquee:after{content:"";position:absolute;top:0;bottom:0;width:12%;z-index:2;pointer-events:none}.brand-marquee:before{left:0;background:linear-gradient(90deg,#050505,transparent)}.brand-marquee:after{right:0;background:linear-gradient(-90deg,#050505,transparent)}body.light .brand-marquee:before,body.light .brand-marquee:after{background:linear-gradient(90deg,#f2f2ef,transparent);background:linear-gradient(-90deg,#f2f2ef,transparent)}';
document.head.appendChild(brandStyles);

if(brandMarquee&&brandTrack&&brandLogos.length){
  const trackStyle=brandTrack.style;
  const trackWidth=brandTrack.scrollWidth;
  const loopWidth=trackWidth/2;
  brandLogos.forEach(logo=>brandTrack.appendChild(logo.cloneNode(true)));
  const loopedLogos=[...document.querySelectorAll('.brand-logo')];
  let offset=0;
  let velocity=0;
  let pointerId=null;
  let lastPointerX=0;
  let lastTimestamp=0;
  let autoDirection=-1;
  let autoPosition=0;
  let isPointerDragging=false;

  function getBrandCenter(){
    const trackBounds=brandTrack.getBoundingClientRect();
    const marqueeBounds=brandMarquee.getBoundingClientRect();
    const centerX=marqueeBounds.left+marqueeBounds.width/2;
    const centerIndex=brandLogos.reduce((closest,logo,index)=>{
      const logoCenter=logo.getBoundingClientRect().left+logo.offsetWidth/2;
      const distance=Math.abs(centerX-logoCenter);
      return distance<closest.distance?{index,distance}:closest;
    },{index:0,distance:Number.POSITIVE_INFINITY}).index;
    const activeLogo=brandLogos[centerIndex];
    const activeOffset=activeLogo.offsetLeft+activeLogo.offsetWidth/2-trackBounds.width/2;
    return {centerIndex,activeOffset};
  }

  function updateBrandFocus(){
    const centerX=brandMarquee.getBoundingClientRect().left+brandMarquee.getBoundingClientRect().width/2;
    brandLogos.forEach(logo=>{
      const logoCenter=logo.getBoundingClientRect().left+logo.offsetWidth/2;
      const distance=Math.abs(centerX-logoCenter);
      logo.classList.toggle('is-center',distance<logo.offsetWidth*0.45);
    });
  }

  function setTrackPosition(value){
    offset=value;
    if(offset<=-loopWidth){offset+=loopWidth;}
    if(offset>=0){offset-=loopWidth;}
    trackStyle.transform=`translate3d(${offset}px,0,0)`;
    updateBrandFocus();
  }

  function animateBrandMarquee(timestamp){
    if(!isPointerDragging){
      setTrackPosition(offset+autoDirection*0.45);
    }else if(Math.abs(velocity)>0.05){
      setTrackPosition(offset+velocity);
      velocity*=0.9;
    }
    if(timestamp-lastTimestamp>16){lastTimestamp=timestamp;}
    requestAnimationFrame(animateBrandMarquee);
  }

  brandMarquee.addEventListener('pointerdown',event=>{
    isPointerDragging=true;
    pointerId=event.pointerId;
    lastPointerX=event.clientX;
    velocity=0;
    brandMarquee.setPointerCapture(pointerId);
  });

  brandMarquee.addEventListener('pointermove',event=>{
    if(!isPointerDragging||event.pointerId!==pointerId){return;}
    const delta=event.clientX-lastPointerX;
    lastPointerX=event.clientX;
    velocity=delta;
    setTrackPosition(offset+delta);
  });

  const finishPointerDrag=()=>{
    isPointerDragging=false;
    pointerId=null;
    velocity*=0.6;
  };

  brandMarquee.addEventListener('pointerup',finishPointerDrag);
  brandMarquee.addEventListener('pointerleave',finishPointerDrag);
  brandMarquee.addEventListener('pointercancel',finishPointerDrag);
  brandMarquee.addEventListener('wheel',event=>{
    event.preventDefault();
    setTrackPosition(offset+event.deltaY*0.8);
  },{passive:false});

  setTrackPosition(0);
  requestAnimationFrame(animateBrandMarquee);
}

const style=document.createElement('style');
style.textContent='.section h2.revealed,.solution-card.revealed,.work-card.revealed,.metric.revealed,.client-grid span.revealed{opacity:1!important;transform:translateY(0)!important}';
document.head.appendChild(style);



const referenceMenuButton=document.querySelector('.reference-menu-button');
const referenceMenu=document.querySelector('.reference-menu');
const referenceMenuClose=document.querySelector('.reference-menu-close');
function setReferenceMenuOpen(isOpen){
  if(!referenceMenuButton||!referenceMenu){return;}
  referenceMenuButton.setAttribute('aria-expanded',String(isOpen));
  referenceMenuButton.setAttribute('aria-label',isOpen?'Close navigation menu':'Open navigation menu');
  referenceMenu.setAttribute('aria-hidden',String(!isOpen));
  referenceMenu.classList.toggle('is-open',isOpen);
  if(isOpen){referenceMenuClose?.focus();}
  else{referenceMenuButton.focus();}
}
referenceMenuButton?.addEventListener('click',()=>setReferenceMenuOpen(referenceMenuButton.getAttribute('aria-expanded')!=='true'));
referenceMenuClose?.addEventListener('click',()=>setReferenceMenuOpen(false));
referenceMenu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setReferenceMenuOpen(false)));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&referenceMenu?.classList.contains('is-open')){setReferenceMenuOpen(false);}
});
