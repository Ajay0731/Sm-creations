(() => {
  const whatsappMessage = 'Hi SM Creations! I visited your website and would like to know more about your services.';
  const whatsapp = document.createElement('a');
  whatsapp.className = 'whatsapp-float';
  whatsapp.href = `https://wa.me/919952156428?text=${encodeURIComponent(whatsappMessage)}`;
  whatsapp.target = '_blank';
  whatsapp.rel = 'noopener noreferrer';
  whatsapp.setAttribute('aria-label', 'Chat with SM Creations on WhatsApp');
  whatsapp.title = 'Chat with SM Creations on WhatsApp';
  // WhatsApp brand mark from Font Awesome Free 6.7.2, CC BY 4.0: https://fontawesome.com/license/free
  whatsapp.innerHTML = '<svg viewBox="0 0 448 512" aria-hidden="true" focusable="false"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>';
  document.body.append(whatsapp);

  if (!document.querySelector('.back-to-top-float')) {
    const backToTop = document.createElement('a');
    backToTop.className = 'back-to-top-float';
    backToTop.href = '#top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.title = 'Back to top';
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';
    backToTop.addEventListener('click', event => {
      event.preventDefault();
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        const root = document.documentElement;
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        root.style.scrollBehavior = previousBehavior;
      } else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.append(backToTop);
  }

  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year').forEach(node => { node.textContent = String(currentYear); });

  const menuButton = document.querySelector('.page-menu-toggle');
  const menu = document.querySelector('.page-mobile-nav');
  const menuLinks = [...(menu?.querySelectorAll('a') ?? [])];
  const setMenuOpen = (open, returnFocus = false) => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (!open && returnFocus) menuButton.focus();
  };

  menuButton?.addEventListener('click', () => setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
  menuLinks.forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') setMenuOpen(false, true);
    if (event.key === 'Tab' && menuButton?.getAttribute('aria-expanded') === 'true' && menuLinks.length) {
      const first = menuLinks[0];
      const last = menuLinks[menuLinks.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  const serviceField = document.getElementById('service');
  const requestedService = new URLSearchParams(window.location.search).get('service');
  if (serviceField && requestedService && [...serviceField.options].some(option => option.value === requestedService)) {
    serviceField.value = requestedService;
  }

  const revealTargets = [...document.querySelectorAll('[data-reveal]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) revealTargets.forEach(item => item.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (document.body.classList.contains('about-page')) entry.target.classList.toggle('is-visible', entry.isIntersecting);
      else {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .12, rootMargin: '0px 0px -30px 0px' });
    revealTargets.forEach(item => observer.observe(item));
  }

  const scrollStories = [...document.querySelectorAll('[data-scroll-story]')];
  const processTracks = [...document.querySelectorAll('[data-process-track]')];
  const aboutProcess = document.querySelector('[data-about-process]');
  const growthChart = document.querySelector('.growth-hero-chart');
  const growthHero = document.querySelector('.growth-hero-visual');
  let storyFrame = 0;
  const clamp01 = value => Math.min(1, Math.max(0, value));
  const getSectionProgress = (section, viewportHeight) => {
    const top = section.getBoundingClientRect().top;
    return clamp01((viewportHeight * .84 - top) / (section.offsetHeight + viewportHeight * .42));
  };
  const updateScrollStories = () => {
    storyFrame = 0;
    const viewportHeight = window.innerHeight;
    scrollStories.forEach(section => {
      const progress = reduceMotion ? 1 : getSectionProgress(section, viewportHeight);
      section.style.setProperty('--story-progress', progress.toFixed(3));
      section.style.setProperty('--story-fill', `${progress * 100}%`);
      const modules = [...section.querySelectorAll('.scroll-module')];
      const stagePosition = progress * Math.max(0, modules.length - 1);
      modules.forEach((module, index) => {
        const focus = reduceMotion ? 1 : clamp01(1 - Math.abs(stagePosition - index));
        const offset = 1 - focus;
        const storyType = section.dataset.scrollStory;
        const stage = Number(module.dataset.stage || index);
        let shiftX = 0;
        let shiftY = offset * 18;
        let scale = .96 + focus * .04;
        let opacity = .68 + focus * .32;
        if (storyType === 'development') {
          if (stage === 0) { shiftX = -offset * 42; shiftY = offset * 14; }
          if (stage === 1) shiftY = offset * 42;
          if (stage === 2) { shiftX = offset * 42; shiftY = offset * 14; }
          opacity = .66 + focus * .34;
        } else if (storyType === 'design') {
          shiftY = offset * 22;
          module.style.setProperty('--module-clip', `${offset * 8}%`);
          module.style.setProperty('--module-mask', `${offset * 55}%`);
          if (stage === 0) {
            module.style.setProperty('--flow-offset', `${-offset * 18}px`);
            module.style.setProperty('--flow-opacity', (.45 + focus * .55).toFixed(3));
            module.style.setProperty('--ui-screen-shift', `${-offset * 18}px`);
            module.style.setProperty('--ui-screen-opacity', (.68 + focus * .32).toFixed(3));
            module.style.setProperty('--ui-mobile-shift', `${offset * 16}px`);
            module.style.setProperty('--ui-mobile-opacity', (.68 + focus * .32).toFixed(3));
          }
          if (stage === 1) {
            module.style.setProperty('--brand-poster-x', `${-offset * 20}px`);
            module.style.setProperty('--brand-poster-y', `${offset * 8}px`);
            module.style.setProperty('--brand-poster-angle', `${-offset * 4}deg`);
            module.style.setProperty('--brand-poster-opacity', (.72 + focus * .28).toFixed(3));
            module.style.setProperty('--brand-specimen-x', `${offset * 18}px`);
            module.style.setProperty('--brand-specimen-y', `${-offset * 10}px`);
            module.style.setProperty('--brand-specimen-angle', `${offset * 5}deg`);
            module.style.setProperty('--brand-specimen-opacity', (.72 + focus * .28).toFixed(3));
            module.style.setProperty('--brand-packaging-y', `${offset * 14}px`);
            module.style.setProperty('--brand-packaging-angle', `${-offset * 8}deg`);
            module.style.setProperty('--brand-packaging-opacity', (.7 + focus * .3).toFixed(3));
          }
        }
        module.style.setProperty('--module-focus', focus.toFixed(3));
        module.style.setProperty('--module-shift-x', `${shiftX.toFixed(2)}px`);
        module.style.setProperty('--module-shift-y', `${shiftY.toFixed(2)}px`);
        module.style.setProperty('--module-scale', scale.toFixed(3));
        module.style.setProperty('--module-opacity', opacity.toFixed(3));
        module.classList.toggle('is-current', reduceMotion || Math.round(stagePosition) === index);
      });
      if (section.dataset.scrollStory === 'growth') section.style.setProperty('--spine-fill', `${progress * 100}%`);
    });
    processTracks.forEach(section => {
      const progress = reduceMotion ? 1 : getSectionProgress(section, viewportHeight);
      section.style.setProperty('--process-progress', progress.toFixed(3));
      const stages = [...section.querySelectorAll('.process-track li')];
      const fillWidth = section.classList.contains('service-process--growth') ? 94 : 92;
      section.style.setProperty('--process-fill', `${progress * fillWidth}%`);
      section.style.setProperty('--process-fill-mobile', `${progress * 90}%`);
      const active = Math.min(stages.length - 1, Math.floor(progress * stages.length));
      stages.forEach((stage, index) => stage.classList.toggle('is-current', reduceMotion || index === active));
    });
    if (aboutProcess) {
      const progress = reduceMotion ? 1 : getSectionProgress(aboutProcess, viewportHeight);
      const timeline = aboutProcess.querySelector('.about-timeline');
      if (timeline) {
        timeline.style.setProperty('--about-progress', progress.toFixed(3));
        timeline.style.setProperty('--about-fill', `${progress * 100}%`);
        timeline.style.setProperty('--about-fill-mobile', `${progress * 100}%`);
        const stages = [...timeline.querySelectorAll('.about-stage')];
        const active = Math.min(stages.length - 1, Math.floor(progress * stages.length));
        stages.forEach((stage, index) => {
          stage.classList.toggle('is-current', reduceMotion || index === active);
          stage.classList.toggle('is-passed', !reduceMotion && index < active);
          stage.style.setProperty('--stage-opacity', reduceMotion || index === active ? '1' : index < active ? '.72' : '.38');
          stage.style.setProperty('--stage-shift', reduceMotion || index <= active ? '0px' : '12px');
          stage.style.setProperty('--stage-shift-x', reduceMotion || index <= active ? '0px' : '8px');
        });
      }
    }
    if (growthChart && growthHero) {
      const chartProgress = reduceMotion ? 1 : getSectionProgress(growthHero, viewportHeight);
      growthChart.style.setProperty('--chart-offset', `${720 * (1 - chartProgress)}px`);
    }
  };
  const scheduleStoryUpdate = () => {
    if (storyFrame) return;
    storyFrame = requestAnimationFrame(updateScrollStories);
  };
  if (scrollStories.length || processTracks.length || aboutProcess) {
    updateScrollStories();
    window.addEventListener('scroll', scheduleStoryUpdate, { passive: true });
    window.addEventListener('resize', scheduleStoryUpdate);
  }

  const form = document.getElementById('project-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const fields = [
    { input: form.elements.name, error: document.getElementById('name-error'), label: 'Full name' },
    { input: form.elements.email, error: document.getElementById('email-error'), label: 'Email address' },
    { input: form.elements.service, error: document.getElementById('service-error'), label: 'Service required' },
    { input: form.elements.message, error: document.getElementById('message-error'), label: 'Project message' }
  ];
  const showError = (field, message) => {
    field.error.textContent = message;
    field.input.setAttribute('aria-invalid', String(Boolean(message)));
  };
  fields.forEach(field => field.input.addEventListener('input', () => {
    showError(field, '');
    if (status) status.textContent = '';
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (status) status.textContent = '';
    fields.forEach(field => showError(field, ''));
    const errors = [];
    if (!form.elements.name.value.trim()) errors.push([fields[0], 'Please enter your name.']);
    const email = form.elements.email.value.trim();
    if (!email) errors.push([fields[1], 'Please enter your email address.']);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push([fields[1], 'Enter an email address in the format name@example.com.']);
    if (!form.elements.service.value) errors.push([fields[2], 'Choose the service you’re interested in.']);
    if (!form.elements.message.value.trim()) errors.push([fields[3], 'Tell us a little about your project.']);
    errors.forEach(([field, message]) => showError(field, message));
    if (errors.length) {
      if (status) status.textContent = 'Please review the highlighted fields.';
      errors[0][0].input.focus();
      return;
    }
    submitButton.disabled = true;
    const buttonLabel = submitButton.querySelector('span');
    if (buttonLabel) buttonLabel.textContent = 'Checking details…';
    window.setTimeout(() => {
      submitButton.disabled = false;
      if (buttonLabel) buttonLabel.textContent = 'Send project enquiry';
      if (status) {
        status.replaceChildren(document.createTextNode('Your details are valid, but message delivery is not configured on this website. Your enquiry has not been sent. Please email '));
        const emailLink = document.createElement('a');
        emailLink.href = 'mailto:sm.website.creations@gmail.com';
        emailLink.textContent = 'sm.website.creations@gmail.com';
        status.append(emailLink, document.createTextNode('.'));
      }
    }, 250);
  });
})();
