# 🏥 MediNexus Project Documentation (`project.md`)

## 1. Project Overview & Identity
- **Repository**: [ANDY0802X/MediNexus-Hospital-LifeCare](https://github.com/ANDY0802X/MediNexus-Hospital-LifeCare)
- **Author / Owner**: AAYUSH KUMAWAT (`ANDY0802X`)
- **Project Purpose**: Modern healthcare and hospital web experience combining clinical information (specialist doctors, 24/7 hours, emergency hotline) with an interactive, scroll-synchronized dual-physician visual stage.

---

## 2. Inviolable Architectural Rules & Constraints
*(Derived directly from user directives and conversation history)*

### Rule 1: Zero Architecture Mutation (Strict DOM Preservation)
- **Never alter the HTML structure, tag hierarchy, IDs, classes, or inline text** in `index.html`.
- The following markup structure is **sacrosanct**:
  - Header: `<header class="pannel clay-card">` with `<div class="logo clay-card">`, `<section class="bank_name"><p>NAME</p></section>`, and `<section class="dashbord"><a href=""> About</a> | <a href="">Services</a>| <a href="">Doctors</a> | <a href="">Contact</a></section>`.
  - Main scroll stage: `<div class="scroll-stage" id="scrollStage">`.
  - Sticky hero container: `<div class="container clay-card" id="heroPin">`.
  - Content sections: `<section class="content_div about-section">`, `<div class="connected-containers">`, `<div class="connected-container">` (open hours & emergency).
  - Doctor showcase: `<section class="content_div doctor-showcase services-section">` with its chat bubbles (`hello`, `world`, `i am`, `aayush`), the `.pill`, and the male doctor `<img src="assets/img/doc_full.png" id="maleDoctor">`.
  - Doctor directory: `<section class="content_div doctors-section">` with 4 `.doctor_card` items.
  - Interactive canvas: `<canvas id="docCanvas" class="doc-canvas">`.
- **Do not rename classes, replace tags with semantic HTML5 elements, or rewrite content** unless the user explicitly and directly commands an architectural redesign.

### Rule 2: Female Doctor Scroll Canvas Engine Must NEVER Be Altered or Disabled
- The animated female doctor rendered on `<canvas id="docCanvas">` via `js/home.js` plays a 40-frame sequence (`assets/img/frames_mine/frame-1.png` to `frame-40.png`) driven by the scroll position of `#scrollStage`.
- **Strict Prohibition**:
  - **Never hide the canvas** (`display: none` or `visibility: hidden`) in media queries (e.g., mobile or tablet widths).
  - **Never remove the scroll distance pseudo-element** (`.scroll-stage::after { height: 400vh; }`), which provides the travel distance for the scroll animation.
  - **Never cancel or bypass the canvas rendering engine** in `js/home.js`.

### Rule 3: Permitted Scope of Changes
- Any changes requested regarding **"colors"** or **"cross-browser compatibility"** must be achieved **purely through CSS color values, surface tints, borders, shadows, and text colors** without breaking the layout engine, heights, or sticky positioning.

---

## 3. Technology Stack & Key Assets
- **Markup**: Pure HTML5 (vanilla, zero framework dependencies).
- **Styling**: Vanilla CSS3 (`css/style.css` and `css/home.css`) utilizing Claymorphism effects (`.clay-card`), custom scrollbars, and fluid clamps.
- **Scripting**: Pure Vanilla JavaScript (`js/home.js`):
  - Canvas 2D frame drawing synchronized to `#scrollStage.scrollTop`.
  - Dynamic aspect-ratio and travel calculation.
  - Interactive mousemove 3D tilt effect on the male doctor (`--male-tilt`).
- **Asset Structure**:
  - `assets/img/doc_half.png` — Doctor avatar in header logo.
  - `assets/img/doc_full.png` — Male physician illustration in showcase pill.
  - `assets/img/docs/` — Doctor profile pictures (`sample_doc01.png` to `sample_doc_04.png`).
  - `assets/img/frames_mine/` — 40 sequential PNG animation frames (`frame-1.png` through `frame-40.png`).

---

## 4. Work History Summary
1. **Repository Verification**: Confirmed repository is hosted under `ANDY0802X/MediNexus-Hospital-LifeCare` and in sync with origin `main`.
2. **Initial Responsive & Color Refactor**: Explored comprehensive responsive redesign (HTML restructuring, mobile menu, design tokens).
3. **User Re-alignment & Rollback**: Identified that user demands strict architectural fidelity and zero changes to the female doctor canvas scroll. Restored code completely to its working Git baseline.
