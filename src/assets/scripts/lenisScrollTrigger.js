import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
let lenisRaf = null;

/**
 * Lenis + GSAP ScrollTrigger (landonorris-style smooth scrub).
 * @see https://gsap.com/docs/v3/Plugins/ScrollTrigger/#static-scrollerProxy()
 */
export function initLenisScrollTrigger() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoRaf: false,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  lenisRaf = time => {
    lenisInstance?.raf(time * 1000);
  };
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && lenisInstance) {
        lenisInstance.scrollTo(value, { immediate: true });
      }
      return lenisInstance?.animatedScroll ?? window.scrollY;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.addEventListener('refresh', () => lenisInstance?.resize());
  ScrollTrigger.refresh();

  return lenisInstance;
}

export function setupSmoothScroll() {
  destroyLenisScrollTrigger();
  return initLenisScrollTrigger();
}

export function destroyLenisScrollTrigger() {
  ScrollTrigger.getAll().forEach(t => t.kill());
  if (lenisRaf) {
    gsap.ticker.remove(lenisRaf);
    lenisRaf = null;
  }
  lenisInstance?.destroy();
  lenisInstance = null;
}
