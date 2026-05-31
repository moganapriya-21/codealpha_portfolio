
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

  await loadSection('navbar-placeholder',     'components/navbar.html');
  await loadSection('footer-placeholder',     'components/footer.html');


  await loadSection('hero-placeholder',       'sections/hero.html');
  await loadSection('about-placeholder',      'sections/about.html');
  await loadSection('skills-placeholder',     'sections/skills.html');
  await loadSection('projects-placeholder',   'sections/projects.html');
  await loadSection('internship-placeholder', 'sections/internship.html');
  await loadSection('resume-placeholder',     'sections/resume.html');
  await loadSection('contact-placeholder',    'sections/contact.html');

  
  initAll();
}

function initAll() {
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initSkillBars();
  initScrollTopBtn();
  initActiveNavLinks();
}



function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;


  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

   
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
}



function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

 
  const roles = [
    'Aspiring Full Stack Developer',
    'Frontend Developer',
    'SQL & Database Enthusiast',
    'Manual Tester',
    'Problem Solver',
  ];

  let roleIndex  = 0;   
  let charIndex  = 0;   
  let isDeleting = false;

  const TYPE_SPEED   = 80;   
  const DELETE_SPEED = 40;   
  const PAUSE_END    = 1800; 
  const PAUSE_START  = 400;  

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
 
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
  
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === current.length) {
  
      delay = PAUSE_END;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
    
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      delay = PAUSE_START;
    }

    setTimeout(type, delay);
  }

  type();
}


function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
         
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.querySelectorAll('.reveal')]
            : [];
          const order = siblings.indexOf(entry.target);
          const delay  = order >= 0 ? order * 80 : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target); 
        }
      });
    },
    { threshold: 0.12 } 
  );

  revealEls.forEach(el => observer.observe(el));
}


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

function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
         
          navLinks.forEach(l => l.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' } 
  );

  sections.forEach(sec => observer.observe(sec));
}

function handleContactSubmit() {
  const name    = document.getElementById('contactName');
  const email   = document.getElementById('contactEmail');
  const subject = document.getElementById('contactSubject');
  const msg     = document.getElementById('contactMsg');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('sendMsgBtn');

  if (!name || !email || !msg) return;

  
  if (!name.value.trim()) {
    shakeInput(name); return;
  }
  if (!isValidEmail(email.value)) {
    shakeInput(email); return;
  }
  if (!msg.value.trim()) {
    shakeInput(msg); return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Sending…';

  setTimeout(() => {
  
    name.value    = '';
    email.value   = '';
    if (subject) subject.value = '';
    msg.value     = '';

    if (success) success.classList.add('show');

    btn.disabled = false;
    btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';

   
    setTimeout(() => success && success.classList.remove('show'), 5000);
  }, 1500);
}
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function shakeInput(el) {
  el.style.borderColor = '#f87171';
  el.style.animation   = 'shake 0.4s ease';

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


document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  const targetId = anchor.getAttribute('href').slice(1);
  const target   = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.addEventListener('DOMContentLoaded', loadAllSections);
