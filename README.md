# Shray Gupta — Portfolio Website (Refactored)

A fully modernized, responsive portfolio website rebuilt from a monolithic structure into a clean, maintainable, and scalable codebase.

---

## 📁 Project Structure

```
portfolio/
│
├── index.html              ← Single-page entry point (semantic HTML5)
│
├── css/
│   └── custom.css          ← Full design system: variables, dark mode, all sections
│
├── js/
│   ├── main.js             ← Entry point: orchestrates all features (ES Module)
│   ├── darkmode.js         ← Dark/light theme toggle with localStorage persistence
│   └── animations.js       ← Scroll-reveal, skill bar, and scroll-to-top logic
│
├── assets/
│   ├── images/             ← Profile photo, project thumbnails, cert images, video
│   └── icons/              ← Skill SVG icons (Java, Python, React, etc.)
│
└── README.md               ← This file
```

---

## ✅ Features Implemented

### 1. Full Responsive Design (Mobile-First)
- Fluid typography using `clamp()` — scales from 320px to 2560px+
- CSS Grid / Flexbox layouts that gracefully adapt at every breakpoint
- Breakpoints: 480px (mobile) · 768px (tablet) · 1024px (laptop) · 1440px+ (ultra-wide)
- No overflow issues, no fixed widths, no pixel-based layout breakage
- Touch-friendly tap targets and navigation

### 2. Clean Project Structure
- HTML, CSS, and JS fully separated into logical files
- JavaScript split into three focused ES modules:
  - `main.js` — feature orchestration, form handling, Swiper, Typed.js
  - `darkmode.js` — theme management only
  - `animations.js` — IntersectionObserver-based animations only
- Consistent BEM-inspired class naming (`navbar`, `hero-section`, `skill-bar-fill`, etc.)
- No inline styles except where strictly necessary (e.g., dynamic JS widths)

### 3. Dark Mode
- Toggle button in the navbar (sun/moon icon)
- CSS variables drive all color changes — zero hard-coded colours in components
- Smooth `transition` on all color-bearing properties (300ms ease)
- Preference persisted in `localStorage` under key `portfolio-theme`
- On first visit, auto-detects OS preference via `prefers-color-scheme`
- Critical inline script prevents flash-of-unstyled-content (FOUC)
- WCAG AA contrast ratios in both light and dark modes

### 4. UI / UX Improvements
- **Typography**: Syne (display/headings) + DM Sans (body) — distinctive, modern pair
- **Color system**: indigo-violet-cyan gradient accent on a clean glass-morphism surface
- **Glass panels**: backdrop-filter blur with adaptive opacity for depth
- **Animated hero image**: morphing border-radius shape animation (`morph` keyframes)
- **Skill bars**: animated on scroll via IntersectionObserver (no layout shift)
- **Project cards**: hover lift + border highlight with smooth transition
- **Certificate overlays**: gradient reveal on hover with "View Credential" CTA
- **Scroll-to-top**: fixed button, fades in after 300px, animated on click
- **Mobile nav**: full-screen overlay drawer with smooth open/close
- **Contact form**: real-time validation, loading state, success/error feedback

### 5. Accessibility
- Semantic HTML5 landmarks: `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`, `<address>`
- All images have descriptive `alt` attributes
- ARIA roles/labels on nav, dialog, lists, and alerts
- `aria-live` region for form feedback
- `aria-expanded` on hamburger button
- Focus-visible styles preserved

---

## 🚀 Setup & Usage

1. **Copy your asset files** into `assets/images/` and `assets/icons/`
   - Profile photo → `assets/images/profile.png`
   - Project images → `assets/images/notes.svg`, `food.png`, etc.
   - Certificates → `assets/images/internship.png`, `training.png`, `project.png`
   - Achievement certs → `assets/images/quizfest.png`, `madcad.png`, etc.
   - Achievement video → `assets/images/achievement.mp4`
   - Skill icons → `assets/icons/icons8-java.svg`, `icons8-python.svg`, etc.

2. **Serve locally** (needed for ES modules):
   ```bash
   # Python
   python -m http.server 3000
   # Node
   npx serve .
   # VS Code
   Live Server extension
   ```

3. **Open** `http://localhost:3000` in your browser.

---

## 📱 Responsive Testing Summary

| Breakpoint     | Layout                                | Status |
|---------------|---------------------------------------|--------|
| 320px (mobile) | Single column, stacked nav           | ✅ Pass |
| 480px          | Single column, compact spacing       | ✅ Pass |
| 640px          | Single column, larger imagery        | ✅ Pass |
| 768px (tablet) | 2-col skills/projects grid appears   | ✅ Pass |
| 1024px (laptop)| Full two-column layouts active       | ✅ Pass |
| 1280px         | Max-width container, balanced whitespace | ✅ Pass |
| 1440px+        | Padding expands, fluid typography    | ✅ Pass |

---

## 🔑 External Dependencies (CDN)

| Library        | Version | Purpose                    |
|---------------|---------|----------------------------|
| Font Awesome  | 6.6.0   | Icons                      |
| Swiper        | 11      | Certificate carousel       |
| Typed.js      | 2.0.10  | Typing animation           |
| EmailJS       | 4       | Email delivery from form   |
| Firebase SDK  | 10.7.2  | Contact form data storage  |
| Google Fonts  | —       | Syne + DM Sans typography  |

---

## 🛠️ Customization

- **Colors**: Update `--accent`, `--accent-2`, `--gradient-hero` in `:root` in `css/custom.css`
- **Dark mode colours**: Update the `.dark {}` block in `css/custom.css`
- **Content**: All section content lives in `index.html` — search by `id` or section comment
- **New sections**: Add HTML in `index.html`, style in `css/custom.css`, JS logic in `js/main.js`
- **Firebase / EmailJS**: Replace config values in `js/main.js`
