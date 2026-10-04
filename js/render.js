import { skillIcons, skillBars } from './data/skills.js';
import { experiences } from './data/experience.js';
import { achievementSlides } from './data/achievements.js';
import { highlights, navLinks, socialLinks, contactDetails } from './data/about.js';

/* ── Nav links (desktop + mobile + footer) ─────────────── */
function renderNavLinks() {
  const desktopUl = document.querySelector('.nav-links');
  const mobileNav = document.querySelector('.mobile-nav');
  const footerNav = document.querySelector('.footer-nav ul');

  const desktopHTML = navLinks.map(l =>
    `<li><a href="${l.href}">${l.label}</a></li>`
  ).join('');

  const mobileHTML = navLinks.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');

  const footerHTML = navLinks.map(l =>
    `<li><a href="${l.href}">${l.label}</a></li>`
  ).join('');

  if (desktopUl) desktopUl.innerHTML = desktopHTML;
  if (footerNav) footerNav.innerHTML = footerHTML;

  // mobile nav has a close button first — append after it
  if (mobileNav) {
    const closeBtn = mobileNav.querySelector('.mobile-nav-close');
    // remove old anchor tags if any
    mobileNav.querySelectorAll('a').forEach(a => a.remove());
    mobileHTML.split('</a>').filter(Boolean).forEach(frag => {
      const tmp = document.createElement('div');
      tmp.innerHTML = frag + '</a>';
      const a = tmp.querySelector('a');
      if (a) mobileNav.appendChild(a);
    });
  }
}

/* ── Skills icons ───────────────────────────────────────── */
function renderSkillIcons() {
  const grid = document.querySelector('.skills-icons-grid');
  if (!grid) return;
  grid.innerHTML = skillIcons.map(s => `
    <div class="skill-icon-wrapper" role="listitem" title="${s.alt}">
      <img src="${s.src}" alt="${s.alt}" loading="lazy"${s.invert ? ' class="theme-invert"' : ''} />
      <span>${s.label}</span>
    </div>
  `).join('');
}

/* ── Skill bars ─────────────────────────────────────────── */
function renderSkillBars() {
  const wrap = document.querySelector('.skills-bars');
  if (!wrap) return;
  wrap.innerHTML = skillBars.map(b => `
    <div class="skill-bar-item" role="listitem">
      <div class="skill-bar-header">
        <span>${b.label}</span>
        <span>${b.percent}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-width="${b.percent}%" style="width:0%"></div>
      </div>
    </div>
  `).join('');
}

/* ── About highlights ───────────────────────────────────── */
function renderHighlights() {
  const wrap = document.querySelector('.about-highlights');
  if (!wrap) return;
  wrap.innerHTML = highlights.map(h => `
    <span class="highlight-chip">
      <i class="${h.icon}"></i>
      ${h.text}
    </span>
  `).join('');
}

/* ── Social links (contact + footer) ───────────────────── */
function renderSocialLinks() {
  document.querySelectorAll('.social-links').forEach(container => {
    container.innerHTML = socialLinks.map(s => `
      <a href="${s.href}" class="social-link" aria-label="${s.label}"
         target="_blank" rel="noopener noreferrer">
        <i class="${s.icon}"></i>
      </a>
    `).join('');
  });
}

/* ── Contact details ────────────────────────────────────── */
function renderContactDetails() {
  const list = document.querySelector('.contact-detail-list');
  if (!list) return;
  list.innerHTML = contactDetails.map(d => `
    <div class="contact-detail">
      <div class="contact-detail-icon"><i class="${d.icon}"></i></div>
      <div class="contact-detail-text">
        <strong>${d.label}</strong>
        ${d.href
          ? `<a href="${d.href}">${d.value}</a>`
          : `<span>${d.value}</span>`}
      </div>
    </div>
  `).join('');

  // Also populate footer address block
  const footerAddr = document.querySelector('.footer-contact address');
  if (!footerAddr) return;
  footerAddr.innerHTML = contactDetails.map(d => `
    <div class="footer-contact-item">
      <i class="${d.icon}"></i>
      ${d.href
        ? `<a href="${d.href}">${d.value}</a>`
        : `<span>${d.value}</span>`}
    </div>
  `).join('');
}

/* ── Experience ─────────────────────────────────────────── */
function renderExperience() {
  const timeline = document.querySelector('.experience-timeline');
  if (!timeline) return;

  timeline.innerHTML = experiences.map((exp, idx) => {
    const isLast = idx === experiences.length - 1;

    const certsHTML = exp.certificates.length ? `
      <h4 style="font-size:var(--fs-sm);margin-bottom:var(--space-3);color:var(--text-secondary);">Certificates</h4>
      <div class="exp-certs-grid">
        ${exp.certificates.map(c => `
          <div>
            <div class="cert-card">
              <img src="${c.img}" alt="${c.alt}" loading="lazy" />
              <div class="cert-overlay">
                <a href="${c.link}" target="_blank" rel="noopener noreferrer">View Credential</a>
              </div>
            </div>
            <p class="cert-label">${c.label}</p>
          </div>
        `).join('')}
      </div>
    ` : '';

    return `
      <div class="exp-card">
        <div class="exp-timeline-column">
          <div class="exp-dot"></div>
          ${!isLast ? '<div class="exp-line"></div>' : ''}
        </div>
        <div class="exp-content">
          <div class="exp-header">
            <p class="exp-duration">
              <i class="fa-solid fa-calendar-days"></i>
              ${exp.duration}
            </p>
            <h3 class="exp-role">${exp.role}</h3>
            <p class="exp-company">${exp.company}</p>
            <div class="comp-description">
              ${exp.description.map(d => `<p>${d}</p>`).join('')}
            </div>
          </div>
          <h4 style="font-size:var(--fs-sm);margin-bottom:var(--space-3);color:var(--text-secondary);margin-top:var(--space-4);">
            Projects Delivered
          </h4>
          <div class="exp-projects-grid">
            ${exp.projects.map(p => `
              <div class="exp-project-chip">
                <h5><i class="${p.icon}"></i> ${p.title}</h5>
                <p>${p.desc}</p>
              </div>
            `).join('')}
          </div>
          ${certsHTML}
        </div>
      </div>
    `;
  }).join('');
}

/* ── Achievement slides ─────────────────────────────────── */
function renderAchievementSlides() {
  const wrapper = document.querySelector('.swiper-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = achievementSlides.map(s => `
    <div class="swiper-slide">
      <img src="${s.src}" alt="${s.alt}" loading="lazy" />
    </div>
  `).join('');
}

/* ── Boot all renderers ─────────────────────────────────── */
export function renderAll() {
  renderNavLinks();
  renderSkillIcons();
  renderSkillBars();
  renderHighlights();
  renderSocialLinks();
  renderContactDetails();
  renderExperience();
  renderAchievementSlides();
}