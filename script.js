/* ==========================================
   PREMIUM PORTFOLIO - script.js
   ========================================== */

'use strict';

/* ============================================================
   PREMIUM CURSOR SYSTEM
   — dot (mix-blend-mode:difference, exact position)
   — spinning-gradient ring (spring-follow, context-aware)
   — glowing particle trail (canvas)
   ============================================================ */

const curDot   = document.getElementById('curDot');
const curRing  = document.getElementById('curRing');
const curLabel = document.getElementById('curLabel');

/* -- mouse position -- */
let mx = -200, my = -200;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  curDot.style.left = mx + 'px';
  curDot.style.top  = my + 'px';
}, { passive: true });

/* -- spring-follow ring -- */
let rx = -200, ry = -200;

(function springLoop() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  curRing.style.left = rx + 'px';
  curRing.style.top  = ry + 'px';
  requestAnimationFrame(springLoop);
})();

/* -- context-aware states -- */
const cursorMap = [
  { sel: '.project-card',                         state: 'view',   label: 'VIEW ↗' },
  { sel: '.btn, .nav-cta, button[type="submit"]', state: 'button', label: ''        },
  { sel: 'a, .social-link, .back-top',            state: 'link',   label: ''        },
  { sel: '.skill-card, .cert-card, .exp-card',    state: 'card',   label: ''        },
];

cursorMap.forEach(({ sel }) => {
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener('mouseenter', () => curDot.classList.add('hovering'));
    el.addEventListener('mouseleave', () => curDot.classList.remove('hovering'));
  });
});

/* -- click burst -- */
document.addEventListener('mousedown', () => {
  curDot.classList.add('clicking');
  curRing.classList.add('clicking');
});
document.addEventListener('mouseup', () => {
  curDot.classList.remove('clicking');
  curRing.classList.remove('clicking');
});

/* -- hide/show on page leave/enter -- */
document.addEventListener('mouseleave', () => {
  curDot.style.opacity  = '0';
  curRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  curDot.style.opacity  = '1';
  curRing.style.opacity = '1';
});

/* ---- CURSOR TRAIL CANVAS ---- */
const trailCanvas = document.getElementById('trailCanvas');
const trailCtx    = trailCanvas.getContext('2d');
let trail = [];
let lastTrailMs = 0;

function resizeTrail() {
  trailCanvas.width  = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeTrail();
window.addEventListener('resize', resizeTrail, { passive: true });

document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastTrailMs < 22) return;
  lastTrailMs = now;
  trail.push({
    x:     e.clientX,
    y:     e.clientY,
    r:     Math.random() * 2.8 + 1.2,
    alpha: 0.65,
    hue:   Math.random() > 0.55 ? 210 : 198,
    speed: Math.random() * 0.025 + 0.018,
  });
}, { passive: true });

(function trailLoop() {
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  for (let i = trail.length - 1; i >= 0; i--) {
    const p = trail[i];
    p.alpha -= p.speed;
    p.r     *= 0.975;
    if (p.alpha <= 0) { trail.splice(i, 1); continue; }
    trailCtx.save();
    trailCtx.globalAlpha = p.alpha;
    trailCtx.shadowColor = `hsl(${p.hue},85%,65%)`;
    trailCtx.shadowBlur  = 10;
    trailCtx.fillStyle   = `hsl(${p.hue},85%,65%)`;
    trailCtx.beginPath();
    trailCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    trailCtx.fill();
    trailCtx.restore();
  }
  requestAnimationFrame(trailLoop);
})();

/* ---- Particle Canvas ---- */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() > 0.6 ? 210 : 200; // Salesforce blue or aqua
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `hsl(${this.hue}, 80%, 65%)`;
    ctx.shadowColor = `hsl(${this.hue}, 80%, 65%)`;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  const count = Math.min(80, Math.floor(canvas.width * canvas.height / 16000));
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawConnections() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#0176D3';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  cancelAnimationFrame(animFrame);
  resizeCanvas();
  initParticles();
  animateParticles();
});

/* ---- Navbar Scroll Effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNavLink();
}, { passive: true });

/* ---- Active Nav Link on Scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-link]');

function highlightNavLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ---- Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinksEl.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ---- Intersection Observer for Reveal Animations ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Animate skill bars when they appear
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) {
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* Also observe skill cards for bar animation */
document.querySelectorAll('.skill-card').forEach(card => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          setTimeout(() => {
            fill.style.width = fill.getAttribute('data-width') + '%';
          }, 200);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(card);
});

/* ---- Hero Trigger ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
      el.classList.add('revealed');
    });
  }, 100);
});

/* ---- Rotating Words ---- */
const words = document.querySelectorAll('.word');
let currentWord = 0;

function rotateWords() {
  if (!words.length) return;
  words[currentWord].classList.remove('active');
  words[currentWord].classList.add('exit');
  setTimeout(() => { words[currentWord].classList.remove('exit'); }, 500);
  currentWord = (currentWord + 1) % words.length;
  words[currentWord].classList.add('active');
}
setInterval(rotateWords, 2600);

/* ---- Counter Animation ---- */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---- 3D Tilt on Project Cards ---- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- Magnetic Button Effect ---- */
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/mjgagavw', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });

      if (res.ok) {
        contactForm.innerHTML = `
          <div class="form-success">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>Message Sent!</h3>
            <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
          </div>
        `;
      } else {
        btn.innerHTML = '<span>Send Message</span>';
        btn.disabled = false;
        alert('Something went wrong. Please try again.');
      }
    } catch {
      btn.innerHTML = '<span>Send Message</span>';
      btn.disabled = false;
      alert('Network error. Please try again.');
    }
  });
}

/* ---- Smooth Scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Size rotating-words container to widest word ---- */
function sizeRotatingWords() {
  const container = document.querySelector('.rotating-words');
  if (!container) return;
  const wordEls = container.querySelectorAll('.word');
  let maxWidth = 0;
  wordEls.forEach(w => {
    const prev = w.style.cssText;
    w.style.cssText = 'position:absolute;opacity:0;transform:none;white-space:nowrap;transition:none';
    maxWidth = Math.max(maxWidth, w.offsetWidth);
    w.style.cssText = prev;
  });
  if (maxWidth > 0) container.style.minWidth = (maxWidth + 4) + 'px';
}

/* ---- Page Load Animation ---- */
document.documentElement.style.opacity = '0';
window.addEventListener('load', () => {
  document.documentElement.style.transition = 'opacity 0.6s ease';
  document.documentElement.style.opacity = '1';
  sizeRotatingWords();
  // Re-measure after web fonts finish loading (Space Grotesk may load slightly late)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(sizeRotatingWords);
  }
});

/* ---- Parallax on hero orbs ---- */
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (orb1) orb1.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 15}px, ${-y * 15}px)`;
}, { passive: true });

/* ---- Typing cursor blink in code block ---- */
const codeBody = document.querySelector('.code-body code');
if (codeBody) {
  const cursor_span = document.createElement('span');
  cursor_span.style.cssText = `
    display: inline-block;
    width: 2px;
    height: 1em;
    background: #6366f1;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  `;
  const style = document.createElement('style');
  style.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
  document.head.appendChild(style);
  codeBody.appendChild(cursor_span);
}

/* ---- Navbar link click close + stat trigger on load ---- */
window.addEventListener('load', () => {
  // Trigger hero stats counter if already visible
  if (heroStats) {
    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      heroStats.querySelectorAll('.stat-num').forEach(animateCounter);
    }
  }
});
