# Wendy portfolio — reverse-engineering notes

Reference: https://wendyenyi.vercel.app/
Inspected: 2026-11-07. Public HTML/CSS/JavaScript downloaded for inspection; browser interactions checked separately. These files are reference material, not changes to the React application.

## Evidence and scope

- Browser-checked: homepage rendering; badge flip control; About/Work anchors; case-study filtering; KEO Wallet opening, step navigation and return; colour picker and Forest recolouring; game open/close; Shape process selection; footer; About page accordion; Hire page.
- Source-checked: exact easing, durations, physics, scroll input interception, breakpoints, reduced motion, loader sequence, video lifecycle, other case-study data, About/Hire behaviour.
- Not claimed: frame-by-frame visual fidelity, testing on physical mobile devices, completing the game, sending a contact form, visiting external project/CV/social destinations, or testing every case-study asset. Source describes intended behaviour; it does not prove every remote asset loads.
- The source contains dormant templates and older rendering paths. Do not reproduce them as live UI merely because they appear in HTML.

## Architecture

Three static documents: home.html (downloaded homepage), about.html, hire.html. Homepage content is driven by an inline PORTFOLIO configuration object. No React, GSAP or Lenis is used in the inspected page. The animation stack is CSS transitions/keyframes, Web Animations API, requestAnimationFrame, IntersectionObserver, ResizeObserver and Three.js 0.170.0 loaded with an import map. RoomEnvironment supplies environment lighting.

The homepage order is loader → full-screen hero → About → selected projects → game invitation → tools marquee → sticky process → revealing contact footer. A fixed theme picker remains available on the homepage. The navigation is initially hidden.

## Visual system

- Display: Anton, uppercase, condensed oversized headings. Body: Plus Jakarta Sans (400–700). Signature: Dancing Script. Unbounded is also requested by the font stylesheet.
- Gutters: clamp(24px, 6vw, 96px).
- Main ease-out: cubic-bezier(.23,1,.32,1).
- Main ease-in-out: cubic-bezier(.77,0,.175,1).
- Theme transition on sections/navigation/buttons: background, foreground and borders, 500ms ease.
- Plum: background #3b0450, foreground #fdeeff, accent #e12fe9.
- Forest: #04301f / #ecfbe6 / #3fe07c.
- Midnight: #07154f / #eaf0ff / #5b93ff.
- Ember: #4a0c06 / #fff1e6 / #ff6a2b.
- Light sections invert the background/foreground relationship. Accent remains the saturated highlight. Derived colours use color-mix.

## Motion inventory

### 1. Intro loader (home.html:353–399, 1286–1350)

A miniature design-tool artboard becomes the actual hero. A dotted canvas appears, a fake cursor drags a selection frame with changing dimensions, the name is typed, alignment guides appear, the role and badge placeholder resolve, and the board expands to viewport size. Loader and hero share calculated positions to avoid a visible jump.

Sequence: 200ms initial pause; grid 250ms; cursor positioning 600ms; frame drawing 850ms; font/layout readiness; typing/alignment; rest state 750ms; live board state 820ms; intro promise resolves; 120ms handoff; overlay opacity fades 450ms and is removed later. Board clip-path uses 750ms and its scale uses 900ms. Exact typing delays remain in the source.

First visit and refresh replay it. Returning within the session, a deep section link or reduced-motion preference skips it. Font readiness is bounded by timeouts, with a layout fallback if WebGL never starts.

### 2. Hero badge (home.html:1653–2172)

Hybrid WebGL + DOM, not just a CSS-rotated card. The current path sets DOM_CARD=true: HTML draws the badge for sharp text; Three.js computes the pose and renders the scene/strap/type. An older mesh-card texture path is also present.

- Oversized name above the suspended badge, role below it; mobile name and role wrap differently.
- Badge design width 320; height 1.41 times width; scales to available name/role gap.
- Paper insert with portrait, identity, availability, signature and barcode. Reverse has four expertise rows.
- Glass holder, printed lanyard, soft shadow, foil/sheen decoration.
- Rope with gravity, extension and damping; slack when lifted. A second spring follows the strap midpoint; a pendulum controls card swing; another spring controls half-turn flips.
- Fixed simulation timestep 1/120s; gravity 6000; rope stiffness 1400. Drop spring stiffness 60 and damping 12.4. Normal flip stiffness 74/damping 13.
- After intro resolution: drop starts after 350ms with sideways velocity 150. First programmed flip after 2900ms. Automatic half-turn every 3600ms while visible and not dragging.
- Click/tap or accessible button flips; drag grabs and throws; movement above 6px distinguishes drag; a short unmoved release under 400ms is a click.
- Pointer hover tilt is bounded to about .26rad horizontal and .16rad vertical. Pointer parallax on typography is eased.
- Scrolling adds bounded sideways velocity; hero text shifts by scroll distance × .25 and fades to 10% across the first viewport.
- Letter-line shader reveal: 900ms ease-out quartic, initial 150ms offset, 110ms stagger per line when applicable. After the loader sequence, the type is already revealed for handoff.
- GPU pixel ratio capped at 2. Rendering pauses when offscreen or document hidden; resizes are observed.
- Touch scrolling is prevented only when a touch begins on the badge. Other touches remain page gestures.

### 3. Opening section scroll (home.html:3123–3188)

Custom section glide only for hero ↔ About ↔ top of Work. It intercepts wheel, touch and selected keyboard inputs near section boundaries. It is not global inertial smooth scrolling.

Targets: 0, About.offsetTop, Work.offsetTop. Long sections scroll normally until their end is reachable; About allows the CTA to be reached. Beyond the start of Work, normal page scrolling resumes.

Glide duration = min(950, 450 + distance × .6) milliseconds; cubic ease-in-out; 450ms momentum lock after completion. Very small wheel deltas and Ctrl+wheel are ignored. Dialogs suspend homepage snapping; focused form fields/links/buttons are excluded from keyboard interception. Touch movement threshold is 6px. Reduced motion uses a nearly immediate glide.

### 4. Navigation (home.html:320–349, 2625–2632, 2742–2750)

Floating translucent pill header with wordmark and About, Work, Hire me, View CV. Hidden until scroll reaches 70% of hero height. Entrance: 500ms transform / 300ms opacity; hiding: 250ms / 200ms. Mobile burger at 640px; panel opacity opens in 180ms and closes in 120ms. Outside click, Escape, links and scroll close the mobile menu.

### 5. About section (home.html:500–541, 2656–2700, 2812–2868)

Split portrait/bio layout, short headline, facts and social links. Headings are split into individually clipped words: translateY(108%) → 0 over 900ms, 60ms word stagger. Generic reveals move upward 28px; opacity 800ms and transform 1000ms. Intersection trigger: 18% visibility and bottom margin -6%; reveal runs once.

Desktop bio (861px+): whole block fades/slides from 16px over 700ms when approaching view. Narrow screens: scroll progress inks individual words from .25 to 1 opacity. Portrait also has a WebGL path; retain actual image and fallback behaviour rather than relying exclusively on a canvas.

Magnetic controls, fine pointer only: translation uses 22% horizontal and 32% vertical pointer displacement from button centre. Return on pointer leave. Social circles invert on hover.

### 6. Projects (home.html:659–715, 2363–2393)

All / Case studies / Exploration tabs. A sliding selection pill transitions width and X in 450ms. Filtering hides nonmatching tiles and replays their entry reveal; stagger is 80ms per tile modulo 3. This is not a GSAP FLIP layout transition.

Tile reveal: opacity 700ms; upward translation from 40px over 900ms. Entry observer begins 15% before the viewport bottom. Three columns normally, two at 900px and below, one at 560px and below. Tiles contain real screenshots/video, category chip, title and type. Hover effects include video zoom, rising View affordance, and a 72px frosted View bubble following the pointer via an eased animation loop. The bubble is absent for touch and reduced motion.

Video preload starts when Work is within two viewports, or 2500ms after intro resolution. Play/pause follows proximity with 30% observer margin. Hidden/offscreen video lifecycle is managed. Some tile assets have continuous pan/drift/feed/float keyframes.

Projects in source: Backline, KEO Wallet, Orvo, Seats, Zukky, Employee Dashboard. The dashboard exploration opens the video viewer, not the case-study sheet.

### 7. Case-study sheet (home.html:736–990, 2396–2623)

Full-screen native dialog with its own scroll container, sticky top bar, back button, counter and reading progress. Shared deep links use #project/<slug> and browser history; returning closes the sheet. Parent page scroll stays put.

Opening curtain: project name fades/rises from 30px and scaleY(.6), 280ms with 150ms delay. Full-screen curtain sweeps upward from below in 380ms ease-in-out. Content is populated under cover, followed by 70ms pause. Curtain exits upward in 420ms. Overview cascades upward 18px over 500ms, stagger 50ms. Closing reverses the curtain direction. A moving lock prevents competing transitions. Escape uses the closing animation too.

Desktop 861px+: left narrative steps, sticky right matching visual. Each step is approximately viewport height minus header. Mandatory Y scroll snapping lands below the bar. Nearest step controls active text opacity (.2 → 1), dot navigation and matching image/video layer. Visual crossfade uses opacity 350ms, scale .97 → 1 over 500ms, blur 6px → 0 over 350ms. Arrow keys and dots jump between steps; progress follows dialog scroll.

Mobile: steps stack with their own visuals, replacing the sticky split stage. Screen strips use marquee-like motion where supplied. Tall screenshots can pan object-position on hover over 6s. Videos pause when inactive; sound controls account for autoplay restrictions. Next-project navigation uses the selected project group and skips video-only explorations.

Content: overview, role/year/tools/type, challenge, approach, decisions, outcome, gallery and live link. Different projects may add flows/personas. The separate exploration viewer is a native dialog with a scaled/fading media panel and video controls.

### 8. Game (home.html:566–643, 2222–2359)

Take a Break invitation with floating bricks; button opens a native canvas-game dialog. Breakout-style paddle/ball collision game removes interface clutter to expose a clean design beneath it. Mouse, touch, arrow keys and Space supported. Score, lives, levels, best score, retry/end states; shake and red flash on damage. Local best score and optional server-backed game/leaderboard operations exist. Opening/closing was checked; gameplay completion and leaderboard submission were not tested.

### 9. Tools marquee (home.html:646–657)

Two repeated horizontal tracks moving in opposite directions: 48s and 54s linear infinite. Hover pauses each track. Reduced motion stops animation and enables manual horizontal scrolling. Duplicates are decorative/aria-hidden with an accessible description.

### 10. Process (home.html:544–565, 2701–2716, 2870–3016)

220vh section with sticky viewport stage. Four steps: Spark, Sketch, Shape, Ship. Normalized section scroll × 3 chooses active step by rounding. Tabs can smoothly scroll to each stage; each rail segment fills from progress.

Outgoing step: opacity and 18px translation, 200ms. Incoming: opacity 500ms and transform 700ms after 120ms delay. A Three.js point cloud morphs through a light bulb, sketch/pencil, interface phone, and rocket. Actual samplers, rather than older explanatory comments, establish those shapes.

10,000 points normally; 5,200 below 760px. All four target sets share particle identities, shuffled to create crossing trajectories. GPU shader handles interpolation, colour, point size and noise. Morph progress eases toward the rounded active stage with dt × 6.5; the shape completes even if scrolling stops. Gentle sway and pointer interaction add depth. Narrow layout moves the shape between heading and text.

### 11. Footer (home.html:1192–1228, 2718–2740)

Fixed contact panel behind the main document; a spacer equals its measured height. Scrolling the main content away reveals it like a curtain. Saturated accent background, oversized CONTACT ME, availability, email/copy action, social links and back-to-top.

Reveal fraction r = clamp((scrollY + viewportHeight - mainBottom) / footerHeight, 0, 1). Title scaleY = max(.125, r). Footer translates vertically by (1 - scaleY) × footerHeight × .2475. Sign-off follows with delayed opacity, up to 60px translation, -9deg skew and scaleY(.6 → 1). Copy email has success feedback. Reduced motion removes stretching/skew choreography.

### 12. Theme picker (home.html:470–498, 2189–2217)

Floating circular button and rotating multicolour ring. Four swatches fan along an arc from 188deg to 80deg with radius at least 60px. Swatches open with a 600ms spring curve, stagger 35ms; close in 160ms. Choosing a theme recolours CSS and dispatches themechange for WebGL/material updates. Escape, outside click and scroll close it. A hint appears about 3s after intro and times out after 8s. SessionStorage carries colour across pages; refresh resets to Plum.

## About page

Real linked document at about.html. Sections: introduction, four roles, experience, design rule, personal facts, hiring CTA. Sticky table of contents tracks active section with an IntersectionObserver; selected underline moves/scales over 450ms; narrow navigation scrolls the active tab into view.

Role accordion opens one at a time using grid-template-rows 0fr → 1fr over 400ms and icon rotation over 300ms. A vertical rail fills as scrolling advances. Reveal blocks move 18px over 900ms with 800ms opacity. Animated SVG details include rings, buzz, heartbeat, hop, float, chat, musical notes and shake gestures.

Cross-document View Transitions are enabled where supported. The homepage portrait and About avatar share wendy-photo; its transition lasts 600ms ease-out. Unsupported browsers load documents normally; reduced motion disables this transition.

## Hire page

Separate focused contact page at hire.html: back link, availability ping, headline, name/email/message fields and submit action. Focus transitions on fields last 200ms; button transform 160ms; arrow movement 300ms; a success state has a small scale/fade entrance. Validation occurs on blur for nonempty fields and on input after errors. Submission logic was inspected, not exercised. Do not treat a source-level happy path as proof of real email delivery.

## Responsive and fallback requirements for a future implementation

- Treat each component breakpoint separately: 560px tile stacking; 640px navigation; 760px hero/particle adjustments; 860px About/process/case layout; 900px tile columns.
- Reduced-motion users skip the intro, auto flipping, parallax/magnetic/cursor effects and continuous decorative motion. Preserve content and usable navigation with simple fades/static visuals.
- Pause rendering and media offscreen and when document hidden; cap DPR; clean up animation loops, observers and listeners in React.
- Keep semantic headings, keyboard alternatives to dragging, labelled dialogs, Escape/back behaviour, focus restoration, accessible filter state and noncanvas fallbacks.
- The dormant More dialog, support comparison template and extra 3D ring source are not equivalent to verified live homepage sections. Separate active features from unused code when rebuilding.

## Mapping to the current React project (proposal only)

Hero.jsx → hybrid badge/rope scene and responsive typographic stage.
Navbar.jsx → threshold-driven floating nav and mobile menu.
FeaturedProjects.jsx / Projects.jsx → video tiles, filters and cursor affordance.
New case-study dialog → curtain controller, deep link/history, scroll-stage syncing.
Experience/About → portrait transition, role accordion and scrollspy.
ProcessSection.jsx → sticky four-step narrative + particle scene.
Footer.jsx / CTASection.jsx → fixed reveal panel.
ThemeToggle.jsx → four-palette picker backed by CSS variables and shared theme context.
Shared motion helpers → reveal observer, reduced-motion policy, visibility scheduler, cleanup.

No migration or redesign has been applied. The next instruction can choose what to adapt, which content to retain, and how closely to match the reference.
