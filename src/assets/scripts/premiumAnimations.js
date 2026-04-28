
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPremiumAnimations() {
  // 1. Magnetic Elements
  const magneticElements = document.querySelectorAll('.magnetic-effect');
  
  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.5,
        ease: 'power2.out',
      });
      
      const text = el.querySelector('span');
      if (text) {
        gsap.to(text, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
      });
      const text = el.querySelector('span');
      if (text) {
        gsap.to(text, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    });
  });

  // 2. Text Reveal (Word by Word)
  const revealTexts = document.querySelectorAll('.reveal-text');
  revealTexts.forEach((text) => {
    const words = text.innerText.split(' ');
    text.innerHTML = words
      .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full">${word}&nbsp;</span></span>`)
      .join('');
    
    const spans = text.querySelectorAll('span span');
    
    gsap.to(spans, {
      y: 0,
      stagger: 0.05,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: text,
        start: 'top 85%',
      },
    });
  });

  // 3. Image Reveal (Zoom + Reveal)
  const revealImages = document.querySelectorAll('.reveal-image');
  revealImages.forEach((imgContainer) => {
    const img = imgContainer.querySelector('img');
    
    gsap.fromTo(imgContainer, 
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { 
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: imgContainer,
          start: 'top 90%',
        }
      }
    );
    
    if (img) {
      gsap.fromTo(img, 
        { scale: 1.3 },
        { 
          scale: 1,
          duration: 2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: imgContainer,
            start: 'top 90%',
          }
        }
      );
    }
  });

  // 4. Parallax Sections
  const parallaxElements = document.querySelectorAll('.parallax-element');
  parallaxElements.forEach((el) => {
    const speed = el.dataset.speed || 0.1;
    gsap.to(el, {
      y: (index, target) => -ScrollTrigger.maxScroll(window) * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });
}
