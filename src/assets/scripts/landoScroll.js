import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { refreshScrollAnimations } from '@scripts/scrollOrder.js';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function horizontalOverflow(track) {
  const viewport = track.parentElement;
  const viewW = viewport?.clientWidth ?? window.innerWidth;
  return Math.max(track.scrollWidth - viewW + 80, 0);
}

/**
 * Manifesto: pinned, text drifts left as user scrolls (Lando Norris style).
 */
export function initHorizontalManifesto() {
  const sections = document.querySelectorAll('.horizontal-scroll-section');

  sections.forEach(section => {
    const pin = section.querySelector('.horizontal-scroll-pin');
    const track = section.querySelector('.horizontal-scroll-track');
    const indicator = section.querySelector('.scroll-indicator');
    const indicatorBar = section.querySelector('.scroll-indicator-bar');
    if (!pin || !track) return;

    if (prefersReducedMotion()) {
      gsap.set(track, { x: 0, clearProps: 'transform' });
      if (indicator) gsap.set(indicator, { autoAlpha: 0 });
      return;
    }

    const scrollDistance = () =>
      Math.max(horizontalOverflow(track) + window.innerWidth * 0.35, window.innerWidth * 2.4);

    const build = usePin => {
      gsap.set(track, { x: 0, willChange: 'transform' });
      if (indicatorBar) gsap.set(indicatorBar, { y: 0 });
      if (indicator) gsap.set(indicator, { autoAlpha: usePin ? 1 : 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: usePin ? 'top top' : 'top 88%',
          end: () => `+=${scrollDistance()}`,
          pin: usePin ? pin : false,
          scrub: usePin ? 1 : 0.75,
          anticipatePin: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: self => {
            if (!indicatorBar || !indicator) return;
            const trackWrap = indicator.querySelector('.scroll-indicator-track');
            const maxTravel = Math.max(
              (trackWrap?.clientHeight ?? 0) - indicatorBar.clientHeight,
              0
            );
            gsap.set(indicatorBar, { y: maxTravel * self.progress });
          },
        },
      });

      tl.fromTo(
        track,
        { x: 0 },
        {
          x: () => -horizontalOverflow(track),
          ease: 'none',
          duration: 1,
        },
        0
      );

      return tl;
    };

    ScrollTrigger.matchMedia({
      '(min-width: 768px)': () => build(true),
      '(max-width: 767px)': () => build(false),
    });
  });
}

function initPanelMerge(panel, tl, at = 0) {
  const main = panel.querySelector('.split-merge-word--main');
  const dup = panel.querySelector('.split-merge-word--dup');
  const kicker = panel.querySelector('.split-merge-kicker');
  const desc = panel.querySelector('.split-merge-desc');
  const progressFill = panel
    .closest('.split-merge-section')
    ?.querySelector('.lando-panels-progress-fill');

  if (kicker) {
    gsap.set(kicker, { x: -72, opacity: 0 });
    tl.to(kicker, { x: 0, opacity: 1, duration: 0.22, ease: 'none' }, at);
  }

  if (main && dup) {
    gsap.set(main, { x: -56, y: 48, opacity: 0.65 });
    gsap.set(dup, { x: 64, y: -36, opacity: 0.25 });
    tl.to(
      [main, dup],
      { x: 0, y: 0, opacity: 1, duration: 0.45, ease: 'none' },
      at + 0.06
    );
    tl.to(
      dup,
      { opacity: 0.22, duration: 0.15, ease: 'none' },
      at + 0.42
    );
  }

  if (desc) {
    gsap.set(desc, {
      y: 32,
      opacity: 0,
      filter: 'blur(10px)',
    });
    tl.to(
      desc,
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.35,
        ease: 'none',
      },
      at + 0.2
    );
  }

  if (progressFill) {
    const panelIndex = Number(panel.dataset.panel ?? 0);
    const panelCount =
      panel.closest('.split-merge-panels')?.querySelectorAll('.split-merge-panel')
        .length ?? 1;
    tl.to(
      progressFill,
      {
        scaleX: (panelIndex + 1) / panelCount,
        duration: 0.25,
        ease: 'none',
      },
      at + 0.1
    );
  }
}

/**
 * ON / OFF TRACK-style stacked titles + horizontal panel sweep.
 */
export function initSplitMergePanels() {
  const sections = document.querySelectorAll('.split-merge-section');

  sections.forEach(section => {
    const pin = section.querySelector('.split-merge-pin');
    const stage = section.querySelector('.split-merge-stage');
    const panelsWrap = section.querySelector('.split-merge-panels');
    const panels = section.querySelectorAll('.split-merge-panel');
    const progressFill = section.querySelector('.lando-panels-progress-fill');

    if (!pin || !stage || !panelsWrap || !panels.length) return;

    const stageWidth = () => stage.clientWidth || window.innerWidth;

    if (prefersReducedMotion()) {
      gsap.set(panelsWrap, { x: 0, clearProps: 'transform' });
      gsap.set(
        [...panels].flatMap(p => [
          ...p.querySelectorAll('.split-merge-kicker'),
          ...p.querySelectorAll('.split-merge-word'),
          ...p.querySelectorAll('.split-merge-desc'),
        ]),
        { x: 0, y: 0, opacity: 1, filter: 'none', clearProps: 'all' }
      );
      if (progressFill) gsap.set(progressFill, { scaleX: 1 });
      return;
    }

    const panelCount = panels.length;
    const segment = () => window.innerHeight * 1.15;

    ScrollTrigger.matchMedia({
      '(min-width: 768px)': () => {
        gsap.set(panelsWrap, { x: 0, willChange: 'transform' });
        if (progressFill) gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${segment() * panelCount}`,
            pin,
            scrub: 1,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        const panelDur = 1 / panelCount;

        panels.forEach((panel, i) => {
          const start = i * panelDur;
          initPanelMerge(panel, tl, start + 0.02);

          if (i < panelCount - 1) {
            tl.to(
              panelsWrap,
              {
                x: () => -(i + 1) * stageWidth(),
                ease: 'none',
                duration: panelDur * 0.45,
              },
              start + panelDur * 0.52
            );
          }
        });

        return tl;
      },
      '(max-width: 767px)': () => {
        gsap.set(panelsWrap, { x: 0 });
        if (progressFill) gsap.set(progressFill, { scaleX: 1 });

        panels.forEach((panel, i) => {
          const mini = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          initPanelMerge(panel, mini, 0);
        });
      },
    });
  });
}

export function initLandoScroll() {
  initHorizontalManifesto();
  initSplitMergePanels();
  refreshScrollAnimations();
}
