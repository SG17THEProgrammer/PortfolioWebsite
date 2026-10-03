/**
 * projects.js  —  Dynamic GitHub projects for Shray Gupta Portfolio
 *
 * Visitor flow:  GET /api/get-projects  →  render cards
 * Admin flow:    ?admin=<secret>  →  list repos  →  pick  →  AI description
 *                →  optional manual edit  →  save to Netlify Blobs
 *
 * Logos:  Devicons CDN (no background, pure SVG/PNG) keyed by language/topic
 */

/* ── Admin secret lives ONLY in the URL param — never stored ── */
const getSecret = () => new URLSearchParams(window.location.search).get('admin');
const isAdmin   = () => Boolean(getSecret());

/* ── Devicons map: language / topic → icon URL ─────────────── */
const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const LANG_ICON = {
  javascript:  `${DEVICON_BASE}/javascript/javascript-original.svg`,
  typescript:  `${DEVICON_BASE}/typescript/typescript-original.svg`,
  python:      `${DEVICON_BASE}/python/python-original.svg`,
  java:        `${DEVICON_BASE}/java/java-original.svg`,
  html:        `${DEVICON_BASE}/html5/html5-original.svg`,
  css:         `${DEVICON_BASE}/css3/css3-original.svg`,
  react:       `${DEVICON_BASE}/react/react-original.svg`,
  nextjs:      `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  nodejs:      `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  express:     `${DEVICON_BASE}/express/express-original.svg`,
  mongodb:     `${DEVICON_BASE}/mongodb/mongodb-original.svg`,
  mysql:       `${DEVICON_BASE}/mysql/mysql-original.svg`,
  flask:       `${DEVICON_BASE}/flask/flask-original.svg`,
  redis:       `${DEVICON_BASE}/redis/redis-original.svg`,
  firebase:    `${DEVICON_BASE}/firebase/firebase-plain.svg`,
  'c++':       `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
  c:           `${DEVICON_BASE}/c/c-original.svg`,
  php:         `${DEVICON_BASE}/php/php-original.svg`,
  ruby:        `${DEVICON_BASE}/ruby/ruby-original.svg`,
  swift:       `${DEVICON_BASE}/swift/swift-original.svg`,
  kotlin:      `${DEVICON_BASE}/kotlin/kotlin-original.svg`,
  dart:        `${DEVICON_BASE}/dart/dart-original.svg`,
  go:          `${DEVICON_BASE}/go/go-original.svg`,
  rust:        `${DEVICON_BASE}/rust/rust-plain.svg`,
  shell:       `${DEVICON_BASE}/bash/bash-original.svg`,
};

function getLangIcon(language, topics = []) {
  const key = (language || '').toLowerCase();
  if (LANG_ICON[key]) return LANG_ICON[key];
  // Try topics
  for (const t of topics) {
    const tk = t.toLowerCase();
    if (LANG_ICON[tk]) return LANG_ICON[tk];
  }
  return null;
}

/* Gradient background tiles when no icon found */
const GRAD_COLORS = [
  ['#5b6af0','#8b5cf6'], ['#06b6d4','#5b6af0'],
  ['#8b5cf6','#e879f9'], ['#f59e0b','#ef4444'],
  ['#10b981','#06b6d4'], ['#e879f9','#8b5cf6'],
];
function gradientThumb(index, name) {
  const [c1, c2] = GRAD_COLORS[index % GRAD_COLORS.length];
  const initials = name.split(/[-_ ]/).map(w => w[0] ?? '').join('').slice(0,2).toUpperCase();
  return { type: 'gradient', c1, c2, initials };
}

/* ── API helpers ───────────────────────────────────────────── */
async function apiGet(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
}

async function apiPost(path, body) {
  const r = await fetch(path, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${path} → ${r.status} ${await r.text()}`);
  return r.json();
}

/* ── Render helpers ────────────────────────────────────────── */
function makeTechBadges(language, topics) {
  const tags = [language, ...topics.slice(0, 3)].filter(Boolean);
  return tags.map(t =>
    `<span class="proj-badge">${t}</span>`
  ).join('');
}

function renderCard(proj, index, { editable = false } = {}) {
  const iconUrl = getLangIcon(proj.language, proj.topics);
  const grad    = gradientThumb(index, proj.name);

  const thumbHtml = iconUrl
    ? `<div class="proj-card-thumb-wrap">
         <img src="${iconUrl}" alt="${proj.language}" class="proj-card-icon" loading="lazy"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
         <div class="proj-card-grad" style="display:none;background:linear-gradient(135deg,${grad.c1},${grad.c2})">
           <span>${grad.initials}</span>
         </div>
       </div>`
    : `<div class="proj-card-thumb-wrap">
         <div class="proj-card-grad" style="background:linear-gradient(135deg,${grad.c1},${grad.c2})">
           <span>${grad.initials}</span>
         </div>
       </div>`;

  const card = document.createElement('article');
  card.className = 'proj-card';
  card.dataset.name = proj.name;

  card.innerHTML = `
    ${thumbHtml}
    <div class="proj-card-body">
      <h4 class="proj-card-title">${proj.displayName || proj.name}</h4>
      <p class="proj-card-desc">${proj.description || 'No description.'}</p>
      <div class="proj-card-tags">${makeTechBadges(proj.language, proj.topics || [])}</div>
      <div class="proj-card-links">
        <a href="${proj.html_url}" target="_blank" rel="noopener noreferrer" class="proj-link">
          <i class="fa-brands fa-github"></i> GitHub
        </a>
        ${proj.homepage ? `<a href="${proj.homepage}" target="_blank" rel="noopener noreferrer" class="proj-link proj-link-live">
          <i class="fa-solid fa-globe"></i> Live
        </a>` : ''}
      </div>
    </div>
    ${editable ? `
    <div class="proj-card-admin-actions">
      <button class="proj-edit-btn" aria-label="Edit ${proj.name}">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button class="proj-remove-btn" aria-label="Remove ${proj.name}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>` : ''}
  `;

  return card;
}

/* ── Edit Modal ────────────────────────────────────────────── */
function openEditModal(proj, onSave) {
  // Remove any existing modal
  document.getElementById('proj-edit-modal')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'proj-edit-modal';
  overlay.className = 'proj-modal-overlay';
  overlay.innerHTML = `
    <div class="proj-modal glass-panel" role="dialog" aria-label="Edit project" aria-modal="true">
      <button class="proj-modal-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <h3 class="proj-modal-title">Edit Project</h3>

      <div class="proj-modal-form">
        <label>Display Name
          <input id="pm-name" type="text" value="${proj.displayName || proj.name}" />
        </label>
        <label>Description (AI-generated, editable)
          <textarea id="pm-desc" rows="3">${proj.description || ''}</textarea>
        </label>
        <label>Tech Stack (comma-separated, shown as badges)
          <input id="pm-tech" type="text" value="${[proj.language, ...(proj.topics||[])].filter(Boolean).join(', ')}" />
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
  overlay.querySelector('#pm-name').focus();

  const close = () => overlay.remove();
  overlay.querySelector('.proj-modal-close').onclick  = close;
  overlay.querySelector('.proj-modal-cancel').onclick = close;
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  overlay.querySelector('.proj-modal-save').onclick = () => {
    const techRaw = overlay.querySelector('#pm-tech').value;
    const techArr = techRaw.split(',').map(s => s.trim()).filter(Boolean);

    const updated = {
      ...proj,
      displayName:  overlay.querySelector('#pm-name').value.trim()   || proj.name,
      description:  overlay.querySelector('#pm-desc').value.trim(),
      language:     techArr[0] || proj.language,
      topics:       techArr.slice(1),
      html_url:     overlay.querySelector('#pm-github').value.trim() || proj.html_url,
      homepage:     overlay.querySelector('#pm-live').value.trim(),
    };
    onSave(updated);
    close();
  };
}

/* ── Project count in hero ─────────────────────────────────── */
function setProjectCount(n) {
  const el = document.querySelector('.hero-stat-projects strong');
  if (el) el.textContent = (n-1) + '+';
}

/* ── Visitor render ────────────────────────────────────────── */
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

/* ── Admin render ──────────────────────────────────────────── */
async function renderAdminView(section, container) {
  const secret = getSecret();

  // ── Admin panel shell ──
  const panel = document.createElement('div');
  panel.className = 'admin-panel glass-panel';
  panel.innerHTML = `
    <div class="admin-panel-header">
      <div class="section-label" style="margin-bottom:0">
        <i class="fa-solid fa-screwdriver-wrench"></i> Admin — Manage Projects
      </div>
      <span class="admin-badge">🔒 Admin Mode</span>
    </div>
    <p class="admin-hint">Pick repos from GitHub, generate AI descriptions, then publish. Changes go live for all visitors instantly.</p>

    <div class="admin-toolbar">
      <input class="admin-search" type="text" placeholder="Filter repos…" />
      <button class="btn btn-primary admin-save-btn" disabled>
        <i class="fa-solid fa-cloud-arrow-up"></i> Publish Changes
      </button>
    </div>

    <div class="admin-repos-wrap">
      <div class="admin-repos-loading"><i class="fa-solid fa-spinner fa-spin"></i> Fetching your GitHub repos…</div>
      <div class="admin-repo-grid" style="display:none" role="list"></div>
    </div>

    <div class="admin-selected-wrap" style="display:none; margin-top:10px">
      <h4 class="admin-section-label">Selected Projects (drag to reorder)</h4>
      <div class="admin-selected-list" role="list"></div>
    </div>
  `;

  section.querySelector('.section-title').after(panel);

  // ── State ──
  let allRepos    = [];
  let selectedMap = new Map(); // name → project object

  // Load already-saved projects first
  try {
    const saved = await apiGet('/api/get-projects');
    saved.forEach(p => selectedMap.set(p.name, p));
  } catch { /* nothing saved yet */ }

  const searchEl    = panel.querySelector('.admin-search');
  const repoGrid    = panel.querySelector('.admin-repo-grid');
  const repoLoading = panel.querySelector('.admin-repos-loading');
  const selectedWrap = panel.querySelector('.admin-selected-wrap');
  const selectedList = panel.querySelector('.admin-selected-list');
  const saveBtn     = panel.querySelector('.admin-save-btn');

  let dirty = false;
  const markDirty = () => { dirty = true; saveBtn.disabled = false; };

  // ── Fetch all repos ──
  try {
    allRepos = await apiPost('/api/list-repos', { secret });
    repoLoading.style.display = 'none';
    repoGrid.style.display    = 'grid';
  } catch (e) {
    repoLoading.innerHTML = `<span style="color:#ef4444">Failed to load repos: ${e.message}</span>`;
    return;
  }

  // ── Render repo chips ──
  function renderRepoChips(filter = '') {
    repoGrid.innerHTML = '';
    const fl = filter.toLowerCase();
    const filtered = fl ? allRepos.filter(r => r.name.toLowerCase().includes(fl)) : allRepos;

    filtered.forEach(r => {
      const isOn = selectedMap.has(r.name);
      const chip = document.createElement('div');
      chip.className = `admin-chip ${isOn ? 'admin-chip--on' : ''}`;
      chip.dataset.repo = r.name;

      const iconUrl = getLangIcon(r.language, r.topics);
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
          ${isOn
            ? '<i class="fa-solid fa-circle-check"></i>'
            : '<i class="fa-solid fa-circle-plus"></i>'}
        </button>
      `;

      chip.querySelector('.admin-chip-btn').addEventListener('click', () => toggleRepo(r));
      repoGrid.appendChild(chip);
    });
  }

  // ── Toggle repo on/off ──
  async function toggleRepo(r) {
    if (selectedMap.has(r.name)) {
      selectedMap.delete(r.name);
      markDirty();
      renderRepoChips(searchEl.value);
      renderSelectedList();
      renderPreview();
      return;
    }

    // Add: fetch full data + AI description
    const chip = repoGrid.querySelector(`[data-repo="${r.name}"]`);
    if (chip) {
      chip.classList.add('admin-chip--loading');
      chip.querySelector('button').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    }

    try {
      const proj = await apiPost('/api/fetch-repo', { secret, repoName: r.name });
      selectedMap.set(proj.name, proj);
      markDirty();
    } catch (e) {
      alert('Could not fetch repo: ' + e.message);
    } finally {
      renderRepoChips(searchEl.value);
      renderSelectedList();
      renderPreview();
    }
  }

  // ── Selected list (editable) ──
  function renderSelectedList() {
    const arr = [...selectedMap.values()];
    if (!arr.length) {
      selectedWrap.style.display = 'none';
      return;
    }
    selectedWrap.style.display = 'block';
    selectedList.innerHTML = '';

    arr.forEach((proj, i) => {
      const row = document.createElement('div');
      row.className = 'admin-sel-row';
      row.dataset.name = proj.name;

      const iconUrl = getLangIcon(proj.language, proj.topics);
      const iconHtml = iconUrl
        ? `<img src="${iconUrl}" class="admin-sel-icon" alt="" />`
        : `<i class="fa-brands fa-github" style="font-size:1.4rem;color:var(--accent)"></i>`;

      row.innerHTML = `
        ${iconHtml}
        <div class="admin-sel-info">
          <strong>${proj.displayName || proj.name}</strong>
          <span>${proj.description?.slice(0, 80) || ''}…</span>
        </div>
        <div class="admin-sel-actions">
          <button class="admin-sel-edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-sel-remove" title="Remove"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;

      row.querySelector('.admin-sel-edit').onclick = () => {
        openEditModal(proj, updated => {
          selectedMap.set(proj.name, updated);
          markDirty();
          renderSelectedList();
          renderPreview();
        });
      };

      row.querySelector('.admin-sel-remove').onclick = () => {
        selectedMap.delete(proj.name);
        markDirty();
        renderRepoChips(searchEl.value);
        renderSelectedList();
        renderPreview();
      };

      selectedList.appendChild(row);
    });
  }

  // ── Live preview below the panel ──
  function renderPreview() {
    container.innerHTML = '';
    const arr = [...selectedMap.values()];

    if (!arr.length) {
      container.innerHTML = `<div class="projects-empty">
        <i class="fa-brands fa-github"></i><p>Select repos above to preview.</p>
      </div>`;
      setProjectCount(0);
      return;
    }

    arr.forEach((p, i) => {
      const card = renderCard(p, i, { editable: true });

      card.querySelector('.proj-edit-btn')?.addEventListener('click', () => {
        openEditModal(p, updated => {
          selectedMap.set(p.name, updated);
          markDirty();
          renderSelectedList();
          renderPreview();
        });
      });

      card.querySelector('.proj-remove-btn')?.addEventListener('click', () => {
        selectedMap.delete(p.name);
        markDirty();
        renderRepoChips(searchEl.value);
        renderSelectedList();
        renderPreview();
      });

      container.appendChild(card);
    });

    setProjectCount(arr.length);
  }

  // ── Publish ──
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing…';
    try {
      await apiPost('/api/save-projects', {
        secret,
        projects: [...selectedMap.values()],
      });
      dirty = false;
      saveBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Published!';
      setTimeout(() => {
        saveBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Publish Changes';
      }, 3000);
    } catch (e) {
      alert('Publish failed: ' + e.message);
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Publish Changes';
    }
  });

  // ── Search ──
  searchEl.addEventListener('input', () => renderRepoChips(searchEl.value));

  // ── Initial render ──
  renderRepoChips();
  renderSelectedList();
  renderPreview();
}

/* ── Bootstrap ─────────────────────────────────────────────── */
export async function initProjects() {
  const section = document.getElementById('projects');
  if (!section) return;

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