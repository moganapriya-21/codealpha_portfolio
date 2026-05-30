/* ═══════════════════════════════════════════════════════════════
   MOGANAPRIYA SANKAR — PORTFOLIO 2026
   script.js — All interactivity & dynamic behaviour
   ═══════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────
   1. LOAD HTML SECTIONS DYNAMICALLY
   Fetches each section/component HTML file
   and injects it into the placeholder div
────────────────────────────────────────── */
async function loadSection(id, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load: ${filePath}`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.warn(err.message);
  }
}

async function loadAllSections() {
  // Load components first (navbar, footer)
  await loadSection('navbar-placeholder',     'components/navbar.html');
  await loadSection('footer-placeholder',     'components/footer.html');

  // Load page sections in order
  await loadSection('hero-placeholder',       'sections/hero.html');
  await loadSection('about-placeholder',      'sections/about.html');
  await loadSection('skills-placeholder',     'sections/skills.html');
  await loadSection('projects-placeholder',   'sections/projects.html');
  await loadSection('internship-placeholder', 'sections/internship.html');
  await loadSection('resume-placeholder',     'sections/resume.html');
  await loadSection('contact-placeholder',    'sections/contact.html');

  // After all sections are loaded, initialise everything
  initAll();
}


/* ──────────────────────────────────────────
   2. INITIALISE ALL FEATURES
────────────────────────────────────────── */
function initAll() {
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initSkillBars();
  initScrollTopBtn();
  initActiveNavLinks();
}


/* ──────────────────────────────────────────
   3. NAVBAR
   - Adds .scrolled class on scroll
   - Hamburger toggle for mobile menu
────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  // Add shadow/border when user scrolls down
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger open / close
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
}


/* ──────────────────────────────────────────
   4. TYPING EFFECT (Hero Section)
   Cycles through role titles with a
   typewriter animation
────────────────────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  // Words to cycle through
  const roles = [
    'Aspiring Full Stack Developer',
    'Frontend Developer',
    'SQL & Database Enthusiast',
    'Manual Tester',
    'Problem Solver',
  ];

  let roleIndex  = 0;   // which word we're on
  let charIndex  = 0;   // how many chars are typed
  let isDeleting = false;

  const TYPE_SPEED   = 80;   // ms per character when typing
  const DELETE_SPEED = 40;   // ms per character when deleting
  const PAUSE_END    = 1800; // pause at end of word (ms)
  const PAUSE_START  = 400;  // pause before typing next word (ms)

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      // Remove one character
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing — pause then start deleting
      delay = PAUSE_END;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next word
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      delay = PAUSE_START;
    }

    setTimeout(type, delay);
  }

  type(); // kick off
}


/* ──────────────────────────────────────────
   5. SCROLL REVEAL ANIMATION
   Uses IntersectionObserver to add
   .visible class when elements enter view
────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for sibling elements
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.querySelectorAll('.reveal')]
            : [];
          const order = siblings.indexOf(entry.target);
          const delay  = order >= 0 ? order * 80 : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12 } // trigger when 12% of element is visible
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ──────────────────────────────────────────
   6. SKILL BAR ANIMATION
   Animates width of .skill-fill elements
   when the Skills section scrolls into view
────────────────────────────────────────── */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  if (!skillSection) return;

  const fills = skillSection.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fills.forEach((fill, i) => {
            const targetWidth = fill.getAttribute('data-width') + '%';
            // Stagger each bar slightly
            setTimeout(() => {
              fill.style.width = targetWidth;
            }, i * 120);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(skillSection);
}


/* ──────────────────────────────────────────
   7. SCROLL-TO-TOP BUTTON
   Shows after scrolling 400px, smooth
   scrolls back to top on click
────────────────────────────────────────── */
function initScrollTopBtn() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ──────────────────────────────────────────
   8. ACTIVE NAV LINK HIGHLIGHT
   Highlights the nav link for whichever
   section is currently in the viewport
────────────────────────────────────────── */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active from all links
          navLinks.forEach(l => l.classList.remove('active'));

          // Add active to matching link
          const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' } // trigger near centre of viewport
  );

  sections.forEach(sec => observer.observe(sec));
}


/* ──────────────────────────────────────────
   9. CONTACT FORM HANDLER
   Validates fields and shows success msg
   (wire up to a backend / EmailJS later)
────────────────────────────────────────── */
function handleContactSubmit() {
  const name    = document.getElementById('contactName');
  const email   = document.getElementById('contactEmail');
  const subject = document.getElementById('contactSubject');
  const msg     = document.getElementById('contactMsg');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('sendMsgBtn');

  if (!name || !email || !msg) return;

  // Simple validation
  if (!name.value.trim()) {
    shakeInput(name); return;
  }
  if (!isValidEmail(email.value)) {
    shakeInput(email); return;
  }
  if (!msg.value.trim()) {
    shakeInput(msg); return;
  }

  // Simulate sending (replace with real API call / EmailJS)
  btn.disabled = true;
  btn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Sending…';

  setTimeout(() => {
    // Reset form
    name.value    = '';
    email.value   = '';
    if (subject) subject.value = '';
    msg.value     = '';

    // Show success banner
    if (success) success.classList.add('show');

    btn.disabled = false;
    btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';

    // Hide success after 5 seconds
    setTimeout(() => success && success.classList.remove('show'), 5000);
  }, 1500);
}

/* Helper: basic email regex check */
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

/* Helper: shake animation for invalid input */
function shakeInput(el) {
  el.style.borderColor = '#f87171';
  el.style.animation   = 'shake 0.4s ease';

  // Add shake keyframes once
  if (!document.getElementById('shakeStyle')) {
    const style = document.createElement('style');
    style.id = 'shakeStyle';
    style.textContent = `
      @keyframes shake {
        0%,100%{ transform:translateX(0); }
        20%    { transform:translateX(-6px); }
        40%    { transform:translateX(6px); }
        60%    { transform:translateX(-4px); }
        80%    { transform:translateX(4px); }
      }`;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    el.style.borderColor = '';
    el.style.animation   = '';
  }, 500);
}


/* ──────────────────────────────────────────
   10. SMOOTH ANCHOR SCROLL (fallback)
   For browsers that don't support
   scroll-behavior: smooth natively
────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  const targetId = anchor.getAttribute('href').slice(1);
  const target   = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


/* ──────────────────────────────────────────
   BOOT — Run everything on DOM ready
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', loadAllSections);