// Global, dependency-free progressive-enhancement scripts: scroll fade-ins,
// the mobile nav toggle and the transparent-over-hero header. The lightbox with its
// zoom loupe, the before/after slider and work filter live here too. Loaded on every page.
//
// The site uses Astro's ClientRouter, so this module only runs once per full
// load. Per-page setup lives in init(), which runs on every `astro:page-load`
// and registers its teardown in `cleanups` so it can safely run again.

import { useTranslations, type Lang } from '../i18n/ui';

// Same curve as --ease in global.css. Used by the Web Animations API code
// (lightbox, work filter FLIP).
export const EASE = 'cubic-bezier(.2,.8,.2,1)';

export let cleanups: Array<() => void> = [];

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupFadeIns() {
  const targets = document.querySelectorAll<HTMLElement>('.fade-in');
  if (!targets.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Reveal anything already in (or above) the viewport instantly, with no
  // transition, so above-the-fold content never visibly animates in.
  const revealInstantly = (el: HTMLElement) => {
    const previousTransition = el.style.transition;
    el.style.transition = 'none';
    el.classList.add('is-visible');
    el.offsetHeight; // force reflow before restoring the transition
    el.style.transition = previousTransition;
  };

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const toObserve: HTMLElement[] = [];

  targets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < viewportHeight && rect.bottom > 0) {
      revealInstantly(el);
    } else {
      toObserve.push(el);
    }
  });

  if (!toObserve.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  toObserve.forEach((el) => observer.observe(el));
  cleanups.push(() => observer.disconnect());
}

function setupNav() {
  const toggleEl = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panelEl = document.querySelector<HTMLElement>('[data-nav-panel]');
  const headerEl = document.querySelector<HTMLElement>('[data-header]');
  if (!toggleEl || !panelEl || !headerEl) return;
  const toggle = toggleEl;
  const panel = panelEl;
  const header = headerEl;

  const desktop = window.matchMedia('(min-width: 860px)');
  let isOpen = false;

  function setOpen(open: boolean, restoreFocus = true) {
    if (open === isOpen) return;
    isOpen = open;
    if (open) {
      const gap = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--sbw', `${gap}px`);
    } else {
      document.documentElement.style.removeProperty('--sbw');
    }
    panel.classList.toggle('is-open', open);
    header.classList.toggle('is-menu-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute(
      'aria-label',
      toggle.getAttribute(open ? 'data-label-close' : 'data-label-open') ?? '',
    );
    if (open) {
      document.addEventListener('keydown', onKeydown);
    } else {
      document.removeEventListener('keydown', onKeydown);
      if (restoreFocus) toggle.focus({ preventScroll: true });
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    // Keep focus inside the header bar and the panel.
    const items = Array.from(
      header.querySelectorAll<HTMLElement>('a[href], button'),
    ).filter((el) => el.offsetParent !== null || el === toggle);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (!active || !header.contains(active)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const onToggle = () => setOpen(!isOpen);
  const onLinkClick = () => setOpen(false, false);
  const onBreakpoint = () => {
    if (desktop.matches) setOpen(false, false);
  };

  // Start closed, in case the previous page was left with the menu open.
  document.body.classList.remove('nav-open');
  document.documentElement.style.removeProperty('--sbw');

  const links = panel.querySelectorAll('a');
  toggle.addEventListener('click', onToggle);
  links.forEach((link) => link.addEventListener('click', onLinkClick));
  desktop.addEventListener('change', onBreakpoint);

  cleanups.push(() => {
    toggle.removeEventListener('click', onToggle);
    links.forEach((link) => link.removeEventListener('click', onLinkClick));
    desktop.removeEventListener('change', onBreakpoint);
    document.removeEventListener('keydown', onKeydown);
    if (isOpen) {
      document.body.classList.remove('nav-open');
      document.documentElement.style.removeProperty('--sbw');
    }
  });
}

// Registered once; looks the header up each time because ClientRouter
// replaces it on navigation.
function updateHeaderScroll() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header || !header.classList.contains('header--transparent')) return;
  header.classList.toggle('is-scrolled', window.scrollY > 40);
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const currentLang = (): Lang => (document.documentElement.lang === 'es' ? 'es' : 'en');

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

let hintShown = false;

function setupLightbox() {
  const triggers = Array.from(
    document.querySelectorAll<HTMLElement>('[data-lightbox-trigger]'),
  );
  if (!triggers.length) return;

  const t = useTranslations(currentLang());
  const count = triggers.length;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', t('lightbox.label'));
  overlay.setAttribute('aria-hidden', 'true');
  const icon = (d: string) =>
    `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  overlay.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <button type="button" class="lightbox__btn lightbox__zoom" aria-pressed="false" aria-label="${t('lightbox.zoomIn')}">
      <span class="lightbox__zoom-in">${icon('<circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6"></path>')}</span>
      <span class="lightbox__zoom-out">${icon('<circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M15.5 15.5L21 21M7.5 10.5h6"></path>')}</span>
    </button>
    <button type="button" class="lightbox__btn lightbox__close" aria-label="${t('lightbox.close')}">${icon('<path d="M5 5l14 14M19 5L5 19"></path>')}</button>
    <button type="button" class="lightbox__btn lightbox__arrow lightbox__arrow--prev" aria-label="${t('lightbox.prev')}">${icon('<path d="M15 4l-8 8 8 8"></path>')}</button>
    <button type="button" class="lightbox__btn lightbox__arrow lightbox__arrow--next" aria-label="${t('lightbox.next')}">${icon('<path d="M9 4l8 8-8 8"></path>')}</button>
    <p class="lightbox__hint" aria-hidden="true"></p>
    <p class="lightbox__counter" aria-live="polite"></p>
  `;
  document.body.appendChild(overlay);

  const q = <T extends HTMLElement>(sel: string) => overlay.querySelector(sel) as T;
  const backdrop = q('.lightbox__backdrop');
  const closeBtn = q<HTMLButtonElement>('.lightbox__close');
  const zoomBtn = q<HTMLButtonElement>('.lightbox__zoom');
  const prevBtn = q<HTMLButtonElement>('.lightbox__arrow--prev');
  const nextBtn = q<HTMLButtonElement>('.lightbox__arrow--next');
  const counter = q('.lightbox__counter');
  const hint = q('.lightbox__hint');
  if (count < 2) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
  }

  const preloaded = new Set<string>();
  let isOpen = false;
  let isClosing = false;
  let isOpening = false;
  let currentIndex = 0;
  let currentImg: HTMLImageElement | null = null;
  let currentBox: Box | null = null;
  let hintTimer = 0;

  // Zoom loupe state. `zs` is the scale, `zx`/`zy` the translate in px
  // (image laid out at currentBox, transform-origin 0 0).
  let zoomed = false;
  let zs = 1;
  let zx = 0;
  let zy = 0;

  const ms = (n: number) => (prefersReducedMotion() ? 0 : n);
  const thumbOf = (i: number) => triggers[i].querySelector('img') as HTMLImageElement;
  const fullOf = (i: number) => triggers[i].getAttribute('data-full') ?? '';

  function thumbBox(i: number): Box {
    const r = thumbOf(i).getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  function isInView(b: Box) {
    return (
      b.top + b.height > 0 &&
      b.top < overlay.clientHeight &&
      b.left + b.width > 0 &&
      b.left < overlay.clientWidth
    );
  }

  function aspectOf(i: number) {
    const w = Number(triggers[i].getAttribute('data-w'));
    const h = Number(triggers[i].getAttribute('data-h'));
    if (w && h) return w / h;
    const th = thumbOf(i);
    return th.naturalWidth && th.naturalHeight ? th.naturalWidth / th.naturalHeight : 3 / 2;
  }

  /** Contain-fit box, centered in the viewport, for a photo of this aspect. */
  function fitBox(aspect: number): Box {
    const vw = overlay.clientWidth;
    const vh = overlay.clientHeight;
    // Keep clear bands for the buttons above, the counter and hint below,
    // and (on wider screens) the side arrows.
    const sides = vw >= 640 ? 80 : 12;
    const top = 64;
    const bottom = 80;
    const maxW = Math.min(vw - sides * 2, 1600);
    const maxH = vh - top - bottom;
    let width = maxW;
    let height = width / aspect;
    if (height > maxH) {
      height = maxH;
      width = height * aspect;
    }
    return { left: (vw - width) / 2, top: top + (maxH - height) / 2, width, height };
  }

  function place(el: HTMLElement, b: Box) {
    el.style.left = `${b.left}px`;
    el.style.top = `${b.top}px`;
    el.style.width = `${b.width}px`;
    el.style.height = `${b.height}px`;
  }

  /** Transform that makes an element laid out at `to` appear at `from`. */
  function flip(from: Box, to: Box) {
    return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  }

  function preload(i: number) {
    const src = fullOf(i);
    if (preloaded.has(src)) return;
    preloaded.add(src);
    new Image().src = src;
  }

  function preloadNeighbours(i: number) {
    preload((i + 1) % count);
    preload((i - 1 + count) % count);
  }

  /** An <img> showing photo `i`: the loaded thumbnail first, then the full-size file. */
  function createImg(i: number) {
    const el = document.createElement('img');
    el.className = 'lightbox__img';
    el.alt = triggers[i].getAttribute('data-alt') ?? '';
    el.decoding = 'async';
    el.draggable = false;
    const thumb = thumbOf(i);
    const full = fullOf(i);
    const useThumb = thumb.complete && thumb.naturalWidth > 0;
    el.src = useThumb ? thumb.currentSrc || thumb.src : full;
    if (useThumb) {
      const loader = new Image();
      loader.src = full;
      const swap = () => {
        if (el.isConnected) el.src = full;
      };
      loader.decode().then(swap, swap);
    }
    return el;
  }

  function setThumbHidden(i: number, hidden: boolean) {
    thumbOf(i).style.visibility = hidden ? 'hidden' : '';
  }

  function updateCounter() {
    counter.textContent = t('lightbox.counter', { n: currentIndex + 1, total: count });
  }

  function lockScroll() {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--sbw', `${gap}px`);
    document.body.classList.add('lightbox-open');
  }

  function unlockScroll() {
    document.body.classList.remove('lightbox-open');
    document.documentElement.style.removeProperty('--sbw');
  }

  // ---- Zoom loupe ----

  function syncZoomUi() {
    zoomBtn.setAttribute('aria-pressed', String(zoomed));
    zoomBtn.setAttribute('aria-label', t(zoomed ? 'lightbox.zoomOut' : 'lightbox.zoomIn'));
    overlay.classList.toggle('is-zoomed', zoomed);
    currentImg?.classList.toggle('is-zoomed', zoomed);
  }

  /** Translate for a zoomed image so the point under (px, py) maps proportionally across it. */
  function panTo(px: number, py: number) {
    if (!currentImg || !currentBox) return;
    const fx = clamp((px - currentBox.left) / currentBox.width, 0, 1);
    const fy = clamp((py - currentBox.top) / currentBox.height, 0, 1);
    zx = -fx * (zs - 1) * currentBox.width;
    zy = -fy * (zs - 1) * currentBox.height;
    currentImg.style.transform = `translate(${zx}px, ${zy}px) scale(${zs})`;
  }

  function setZoom(on: boolean, px = 0, py = 0, animate = true) {
    if (!currentImg || !currentBox) return;
    if (on === zoomed && !(on && animate)) return;
    const img = currentImg;
    if (on) {
      const natural = Number(triggers[currentIndex].getAttribute('data-w')) || img.naturalWidth;
      zs = clamp(natural / currentBox.width, 2, 4);
      zoomed = true;
      hideHint();
      img.style.transition = animate ? `transform ${ms(350)}ms ${EASE}` : 'none';
      panTo(px, py);
    } else {
      zoomed = false;
      zs = 1;
      zx = 0;
      zy = 0;
      img.style.transition = animate ? `transform ${ms(350)}ms ${EASE}` : 'none';
      img.style.transform = 'translate(0px, 0px) scale(1)';
    }
    syncZoomUi();
  }

  function hideHint() {
    window.clearTimeout(hintTimer);
    hint.classList.remove('is-shown');
  }

  function showHint() {
    if (hintShown) return;
    hintShown = true;
    const fine = window.matchMedia('(pointer: fine)').matches;
    hint.textContent = t(fine ? 'lightbox.hintClick' : 'lightbox.hintTouch');
    hint.classList.add('is-shown');
    hintTimer = window.setTimeout(hideHint, 3200);
  }

  // ---- Open / navigate / close ----

  function open(index: number) {
    if (isOpen) return;
    isOpen = true;
    isOpening = true;
    currentIndex = index;

    const from = thumbBox(index);
    lockScroll();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');

    const el = createImg(index);
    currentBox = fitBox(aspectOf(index));
    place(el, currentBox);
    overlay.appendChild(el);
    currentImg = el;
    setThumbHidden(index, true);
    updateCounter();

    overlay.offsetWidth; // flush so the backdrop fade runs from opacity 0
    overlay.classList.add('is-visible');
    const anim = el.animate([{ transform: flip(from, currentBox) }, { transform: 'none' }], {
      duration: ms(500),
      easing: EASE,
    });
    const opened = () => {
      isOpening = false;
    };
    anim.finished.then(opened, opened);

    closeBtn.focus({ preventScroll: true });
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize);
    preloadNeighbours(index);
    showHint();
  }

  function go(dir: 1 | -1) {
    if (!isOpen || isClosing || count < 2 || !currentImg) return;
    setZoom(false, 0, 0, false);
    overlay.querySelectorAll('.lightbox__img.is-leaving').forEach((el) => el.remove());

    const outgoing = currentImg;
    outgoing.classList.add('is-leaving');
    outgoing
      .animate(
        { transform: `translateX(${-dir * 6}%)`, opacity: 0 },
        { duration: ms(400), easing: EASE, fill: 'forwards' },
      )
      .finished.then(() => outgoing.remove(), () => {});

    setThumbHidden(currentIndex, false);
    currentIndex = (currentIndex + dir + count) % count;
    setThumbHidden(currentIndex, true);

    const incoming = createImg(currentIndex);
    currentBox = fitBox(aspectOf(currentIndex));
    place(incoming, currentBox);
    overlay.appendChild(incoming);
    currentImg = incoming;
    incoming.animate(
      [
        { transform: `translateX(${dir * 6}%)`, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: ms(500), easing: EASE },
    );

    updateCounter();
    preloadNeighbours(currentIndex);
  }

  function close() {
    if (!isOpen || isClosing || !currentImg || !currentBox) return;
    isClosing = true;
    hideHint();
    setZoom(false, 0, 0, false);
    overlay.classList.remove('is-visible');
    overlay.querySelectorAll('.lightbox__img.is-leaving').forEach((el) => el.remove());

    // Bring the current photo's thumbnail on screen so the image can land on it.
    let target = thumbBox(currentIndex);
    const vh = overlay.clientHeight;
    if (target.top < 0 || target.top + target.height > vh) {
      window.scrollTo({
        top: window.scrollY + target.top - (vh - target.height) / 2,
        behavior: 'instant',
      });
      target = thumbBox(currentIndex);
    }

    const anim = isInView(target)
      ? currentImg.animate([{ transform: 'none' }, { transform: flip(target, currentBox) }], {
          duration: ms(450),
          easing: EASE,
          fill: 'forwards',
        })
      : currentImg.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: ms(300),
          easing: EASE,
          fill: 'forwards',
        });

    const finish = () => {
      triggers.forEach((_, i) => setThumbHidden(i, false));
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.querySelectorAll('.lightbox__img').forEach((el) => el.remove());
      currentImg = null;
      unlockScroll();
      isOpen = false;
      isClosing = false;
      triggers[currentIndex].focus({ preventScroll: true });
    };
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResize);
    anim.finished.then(finish, finish);
  }

  function onResize() {
    if (!currentImg) return;
    setZoom(false, 0, 0, false);
    currentBox = fitBox(aspectOf(currentIndex));
    place(currentImg, currentBox);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (zoomed) setZoom(false);
      else close();
    }
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'Tab') {
      // Keep focus inside the dialog.
      const items = [zoomBtn, closeBtn, prevBtn, nextBtn].filter((b) => !b.hidden);
      const idx = items.indexOf(document.activeElement as HTMLButtonElement);
      e.preventDefault();
      items[(idx + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
    }
  }

  // ---- Pointer handling: click-to-zoom, mouse pan, touch pan, double-tap, swipe ----

  let touchId = -1;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let startTime = 0;
  let moved = false;
  let lastTap = { time: 0, x: 0, y: 0 };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' || touchId !== -1) return;
    touchId = e.pointerId;
    startX = lastX = e.clientX;
    startY = lastY = e.clientY;
    startTime = performance.now();
    moved = false;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') {
      if (zoomed && !isClosing) {
        if (currentImg) currentImg.style.transition = `transform ${ms(120)}ms linear`;
        panTo(e.clientX, e.clientY);
      }
      return;
    }
    if (e.pointerId !== touchId) return;
    if (Math.hypot(e.clientX - startX, e.clientY - startY) > 10) moved = true;
    if (zoomed && currentImg && currentBox) {
      currentImg.style.transition = 'none';
      zx = clamp(zx + e.clientX - lastX, -(zs - 1) * currentBox.width, 0);
      zy = clamp(zy + e.clientY - lastY, -(zs - 1) * currentBox.height, 0);
      currentImg.style.transform = `translate(${zx}px, ${zy}px) scale(${zs})`;
    }
    lastX = e.clientX;
    lastY = e.clientY;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' || e.pointerId !== touchId) return;
    touchId = -1;
    if (!isOpen || isClosing || isOpening) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (moved) {
      if (!zoomed && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      return;
    }
    if (e.target !== currentImg || performance.now() - startTime > 400) return;
    const now = performance.now();
    if (now - lastTap.time < 320 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 40) {
      lastTap.time = 0;
      setZoom(!zoomed, e.clientX, e.clientY);
    } else {
      lastTap = { time: now, x: e.clientX, y: e.clientY };
    }
  };

  const onPointerCancel = () => {
    touchId = -1;
  };

  const onOverlayClick = (e: MouseEvent) => {
    if (e.target === overlay || e.target === backdrop) {
      close();
      return;
    }
    // Click on the photo itself toggles zoom (mouse only; touch uses double-tap).
    if (e.target === currentImg && (e as PointerEvent).pointerType !== 'touch' && !isOpening) {
      setZoom(!zoomed, e.clientX, e.clientY);
    }
  };

  const triggerHandlers = triggers.map((trigger, i) => {
    const handler = (e: Event) => {
      e.preventDefault();
      open(i);
    };
    trigger.addEventListener('click', handler);
    return handler;
  });

  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', () => go(1));
  prevBtn.addEventListener('click', () => go(-1));
  zoomBtn.addEventListener('click', () => {
    if (zoomed) setZoom(false);
    else if (currentBox && !isOpening) {
      setZoom(true, currentBox.left + currentBox.width / 2, currentBox.top + currentBox.height / 2);
    }
  });
  overlay.addEventListener('click', onOverlayClick);
  overlay.addEventListener('pointerdown', onPointerDown);
  overlay.addEventListener('pointermove', onPointerMove);
  overlay.addEventListener('pointerup', onPointerUp);
  overlay.addEventListener('pointercancel', onPointerCancel);

  cleanups.push(() => {
    window.clearTimeout(hintTimer);
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResize);
    triggers.forEach((trigger, i) => trigger.removeEventListener('click', triggerHandlers[i]));
    if (isOpen) {
      unlockScroll();
      triggers.forEach((_, i) => setThumbHidden(i, false));
    }
    overlay.remove();
  });
}

function setupBeforeAfter() {
  document.querySelectorAll<HTMLElement>('[data-ba]').forEach((root) => {
    const range = root.querySelector<HTMLInputElement>('input[type="range"]');
    if (!range) return;
    const update = () => root.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', update);
    update();
    cleanups.push(() => range.removeEventListener('input', update));
  });
}

function setupWorkFilter() {
  const filters = document.querySelector<HTMLElement>('[data-filters]');
  const grid = document.querySelector<HTMLElement>('[data-work-grid]');
  if (!filters || !grid) return;
  const chips = Array.from(filters.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-category]'));
  filters.hidden = false;

  const onClick = (e: Event) => {
    const chip = e.currentTarget as HTMLButtonElement;
    const value = chip.getAttribute('data-filter') ?? 'all';
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));

    // FLIP: measure visible cards, apply the filter, then animate to the new layout.
    const before = new Map<HTMLElement, DOMRect>();
    cards.forEach((c) => {
      if (!c.hidden) before.set(c, c.getBoundingClientRect());
    });
    cards.forEach((c) => {
      c.hidden = value !== 'all' && c.getAttribute('data-category') !== value;
    });
    if (prefersReducedMotion()) return;
    cards.forEach((c) => {
      if (c.hidden) return;
      const last = c.getBoundingClientRect();
      const first = before.get(c);
      if (!first) {
        c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: EASE });
        return;
      }
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (!dx && !dy) return;
      c.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: 450, easing: EASE },
      );
    });
  };

  chips.forEach((c) => c.addEventListener('click', onClick));
  cleanups.push(() => chips.forEach((c) => c.removeEventListener('click', onClick)));
}

function init() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  document.documentElement.classList.add('js');
  setupFadeIns();
  setupNav();
  updateHeaderScroll();
  setupLightbox();
  setupBeforeAfter();
  setupWorkFilter();
}

document.addEventListener('astro:page-load', init);
// The incoming document's <html> has no `js` class (it is added by an inline
// script that doesn't re-run), so restore it before the new page paints.
document.addEventListener('astro:after-swap', () => {
  document.documentElement.classList.add('js');
});
// Tear down before the DOM is replaced so no listeners or overlays leak.
document.addEventListener('astro:before-swap', () => {
  cleanups.forEach((fn) => fn());
  cleanups = [];
});
window.addEventListener('scroll', updateHeaderScroll, { passive: true });
