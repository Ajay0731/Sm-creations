(() => {
  // Small Lucide-style UI icons rendered inline, with no icon font or runtime dependency.
  const uiIconMarkup = {
    house: '<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
    'folder-open': '<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H10l2 2h7.5A1.5 1.5 0 0 1 21 9.5v1"/><path d="M3 9h18l-2 9H5L3 9Z"/>',
    newspaper: '<path d="M4 4h16v16H4zM2 7v11a2 2 0 0 0 2 2"/><path d="M8 8h8M8 12h8M8 16h3"/><path d="M15 15h2v2h-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    'code-2': '<path d="m8 17-5-5 5-5M16 7l5 5-5 5M14 4l-4 16"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18h1.3a1.7 1.7 0 0 0 1.3-2.8 1.7 1.7 0 0 1 1.3-2.8H18a3 3 0 0 0 3-3c0-5.2-4-9.4-9-9.4Z"/><path d="M7.5 11h.01M10 7.5h.01M14 7.5h.01M17 11h.01"/>',
    'chart-no-axes-combined': '<path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-7"/><path d="M17 7h4v4"/>',
    'map-pin': '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    'arrow-up': '<path d="M12 19V5M5 12l7-7 7 7"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>'
  };
  const makeUiIcon = name => {
    if (!uiIconMarkup[name]) return null;
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('class', 'ui-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('focusable', 'false');
    icon.setAttribute('data-ui-icon', name);
    icon.innerHTML = uiIconMarkup[name];
    return icon;
  };
  const addLeadingIcon = (link, name) => {
    if (link.querySelector(`:scope > svg[data-ui-icon="${name}"]`)) return;
    const icon = makeUiIcon(name);
    if (!icon) return;
    const number = link.querySelector(':scope > small');
    if (number) number.after(icon);
    else link.prepend(icon);
  };
  const addTrailingIcon = (link, name) => {
    if (link.querySelector(`:scope > svg[data-ui-icon="${name}"]`)) return;
    const icon = makeUiIcon(name);
    if (icon) link.append(icon);
  };
  const routeIcons = new Map([
    ['index.html', 'house'], ['about.html', 'users'], ['services.html', 'layers'],
    ['portfolio.html', 'folder-open'], ['blog.html', 'newspaper'], ['contact.html', 'mail'],
    ['development.html', 'code-2'], ['creative.html', 'palette'], ['growth.html', 'chart-no-axes-combined']
  ]);
  const routeFor = link => (link.getAttribute('href') || '').split(/[?#]/, 1)[0].split('/').pop().toLowerCase();
  document.querySelectorAll('.primary-nav a, .page-mobile-nav a, .reference-menu nav a, .site-footer__group > a, .footer .site-footer__group > a, .service-tile a, .about-service, .service-detail__switch a').forEach(link => {
    const icon = routeIcons.get(routeFor(link));
    if (icon) addLeadingIcon(link, icon);
  });
  document.querySelectorAll('a[href^="mailto:"]:not(.site-footer__email)').forEach(link => addLeadingIcon(link, 'mail'));
  document.querySelectorAll('.location-section__actions a').forEach(link => addLeadingIcon(link, 'map-pin'));
  document.querySelectorAll('[target="_blank"]:not(.social-link):not(.whatsapp-float)').forEach(link => {
    const oldArrow = link.querySelector(':scope > span[aria-hidden="true"]');
    if (oldArrow) oldArrow.replaceChildren(makeUiIcon('arrow-up-right'));
    else addTrailingIcon(link, 'arrow-up-right');
  });
  document.querySelectorAll('.site-footer__bottom a[href="#top"], .footer-bottom a[href="#top"]').forEach(link => {
    if (!link.textContent.trim().endsWith('↑')) {
      link.textContent = link.textContent.replace(/[↑\u2191]\s*$/, '').trim();
      addTrailingIcon(link, 'arrow-up');
    }
  });

  // Official brand marks from Font Awesome Free 6.7.2 (CC BY 4.0).
  // Add verified profile URLs here when SM Creations provides them.
  const socialProfiles = [
    {
      id: 'instagram',
      label: 'Instagram',
      ariaLabel: 'Follow SM Creations on Instagram',
      url: 'https://www.instagram.com/smcreations.in/',
      viewBox: '0 0 448 512',
      path: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      ariaLabel: 'Follow SM Creations on LinkedIn',
      url: null,
      viewBox: '0 0 448 512',
      path: 'M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3C448 46.5 433.6 32 416 32zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      ariaLabel: 'Follow SM Creations on Facebook',
      url: null,
      viewBox: '0 0 512 512',
      path: 'M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256c0 120 82.7 220.8 194.2 248.5V334.2h-52.8V256h52.8v-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256z'
    }
  ];

  const activeProfiles = socialProfiles.filter(profile => typeof profile.url === 'string' && profile.url.trim());
  if (!activeProfiles.length) return;

  const makeSocialLinks = modifier => {
    const group = document.createElement('div');
    group.className = `social-links ${modifier}`;
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Social media links');

    activeProfiles.forEach(profile => {
      const link = document.createElement('a');
      link.className = 'social-link';
      link.href = profile.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', profile.ariaLabel);
      link.title = profile.label;

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', profile.viewBox);
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'currentColor');
      path.setAttribute('d', profile.path);
      icon.append(path);
      link.append(icon);
      group.append(link);

      if (profile.id === 'instagram') {
        link.addEventListener('click', () => {
          const closeButton = link.closest('.reference-menu')?.querySelector('.reference-menu-close');
          closeButton?.click();
        });
      }
    });
    return group;
  };

  document.querySelectorAll('.site-footer__brand-block, .footer-brand-block').forEach(brand => {
    brand.append(makeSocialLinks('social-links--footer'));
  });

  const contactFollow = document.querySelector('[data-contact-social]');
  if (contactFollow) {
    const heading = document.createElement('h2');
    heading.className = 'contact-follow__title';
    heading.textContent = 'Follow Us';
    contactFollow.append(heading, makeSocialLinks('social-links--contact'));
  }

  document.querySelectorAll('.page-mobile-nav').forEach(menu => menu.append(makeSocialLinks('social-links--menu')));
  const homeMenu = document.querySelector('.reference-menu');
  if (homeMenu) homeMenu.append(makeSocialLinks('social-links--menu'));
})();
