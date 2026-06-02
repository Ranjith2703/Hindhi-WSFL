// ===== PRELOADER =====
(function() {
  const quotes = [
    "Teaching creates thoughts",
    "Thoughts create actions",
    "Actions create Success"
  ];
  let qi = 0;
  const qEl = document.getElementById('preloader-quote');
  const fillEl = document.getElementById('progress-fill');
  const numEl = document.getElementById('progress-num');
  const logo = document.getElementById('preloader-logo');
  const sub = document.getElementById('preloader-sub');

  // Fade in logo
  setTimeout(() => {
    logo.style.transition = 'opacity 0.8s ease';
    logo.style.opacity = '1';
    sub.style.transition = 'opacity 0.8s ease 0.3s';
    sub.style.opacity = '1';
  }, 400);

  // Quote cycling
  function showQuote() {
    qEl.style.opacity = '0';
    qEl.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      qEl.textContent = quotes[qi % quotes.length];
      qEl.style.opacity = '1';
      qi++;
      if (qi < quotes.length) {
        setTimeout(showQuote, 1200);
      }
    }, 500);
  }
  setTimeout(showQuote, 700);

  // Progress
  let prog = 0;
  const interval = setInterval(() => {
    prog = Math.min(100, prog + Math.random() * 6 + 2);
    fillEl.style.width = prog + '%';
    numEl.textContent = Math.round(prog) + '%';
    if (prog >= 100) {
      clearInterval(interval);
      setTimeout(exitPreloader, 600);
    }
  }, 60);

  function exitPreloader() {
    const pl = document.getElementById('preloader');
    pl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    pl.style.opacity = '0';
    pl.style.transform = 'scale(1.05)';
    setTimeout(() => { pl.style.display = 'none'; }, 800);
  }
})();

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
const glow = document.getElementById('cursorGlow');
let mx = 0, my = 0, fx = 0, fy = 0, gx = 0, gy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top = my - 6 + 'px';
  fx += (mx - fx - 20) * 0.18;
  fy += (my - fy - 20) * 0.18;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  gx += (mx - gx - 40) * 0.08;
  gy += (my - gy - 40) * 0.08;
  glow.style.left = gx + 'px';
  glow.style.top = gy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .course-card, .feature-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2)'; follower.style.transform = 'scale(1.5)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; follower.style.transform = 'scale(1)'; });
});

// ===== SCROLL PROGRESS =====
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== PARTICLES =====
(function() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251,191,36,${p.o})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== AOS =====
AOS.init({ duration: 800, once: true, easing: 'ease-out-quad', offset: 60 });

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = target === 100 ? '%' : '+';
  let current = 0;
  const step = target / 50;
  const t = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current) + (current >= target ? suffix : '');
    if (current >= target) clearInterval(t);
  }, 35);
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.trust-num').forEach(el => animateCounter(el));
      observer.disconnect();
    }
  });
}, { threshold: 0.5 });
const trustSection = document.getElementById('trust');
if (trustSection) observer.observe(trustSection);

// ===== HERO GSAP =====
gsap.registerPlugin(ScrollTrigger, TextPlugin);
window.addEventListener('load', () => {
  const tl = gsap.timeline({ delay: 3.5 });
  tl.to('#hero-badge', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0)
    .to('#hero-title', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.2)
    .to('#hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.5)
    .to('#hero-btns', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.8);

  gsap.set(['#hero-badge','#hero-title','#hero-sub','#hero-btns'], { y: 30 });
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== FAQ =====
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ===== SWIPER TESTIMONIALS =====
new Swiper('.swiper-testimonials', {
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  autoplay: { delay: 4000, disableOnInteraction: false },
  pagination: { el: '.swiper-testimonials .swiper-pagination', clickable: true },
  breakpoints: {
    768: { slidesPerView: 2 },
    1100: { slidesPerView: 3 }
  }
});

// ===== SWIPER GALLERY =====
new Swiper('.swiper-gallery', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: { delay: 3000, disableOnInteraction: false },
  pagination: { el: '.swiper-gallery .swiper-pagination', clickable: true },
  breakpoints: {
    600: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

// ===== VANILLA TILT =====
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max: 8, speed: 400, glare: true, 'max-glare': 0.05
  });
}

// ===== PARALLAX =====
window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelectorAll('.hero-float-1, .hero-float-2, .hero-float-3').forEach((el, i) => {
    const factor = (i + 1) * 0.4;
    el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});