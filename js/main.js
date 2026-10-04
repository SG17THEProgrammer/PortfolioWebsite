import { initTheme, toggleTheme }                            from './darkmode.js';
import { initRevealAnimations, initSkillBars, initScrollToTop } from './animations.js';
import {
  FIREBASE_CONFIG,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  GITHUB_USERNAME
} from './config.js';
import { initProjects } from './projects.js';
import { renderAll } from './render.js';

/* ── Firebase SDK (ESM) ────────────────────────────────────── */
import { initializeApp }              from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getDatabase, ref, push, set } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js';

const app = initializeApp(FIREBASE_CONFIG);
const db  = getDatabase(app);

//populate all data-driven sections first
renderAll();

// Populate GITHUB_USERNAME in index.html
const githubLink = document.getElementById("github-link");
if (githubLink) {
  githubLink.href = `https://github.com/${GITHUB_USERNAME}`;
}

//loading logo until the projects are being fetched 
const el = document.querySelector('.hero-stat-projects strong');
if(el){
  el.textContent='⏳'
  el.style.textAlign='center'
}


/* ── Theme ─────────────────────────────────────────────────── */
initTheme();

document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);

/* ── Mobile Navigation ─────────────────────────────────────── */
const hamburger  = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav-close');

function openMobileNav() {
  mobileNav?.classList.add('open');
  hamburger?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav?.classList.remove('open');
  hamburger?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);

mobileNav?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', closeMobileNav);
});

mobileNav?.addEventListener('click', (e) => {
  if (e.target === mobileNav) closeMobileNav();
});

/* ── Smooth-scroll nav links ──────────────────────────────── */
function smoothScrollTo(selector) {
  const target = document.querySelector(selector);
  if (target) target.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.length > 1) {
      e.preventDefault();
      smoothScrollTo(href);
    }
  });
});

/* ── Swiper ───────────────────────────────────────────────── */
function initSwiper() {
  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  return new Swiper('.mySwiper', {
    slidesPerView: isMobile ? 1 : 2,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 2800,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640:  { slidesPerView: 1 },
      768:  { slidesPerView: 2 },
      1024: { slidesPerView: 2 },
    },
  });
}

if (document.querySelector('.mySwiper')) {
  if (typeof Swiper !== 'undefined') {
    initSwiper();
  } else {
    window.addEventListener('load', initSwiper);
  }
}

/* ── Typed.js ─────────────────────────────────────────────── */
function initTyped() {
  if (typeof Typed === 'undefined') return;
  new Typed('.typing', {
    strings: [
      'Full Stack Developer',
      'MERN Stack Developer',
      'Technical Analyst',
      'Problem Solver',
      'AI Engineer',
      'Quick Learner',
    ],
    typeSpeed:  80,
    backSpeed:  50,
    loop:       true,
    backDelay:  1400,
  });
}

if (document.querySelector('.typing')) {
  if (typeof Typed !== 'undefined') {
    initTyped();
  } else {
    window.addEventListener('load', initTyped);
  }
}

/* ── Contact Form ─────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const feedback    = document.getElementById('formFeedback');

function showFeedback(type, msg) {
  if (!feedback) return;
  feedback.className = `form-feedback ${type}`;
  feedback.textContent = msg;
  setTimeout(() => { feedback.className = 'form-feedback'; }, 5000);
}

function validateForm({ name, email, subject, message }) {
  if (!name || name.trim().length < 3)          return 'Name must be at least 3 characters.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (!subject || subject.trim().length < 3)     return 'Subject must be at least 3 characters.';
  if (!message || message.trim().length < 10)    return 'Message must be at least 10 characters.';
  return null;
}

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name:    document.getElementById('name')?.value ?? '',
    email:   document.getElementById('email')?.value ?? '',
    subject: document.getElementById('subject')?.value ?? '',
    message: document.getElementById('message')?.value ?? '',
  };

  const error = validateForm(formData);
  if (error) { showFeedback('error', error); return; }

  const submitBtn = contactForm.querySelector('.submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
  }

  try {
    const userRef    = ref(db, 'users');
    const newUserRef = push(userRef);
    await set(newUserRef, { ...formData, timestamp: Date.now() });

    if (typeof emailjs !== 'undefined') {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name:    formData.name,
        email:   formData.email,
        subject: formData.subject,
        message: formData.message,
      });
    }

    showFeedback('success', '✓ Message sent! I\'ll get back to you soon.');
    contactForm.reset();
  } catch (err) {
    console.error('Contact form error:', err);
    showFeedback('error', 'Something went wrong. Please try again.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
  }
});

/* ── Animations & Scroll ──────────────────────────────────── */
initRevealAnimations();
initSkillBars();
initScrollToTop();

/* ── Dynamic Projects ─────────────────────────────────────── */
initProjects();  

/* ── EmailJS init (reads key from config.js) ──────────────── */
window.addEventListener('DOMContentLoaded', () => {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
});



