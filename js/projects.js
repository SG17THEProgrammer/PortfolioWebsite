/**
 * projects.js  —  Dynamic GitHub projects for Shray Gupta Portfolio
 *
 * FIXES IN THIS VERSION:
 *  1. Icons: keyword-based emoji/icon from repo NAME (not language), small & inline
 *  2. Live re-render after every change — no manual refresh needed
 *  3. Admin panel moves projects section full-width below skills grid
 *  4. Horizontal card layout matching the "Notes Taking App" style from screenshot
 */
import { UNSPLASH_ACCESS_KEY } from './config.js';

/* ── Admin secret lives ONLY in the URL param — never stored ── */
const getSecret = () => new URLSearchParams(window.location.search).get('admin');
const isAdmin = () => Boolean(getSecret());

/* ── Devicons map: language → icon URL (for admin chips only) ─ */
const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const LANG_ICON = {
  javascript: `${DEVICON_BASE}/javascript/javascript-original.svg`,
  typescript: `${DEVICON_BASE}/typescript/typescript-original.svg`,
  python: `${DEVICON_BASE}/python/python-original.svg`,
  java: `${DEVICON_BASE}/java/java-original.svg`,
  html: `${DEVICON_BASE}/html5/html5-original.svg`,
  css: `${DEVICON_BASE}/css3/css3-original.svg`,
  react: `${DEVICON_BASE}/react/react-original.svg`,
  nextjs: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  nodejs: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  mongodb: `${DEVICON_BASE}/mongodb/mongodb-original.svg`,
  mysql: `${DEVICON_BASE}/mysql/mysql-original.svg`,
  flask: `${DEVICON_BASE}/flask/flask-original.svg`,
  redis: `${DEVICON_BASE}/redis/redis-original.svg`,
  firebase: `${DEVICON_BASE}/firebase/firebase-plain.svg`,
  go: `${DEVICON_BASE}/go/go-original.svg`,
  rust: `${DEVICON_BASE}/rust/rust-plain.svg`,
  kotlin: `${DEVICON_BASE}/kotlin/kotlin-original.svg`,
  swift: `${DEVICON_BASE}/swift/swift-original.svg`,
  php: `${DEVICON_BASE}/php/php-original.svg`,
};

function getLangIcon(language = '') {
  return LANG_ICON[language.toLowerCase()] ?? null;
}

/* ── 1. Verified Icons8 Map ──────────────────────────────────── */
const ICONS8 = 'https://img.icons8.com/fluency/96';
const NAME_ICON_MAP = [
  // 1. Highly specific keywords
  { keys: ['finance', 'stock', 'trading', 'crypto', 'bank'], icon: `${ICONS8}/money-bag.png` },
  { keys: ['teacher', 'quiz', 'exam', 'education', 'study'], icon: `${ICONS8}/graduation-cap.png` },
  { keys: ['airbnb', 'hotel', 'booking', 'travel', 'clone'], icon: `${ICONS8}/airplane-take-off.png` },
  { keys: ['vocab', 'dictionary', 'language', 'translate'], icon: `${ICONS8}/language.png` },
  { keys: ['game', 'snake', 'chess'], icon: `${ICONS8}/controller.png` },

  // 2. Broader categories
  { keys: ['ai', 'gpt', 'llm', 'gemini', 'claude', 'bot', 'assistant'], icon: `${ICONS8}/bot.png` },
  { keys: ['note', 'diary', 'journal', 'blog', 'todo', 'list'], icon: `${ICONS8}/spiral-bound-booklet.png` },
  { keys: ['job', 'resume', 'career'], icon: `${ICONS8}/parse-from-clipboard.png` },
  { keys: ['chat', 'message', 'social'], icon: `${ICONS8}/chat-message.png` },

  // 3. Generic tech terms
  { keys: ['portfolio', 'website', 'personal', 'web'], icon: `${ICONS8}/domain.png` },
  { keys: ['automate', 'workflow', 'automation'], icon: `${ICONS8}/system-task.png` },
  { keys: ['interface', 'dashboard', 'ui', 'admin'], icon: `${ICONS8}/dashboard-layout.png` },
  { keys: ['api', 'backend', 'server'], icon: `${ICONS8}/server.png` },
  { keys: ['generator', 'tool', 'util'], icon: `${ICONS8}/maintenance.png` },
];

function getProjectIcon(proj) {
  // If user provided a custom logo, use it first
  if (proj.customLogo) return proj.customLogo;

  const lower = proj.name.toLowerCase().replace(/[-_]/g, ' ');
  for (const { keys, icon } of NAME_ICON_MAP) {
    if (keys.some(k => lower.includes(k))) return icon;
  }
  return null;
}

/* Gradient fallback */
const GRAD_COLORS = [
  ['#5b6af0', '#8b5cf6'], ['#06b6d4', '#5b6af0'],
  ['#8b5cf6', '#e879f9'], ['#f59e0b', '#ef4444'],
  ['#10b981', '#06b6d4'], ['#e879f9', '#8b5cf6'],
];
function gradientFallback(index, name) {
  const [c1, c2] = GRAD_COLORS[index % GRAD_COLORS.length];
  const initials = name.split(/[-_ ]/).map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase();
  return { c1, c2, initials };
}

/* ── API helpers ───────────────────────────────────────────── */
async function apiGet(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
}

async function apiPost(path, body) {
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${path} → ${r.status} ${await r.text()}`);
  return r.json();
}

/* ── Tech badges ───────────────────────────────────────────── */
function makeTechBadges(language, topics = []) {
  const tags = [language, ...topics.slice(0, 3)].filter(Boolean);
  return tags.map(t => `<span class="proj-badge">${t}</span>`).join('');
}

/* ──────────────────────────────────────────────────────────────
   FIX 1 continued — Horizontal card render (like screenshot 2)
   Icon is small (40px) on the left, content on the right.
────────────────────────────────────────────────────────────── */
/* ── 2. Update renderCard (Show Less & Logo Fix) ─────────────── */
function renderCard(proj, index, { editable = false } = {}) {
  const isCustomImage = !!proj.customLogo;
  const iconUrl = getProjectIcon(proj); // Now passes the whole object
  const grad = gradientFallback(index, proj.name);

  const iconHtml = iconUrl
    ? `<img src="${iconUrl}" alt="" class="${isCustomImage ? 'proj-card-icon-custom' : 'proj-card-icon'}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div class="proj-card-icon-grad" style="display:none;background:linear-gradient(135deg,${grad.c1},${grad.c2})">
         <span>${grad.initials}</span>
       </div>`
    : `<div class="proj-card-icon-grad" style="background:linear-gradient(135deg,${grad.c1},${grad.c2})">
         <span>${grad.initials}</span>
       </div>`;

  const card = document.createElement('article');
  card.className = 'proj-card';
  card.dataset.name = proj.name;

  // Read More / Show Less Logic
  const descText = proj.description || 'No description.';
  const maxLength = 110;
  let descHtml = `<div class="proj-card-desc-container"><p class="proj-card-desc">${descText}</p></div>`;

  if (descText.length > maxLength) {
    const shortText = descText.substring(0, maxLength) + '...';
    descHtml = `
      <div class="proj-card-desc-container">
        <p class="proj-card-desc desc-short">${shortText}</p>
        <p class="proj-card-desc desc-full" style="display:none;">${descText}</p>
        <button class="read-more-btn">Read more</button>
      </div>
    `;
  }

  const techArray = [...new Set([proj.language, ...(proj.topics || [])].filter(Boolean))];
  const techHtml = techArray.length > 0 ? techArray.join(' • ') : '';

  card.innerHTML = `
    <div class="proj-card-icon-wrap">
      ${iconHtml}
    </div>
    <div class="proj-card-body">
      <div class="proj-card-header">
        <div><h4 class="proj-card-title">${proj.displayName || proj.name}</h4></div>
        <div class="proj-card-links">
          ${proj.html_url ? `
          <a href="${proj.html_url}" target="_blank" rel="noopener noreferrer" class="proj-link">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> GitHub
          </a>` : ''}
          ${proj.homepage ? `
          <a href="${proj.homepage}" target="_blank" rel="noopener noreferrer" class="proj-link proj-link-live">
            <i class="fa-solid fa-globe"></i> Live
          </a>` : ''}
        </div>
      </div>
      <div class="proj-card-tags">${techHtml}</div>
      ${descHtml}
    </div>
    ${editable ? `
    <div class="proj-card-admin-actions">
      <button class="proj-edit-btn" aria-label="Edit ${proj.name}"><i class="fa-solid fa-pen"></i></button>
      <button class="proj-remove-btn" aria-label="Remove ${proj.name}"><i class="fa-solid fa-trash"></i></button>
    </div>` : ''}
  `;

  // Attach Read More / Show Less Toggle
  const readMoreBtn = card.querySelector('.read-more-btn');
  if (readMoreBtn) {
    readMoreBtn.addEventListener('click', (e) => {
      const container = e.target.closest('.proj-card-desc-container');
      const shortP = container.querySelector('.desc-short');
      const fullP = container.querySelector('.desc-full');

      if (shortP.style.display === 'none') {
        shortP.style.display = 'block';
        fullP.style.display = 'none';
        e.target.textContent = 'Read more';
      } else {
        shortP.style.display = 'none';
        fullP.style.display = 'block';
        e.target.textContent = 'Show less';
      }
    });
  }

  return card;
}

/* ── Edit Modal with Unsplash Integration ── */
function openEditModal(proj, onSave, isNew = false) {
  document.getElementById('proj-edit-modal')?.remove();

  // Deduplicate tech stack first
  const rawTech = [proj.language, ...(proj.topics || [])].filter(Boolean);
  const uniqueTech = [];
  const seen = new Set();
  for (const tag of rawTech) {
    if (!seen.has(tag.toLowerCase())) {
      seen.add(tag.toLowerCase());
      uniqueTech.push(tag);
    }
  }

  const overlay = document.createElement('div');
  overlay.id = 'proj-edit-modal';
  overlay.className = 'proj-modal-overlay';
  overlay.innerHTML = `
    <div class="proj-modal glass-panel" role="dialog" aria-modal="true">
      <button class="proj-modal-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <h3 class="proj-modal-title">${isNew ? 'Add Custom Project' : 'Edit Project'}</h3>
      <div class="proj-modal-form">
        <label>Display Name
          <input id="pm-name" type="text" value="${proj.displayName || proj.name}" />
        </label>
        <label>Description
          <textarea id="pm-desc" rows="3">${proj.description || ''}</textarea>
        </label>
        <label>Project Image / Custom Logo URL
          <div style="display: flex; gap: 8px;">
            <input id="pm-logo" type="url" value="${proj.customLogo || ''}" placeholder="Leave blank to use default icon" style="flex: 1;" />
            <button type="button" class="btn btn-outline" id="pm-unsplash-btn" title="Search Unsplash" style="padding: 0 15px;">
              <i class="fa-solid fa-image"></i> Search
            </button>
          </div>
        </label>
        <div id="unsplash-results" style="display: flex; gap: 8px; overflow-x: auto; margin-top: 5px; display: none;"></div>
        
        <label>Tech Stack (comma-separated)
          <input id="pm-tech" type="text" value="${uniqueTech.join(', ')}" />
        </label>
        <label>GitHub URL
          <input id="pm-github" type="url" value="${proj.html_url || ''}" />
        </label>
        <label>Live URL (optional)
          <input id="pm-live" type="url" value="${proj.homepage || ''}" />
        </label>
      </div>
      <div class="proj-modal-footer">
        <button class="btn btn-outline proj-modal-cancel">Cancel</button>
        <button class="btn btn-primary proj-modal-save">
          <i class="fa-solid fa-floppy-disk"></i> Save
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  /* Unsplash Logic */
  const unsplashBtn = overlay.querySelector('#pm-unsplash-btn');
  const unsplashResults = overlay.querySelector('#unsplash-results');
  const logoInput = overlay.querySelector('#pm-logo');
  const nameInput = overlay.querySelector('#pm-name');

  unsplashBtn.onclick = async () => {
    const query = nameInput.value.trim() || proj.name;
    unsplashResults.style.display = 'flex';
    unsplashResults.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching...';
    
    try {
      if (!UNSPLASH_ACCESS_KEY) throw new Error("API key missing.");

      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 429) {
          throw new Error("Rate limit exceeded. Falling back to default Icons.");
        }
        throw new Error("Unsplash fetch failed.");
      }

      const data = await res.json();
      if (!data.results.length) throw new Error("No images found.");

      unsplashResults.innerHTML = data.results.map(img => `
        <img src="${img.urls.small}" data-url="${img.urls.regular}" class="unsplash-thumb" 
             style="height: 60px; border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: border 0.2s;" 
             title="Photo by ${img.user.name}" />
      `).join('');

      // Add click listeners to select an image
      unsplashResults.querySelectorAll('.unsplash-thumb').forEach(imgEl => {
        imgEl.onclick = () => {
          logoInput.value = imgEl.dataset.url;
          unsplashResults.style.display = 'none'; // Hide picker after selection
        };
      });

    } catch (err) {
      unsplashResults.innerHTML = `<span style="color: #ef4444; font-size: 0.85rem;">${err.message}</span>`;
      setTimeout(() => { unsplashResults.style.display = 'none'; }, 4000);
    }
  };

  /* Saving & Closing */
  const close = () => overlay.remove();
  overlay.querySelector('.proj-modal-close').onclick = close;
  overlay.querySelector('.proj-modal-cancel').onclick = close;

  overlay.querySelector('.proj-modal-save').onclick = () => {
    const techRaw = overlay.querySelector('#pm-tech').value;
    const techArr = [];
    const seenSave = new Set();
    
    techRaw.split(',').forEach(s => {
      const tag = s.trim();
      if (tag && !seenSave.has(tag.toLowerCase())) {
        seenSave.add(tag.toLowerCase());
        techArr.push(tag);
      }
    });

    const updated = {
      ...proj,
      displayName: nameInput.value.trim() || proj.displayName || proj.name || 'Custom Project',
      description: overlay.querySelector('#pm-desc').value.trim(),
      customLogo: logoInput.value.trim(),
      language: techArr[0] || '',
      topics: techArr.slice(1),
      html_url: overlay.querySelector('#pm-github').value.trim(),
      homepage: overlay.querySelector('#pm-live').value.trim(),
    };
    onSave(updated);
    close();
  };
}

/* ── Hero project count ────────────────────────────────────── */
function setProjectCount(n) {
  const el = document.querySelector('.hero-stat-projects strong');
  if (el) el.textContent =  n > 1 ? (n-1) + '+' : n ;
}

/* ── Visitor view ──────────────────────────────────────────── */
async function renderVisitorView(container) {
  container.innerHTML = `<div class="projects-loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</div>`;
  try {
    const projects = await apiGet('/api/get-projects');
    container.innerHTML = '';
    if (!projects.length) {
      container.innerHTML = `<div class="projects-empty">
        <i class="fa-brands fa-github"></i><p>Projects coming soon.</p>
      </div>`;
      setProjectCount(0);
      return;
    }
    projects.forEach((p, i) => container.appendChild(renderCard(p, i)));
    setProjectCount(projects.length);
  } catch (e) {
    container.innerHTML = `<div class="projects-empty"><p>Could not load projects.</p></div>`;
    console.error(e);
  }
}

/* ──────────────────────────────────────────────────────────────
   FIX 3 — Admin layout: move projects section full-width
   below the skills-projects-grid so admin panel has space.
────────────────────────────────────────────────────────────── */
function expandProjectsSectionForAdmin() {
  const skProjGrid = document.querySelector('.skills-projects-grid');
  const projSection = document.getElementById('projects');
  if (!skProjGrid || !projSection) return;

  // Move projects section OUT of the grid, insert after the grid
  projSection.classList.remove('reveal-delay-1');
  projSection.classList.add('proj-admin-fullwidth');
  skProjGrid.after(projSection);

  // The skills section now fills the full grid width
  const skillsCard = skProjGrid.querySelector('.skills-card');
  if (skillsCard) skillsCard.style.gridColumn = '1 / -1';
}

/* ── FIX 2 & 4 — Consolidated Live Preview & Admin Controls ── */
async function renderAdminView(section, container) {
  const secret = getSecret();

  /* ── Admin panel shell (Removed redundant selected list, added Delete All) ── */
  const panel = document.createElement('div');
  panel.className = 'admin-panel glass-panel';
  panel.innerHTML = `
    <div class="admin-panel-header">
      <div class="section-label" style="margin-bottom:0">
        <i class="fa-solid fa-screwdriver-wrench"></i> Admin — Manage Projects
      </div>
      <span class="admin-badge">🔒 Admin Mode</span>
    </div>
    <p class="admin-hint">Pick repos → AI generates description → edit if needed → Publish.</p>

    <div class="admin-toolbar">
      <input class="admin-search" type="text" placeholder="Filter repos…" />
      <button class="btn btn-outline admin-add-manual-btn" style="margin-right: auto; margin-left: 10px;">
        <i class="fa-solid fa-plus"></i> Add Custom Project
      </button>
      <button class="btn btn-outline admin-delete-all-btn" style="margin-right: 10px; color: #ef4444; border-color: #ef4444;">
        <i class="fa-solid fa-trash-can"></i> Delete All
      </button>
      <button class="btn btn-primary admin-save-btn" disabled>
        <i class="fa-solid fa-cloud-arrow-up"></i> Publish Changes
      </button>
    </div>

    <div class="admin-repos-wrap">
      <div class="admin-repos-loading"><i class="fa-solid fa-spinner fa-spin"></i> Fetching your GitHub repos…</div>
      <div class="admin-repo-grid" style="display:none" role="list"></div>
    </div>
  `;

  section.querySelector('.section-title').after(panel);

  /* ── State ── */
  let allRepos = [];
  let selectedMap = new Map();

  try {
    const saved = await apiGet('/api/get-projects');
    saved.forEach(p => selectedMap.set(p.name, p));
  } catch { /* nothing saved yet */ }

  const searchEl = panel.querySelector('.admin-search');
  const repoGrid = panel.querySelector('.admin-repo-grid');
  const repoLoading = panel.querySelector('.admin-repos-loading');
  const saveBtn = panel.querySelector('.admin-save-btn');
  const addManualBtn = panel.querySelector('.admin-add-manual-btn');
  const deleteAllBtn = panel.querySelector('.admin-delete-all-btn');

  let dirty = false;
  const markDirty = () => { dirty = true; saveBtn.disabled = false; };

  /* ── Add Custom Project ── */
  addManualBtn.addEventListener('click', () => {
    const newProj = {
      name: `custom-${Date.now()}`,
      displayName: '', description: '', customLogo: '', language: '', topics: [], html_url: '', homepage: '', isManual: true
    };
    openEditModal(newProj, async (updated) => {
      if (!updated.displayName.trim()) updated.displayName = 'Untitled Custom Project';
      selectedMap.set(updated.name, updated);
      markDirty();
      renderPreview();
      await publishToBlob(); 
    }, true);
  });

  /* ── Delete All Projects ── */
  deleteAllBtn.addEventListener('click', async () => {
    if (!confirm("Are you sure you want to delete ALL projects?")) return;
    selectedMap.clear();
    markDirty();
    renderRepoChips(searchEl.value);
    renderPreview();
    await publishToBlob();
  });

  /* ── Fetch & Render Repos ── */
  try {
    allRepos = await apiPost('/api/list-repos', { secret });
    repoLoading.style.display = 'none';
    repoGrid.style.display = 'grid';
  } catch (e) {
    repoLoading.innerHTML = `<span style="color:#ef4444">Failed to load repos: ${e.message}</span>`;
    return;
  }

  function renderRepoChips(filter = '') {
    repoGrid.innerHTML = '';
    const fl = filter.toLowerCase();
    const filtered = fl ? allRepos.filter(r => r.name.toLowerCase().includes(fl)) : allRepos;

    filtered.forEach(r => {
      const isOn = selectedMap.has(r.name);
      const chip = document.createElement('div');
      chip.className = `admin-chip ${isOn ? 'admin-chip--on' : ''}`;
      chip.dataset.repo = r.name;

      const iconUrl = getLangIcon(r.language);
      const iconHtml = iconUrl
        ? `<img src="${iconUrl}" class="admin-chip-icon" alt="" />`
        : `<i class="fa-brands fa-github admin-chip-icon-fa"></i>`;

      chip.innerHTML = `
        ${iconHtml}
        <div class="admin-chip-info">
          <span class="admin-chip-name">${r.name}</span>
          <span class="admin-chip-lang">${r.language || '—'}</span>
        </div>
        <button class="admin-chip-btn" data-repo="${r.name}">
          ${isOn ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-plus"></i>'}
        </button>
      `;
      chip.querySelector('.admin-chip-btn').addEventListener('click', () => toggleRepo(r));
      repoGrid.appendChild(chip);
    });
  }

  async function toggleRepo(r) {
    if (selectedMap.has(r.name)) {
      selectedMap.delete(r.name);
      markDirty();
      renderRepoChips(searchEl.value);
      renderPreview(); 
      await publishToBlob();
      return;
    }
    const chip = repoGrid.querySelector(`[data-repo="${r.name}"]`);
    if (chip) chip.querySelector('button').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    try {
      const proj = await apiPost('/api/fetch-repo', { secret, repoName: r.name });
      selectedMap.set(proj.name, proj);
      markDirty();
    } catch (e) {
      alert('Could not fetch repo: ' + e.message);
    } finally {
      renderRepoChips(searchEl.value);
      renderPreview(); 
    }
  }

  /* ── Unified Drag, Drop & Edit Preview ── */
  function renderPreview() {
    container.innerHTML = '';
    const arr = [...selectedMap.values()];

    if (!arr.length) {
      container.innerHTML = `<div class="projects-empty"><i class="fa-brands fa-github"></i><p>Select repos above to preview.</p></div>`;
      setProjectCount(0);
      return;
    }

    let dragStartIndex = null;

    arr.forEach((p, index) => {
      const card = renderCard(p, index, { editable: true });
      
      // Make entire card draggable
      card.draggable = true;
      card.style.cursor = 'grab';

      card.addEventListener('dragstart', (e) => {
        dragStartIndex = index;
        e.dataTransfer.effectAllowed = 'move';
        card.style.opacity = '0.5';
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        card.style.borderTop = '4px solid var(--accent)';
      });

      card.addEventListener('dragleave', () => {
        card.style.borderTop = '';
      });

      card.addEventListener('drop', async (e) => {
        e.preventDefault();
        card.style.borderTop = '';
        const dragEndIndex = index;

        if (dragStartIndex !== null && dragStartIndex !== dragEndIndex) {
          const entries = [...selectedMap.entries()];
          const [movedItem] = entries.splice(dragStartIndex, 1);
          entries.splice(dragEndIndex, 0, movedItem);

          selectedMap.clear();
          entries.forEach(([k, v]) => selectedMap.set(k, v));
          
          markDirty();
          renderPreview();
          await publishToBlob();
        }
      });

      card.addEventListener('dragend', () => {
        card.style.opacity = '1';
      });

      // Actions
      card.querySelector('.proj-edit-btn')?.addEventListener('click', () => {
        openEditModal(p, async (updated) => {
          selectedMap.set(p.name, updated);
          markDirty();
          renderPreview();
          await publishToBlob();
        });
      });

      card.querySelector('.proj-remove-btn')?.addEventListener('click', async () => {
        selectedMap.delete(p.name);
        markDirty();
        renderRepoChips(searchEl.value);
        renderPreview();
        await publishToBlob();
      });

      container.appendChild(card);
    });

    setProjectCount(arr.length);
  }

  /* ── Publish Helper ── */
  async function publishToBlob() {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing…';
    try {
      await apiPost('/api/save-projects', { secret, projects: [...selectedMap.values()] });
      dirty = false;
      saveBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Published!';
      setTimeout(() => {
        saveBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Publish Changes';
        saveBtn.disabled = dirty ? false : true;
      }, 3000);
    } catch (e) {
      alert('Publish failed: ' + e.message);
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Publish Changes';
    }
  }

  saveBtn.addEventListener('click', publishToBlob);
  searchEl.addEventListener('input', () => renderRepoChips(searchEl.value));

  renderRepoChips();
  renderPreview();
}


/* ── Bootstrap ─────────────────────────────────────────────── */
export async function initProjects() {
  const section = document.getElementById('projects');
  if (!section) return;

  /* FIX 3 — expand layout before rendering when admin */
  if (isAdmin()) expandProjectsSectionForAdmin();

  let container = section.querySelector('.projects-list');
  if (!container) {
    container = document.createElement('div');
    container.className = 'projects-list proj-cards-grid';
    container.setAttribute('role', 'list');
    section.appendChild(container);
  } else {
    container.innerHTML = '';
    container.classList.add('proj-cards-grid');
  }

  if (isAdmin()) {
    await renderAdminView(section, container);
  } else {
    await renderVisitorView(container);
  }
}