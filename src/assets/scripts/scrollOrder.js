import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Deterministic scatter offsets (Lando-style chaos → grid) */
const SCATTER = [
  { x: -140, y: 90, r: -14, s: 0.88 },
  { x: 120, y: -70, r: 11, s: 0.9 },
  { x: -90, y: -110, r: 8, s: 0.86 },
  { x: 160, y: 50, r: -9, s: 0.92 },
  { x: -70, y: 130, r: 15, s: 0.87 },
  { x: 100, y: 100, r: -12, s: 0.89 },
  { x: -130, y: -40, r: 10, s: 0.91 },
  { x: 80, y: -120, r: -7, s: 0.88 },
];

function scatterForIndex(index) {
  return SCATTER[index % SCATTER.length];
}

function sectionScrollLength(itemCount, pinned) {
  const base = pinned ? 0.55 : 0.35;
  return window.innerHeight * (base + itemCount * 0.12);
}

/**
 * Pinned sections: items start scattered and align into grid while scrolling.
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initScrollOrderSections() {
  if (prefersReducedMotion()) return;

  const sections = document.querySelectorAll('.scroll-order-section');

  sections.forEach(section => {
    const items = section.querySelectorAll('.scroll-order-item');
    const header = section.querySelector('.scroll-order-header');
    const footer = section.querySelector('.scroll-order-footer');
    const pinWrap = section.querySelector('.scroll-order-pin') || section;
    const pinned = section.dataset.pin !== 'false';

    if (!items.length) return;

    items.forEach((item, i) => {
      const fromData = {
        x: item.dataset.scatterX,
        y: item.dataset.scatterY,
        r: item.dataset.scatterR,
      };
      const preset = scatterForIndex(
        Number(item.dataset.scatterIndex ?? i)
      );

      gsap.set(item, {
        x: fromData.x ? Number(fromData.x) : preset.x,
        y: fromData.y ? Number(fromData.y) : preset.y,
        rotation: fromData.r ? Number(fromData.r) : preset.r,
        scale: preset.s,
        opacity: 0.35,
        filter: 'blur(6px)',
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity, filter',
      });
    });

    if (header) {
      gsap.set(header, {
        y: 48,
        opacity: 0,
        filter: 'blur(8px)',
      });
    }

    if (footer) {
      gsap.set(footer, { y: 24, opacity: 0 });
    }

    const buildTimeline = (usePin) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: usePin ? 'top top' : 'top 82%',
          end: () => `+=${sectionScrollLength(items.length, usePin)}`,
          pin: usePin ? pinWrap : false,
          scrub: usePin ? 0.85 : 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (header) {
        tl.to(
          header,
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.35,
            ease: 'none',
          },
          0
        );
      }

      tl.to(
        items,
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: { each: 0.06, ease: 'power1.out' },
          duration: 1,
          ease: 'none',
        },
        header ? 0.08 : 0
      );

      if (footer) {
        tl.to(
          footer,
          { y: 0, opacity: 1, duration: 0.2, ease: 'none' },
          0.75
        );
      }

      return tl;
    };

    ScrollTrigger.matchMedia({
      '(min-width: 768px)': () => buildTimeline(pinned),
      '(max-width: 767px)': () => buildTimeline(false),
    });
  });
}

/**
 * Page sections: progressive reveal tied to scroll (no harsh leave state).
 */
export function initScrollSectionReveals() {
  if (prefersReducedMotion()) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const sections = document.querySelectorAll('.reveal-on-scroll');

  sections.forEach(section => {
    const inner =
      section.querySelector('.scroll-reveal-inner') ||
      section.firstElementChild ||
      section;

    gsap.set(inner, {
      y: 56,
      opacity: 0,
      scale: 0.98,
      filter: 'blur(12px)',
      transformOrigin: '50% 0%',
      willChange: 'transform, opacity, filter',
    });

    gsap.to(inner, {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 88%',
        end: 'top 45%',
        scrub: 0.75,
        invalidateOnRefresh: true,
      },
    });
  });
}

export function refreshScrollAnimations() {
  ScrollTrigger.refresh();
}
