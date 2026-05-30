/**
 * animations.js
 * Intersection-Observer–driven reveal animations and skill-bar fills.
 */

/**
 * Observe elements with class .reveal and add .visible when they enter the viewport.
 */
function initRevealAnimations() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => observer.observe(el));
}

/**
 * Animate skill progress bars when the skills section enters the viewport.
 */
function initSkillBars() {
  const barsContainer = document.querySelector('.skills-bars');
  if (!barsContainer) return;

  const fills = barsContainer.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fills.forEach((fill) => {
            const target = fill.dataset.width || '0%';
            // Small delay so the bar is visible before animating
            setTimeout(() => { fill.style.width = target; }, 100);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(barsContainer);
}

/**
 * Show / hide scroll-to-top button based on scroll position.
 */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-to-top');
  if (!btn) return;

  const toggle = () => {
    const show = window.scrollY > 300;
    btn.classList.toggle('visible', show);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export { initRevealAnimations, initSkillBars, initScrollToTop };
