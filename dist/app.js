const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const scrollToDemo = () => $("#demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
$$('[data-scroll-demo]').forEach((button) => button.addEventListener('click', scrollToDemo));

const contrastToggle = $('#contrast-toggle');
contrastToggle?.addEventListener('click', () => {
  const enabled = document.body.classList.toggle('high-contrast');
  contrastToggle.setAttribute('aria-pressed', String(enabled));
});

const wifiStep = $('#wifi-step');
const connectionStep = $('#connection-step');
const portalStep = $('#portal-step');
const connectButton = $('#connect-network');
const gatewayBrand = $('#gateway-brand');
const networkRows = $$('.network-row');

networkRows.forEach((row) => {
  row.addEventListener('click', () => {
    networkRows.forEach((item) => {
      const selected = item === row;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    const campusSelected = row.dataset.network === 'campus';
    connectButton.disabled = !campusSelected;
    connectButton.innerHTML = campusSelected
      ? 'Connect to CampusLink Students <span aria-hidden="true">→</span>'
      : 'SafeNet demo uses CampusLink Students';
  });
});

function resetGatewayDemo() {
  wifiStep.hidden = false;
  connectionStep.hidden = true;
  portalStep.hidden = true;
  connectButton.disabled = false;
  connectButton.innerHTML = 'Connect to CampusLink Students <span aria-hidden="true">→</span>';
  gatewayBrand.innerHTML = '<span class="settings-icon" aria-hidden="true">‹</span>Wi-Fi';
  networkRows.forEach((item) => {
    const selected = item.dataset.network === 'campus';
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
}

connectButton?.addEventListener('click', () => {
  if (connectButton.disabled) return;
  wifiStep.hidden = true;
  connectionStep.hidden = false;
  gatewayBrand.textContent = 'Connecting…';

  window.setTimeout(() => {
    connectionStep.hidden = true;
    portalStep.hidden = false;
    gatewayBrand.innerHTML = '<img src="icon.svg" alt="">SafeNet gateway';
  }, 950);
});

$('#restart-gateway')?.addEventListener('click', resetGatewayDemo);

const tabs = $$('[data-demo-tab]');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      const panel = $(`#panel-${item.dataset.demoTab}`);
      if (panel) panel.hidden = !selected;
    });
  });

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabs[(tabs.indexOf(tab) + direction + tabs.length) % tabs.length];
    next.focus();
    next.click();
  });
});

const guideDialog = $('#guide-dialog');
const supportDialog = $('#support-dialog');
const pilotDialog = $('#pilot-dialog');

const openDialog = (dialog) => {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') dialog.showModal();
};

$$('[data-guide-target]').forEach((button) => button.addEventListener('click', () => openDialog(guideDialog)));
$('#pilot-interest')?.addEventListener('click', () => openDialog(pilotDialog));

const closeDialogs = (event) => {
  const dialog = event.currentTarget.closest('dialog');
  dialog?.close();
};
$$('[data-close-dialog]').forEach((button) => button.addEventListener('click', closeDialogs));

$$('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

let supportStep = 1;
const routeCopy = {
  peer: 'A supervised peer navigation route has been selected.',
  specialist: 'A direct qualified-provider route has been selected.',
  information: 'Information-only mode has been selected. No support route would be opened.'
};

function updateSupportStep(step) {
  supportStep = Math.min(3, Math.max(1, step));
  $$('.support-step').forEach((section) => {
    const active = Number(section.dataset.supportStep) === supportStep;
    section.hidden = !active;
    section.classList.toggle('active', active);
  });
  $$('.support-progress span').forEach((bar, index) => bar.classList.toggle('active', index < supportStep));

  if (supportStep === 3) {
    const route = $('input[name="route"]:checked')?.value || 'peer';
    $('#route-summary').textContent = routeCopy[route];
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    $('#demo-reference').textContent = `SAFE-DEMO-${String(random[0] % 10000).padStart(4, '0')}`;
  }
}

$$('[data-open-support]').forEach((button) => {
  button.addEventListener('click', () => {
    guideDialog?.close();
    const preferredRoute = button.dataset.route;
    if (preferredRoute) {
      const input = $(`input[name="route"][value="${preferredRoute}"]`);
      if (input) input.checked = true;
    }
    updateSupportStep(1);
    openDialog(supportDialog);
  });
});

$$('[data-support-next]').forEach((button) => button.addEventListener('click', () => updateSupportStep(supportStep + 1)));
$$('[data-support-back]').forEach((button) => button.addEventListener('click', () => updateSupportStep(supportStep - 1)));
$$('[data-reset-support]').forEach((button) => button.addEventListener('click', () => updateSupportStep(1)));

$('#quick-exit')?.addEventListener('click', () => window.location.replace('study.html'));

function updateNetworkStatus() {
  const online = navigator.onLine;
  $('#network-indicator')?.classList.toggle('offline', !online);
  $('#network-status').textContent = online ? 'Local guidance ready' : 'Offline mode — cached guidance available';
}
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((element) => revealObserver.observe(element));

const staggerGroups = [
  ['.journey-list li', 'from-right'],
  ['.offering-card', ''],
  ['.safety-grid article', ''],
  ['.pilot-step', ''],
  ['.context-band > *', 'from-left']
];

const motionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    motionObserver.unobserve(entry.target);
  });
}, { threshold: 0.16, rootMargin: '0px 0px -5% 0px' });

staggerGroups.forEach(([selector, direction]) => {
  $$(selector).forEach((element, index) => {
    element.classList.add('scroll-reveal');
    if (direction) element.classList.add(direction);
    element.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 90}ms`);
    motionObserver.observe(element);
  });
});

const number = $('.context-number');
if (number) {
  const numberObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      number.classList.add('number-enter');
      numberObserver.disconnect();
    }
  }, { threshold: .5 });
  numberObserver.observe(number);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroPhone = $('.phone-shell');
const header = $('.site-header');
let animationFrame;

if (!prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    if (animationFrame) return;
    animationFrame = requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * .035, 30);
      if (heroPhone) heroPhone.style.transform = `translateY(${offset}px) rotate(2.5deg)`;
      header?.classList.toggle('scrolled', window.scrollY > 18);
      animationFrame = null;
    });
  }, { passive: true });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
