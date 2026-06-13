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
  const preloadDuration = 2000;
  const preloadStart = performance.now();

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
  let preloaderDone = false;
  const interval = setInterval(() => {
    const elapsed = performance.now() - preloadStart;
    const prog = Math.min(100, (elapsed / preloadDuration) * 100);
    fillEl.style.width = prog + '%';
    numEl.textContent = Math.round(prog) + '%';
    if (prog >= 100 && !preloaderDone) {
      preloaderDone = true;
      clearInterval(interval);
      exitPreloader();
    }
  }, 30);

  function exitPreloader() {
    const pl = document.getElementById('preloader');
    fillEl.style.width = '100%';
    numEl.textContent = '100%';
    pl.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    pl.style.opacity = '0';
    pl.style.transform = 'scale(1.05)';
    setTimeout(() => { pl.style.display = 'none'; }, 450);
  }
})();

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
  if (el.dataset.animated === 'true') return;
  el.dataset.animated = 'true';
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = value + (progress === 1 ? suffix : '');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.count-up').forEach(el => animateCounter(el));
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('#home, #trust').forEach(section => observer.observe(section));
}
window.addEventListener('load', () => setTimeout(initCounters, 2100));

// ===== HERO GSAP =====
gsap.registerPlugin(ScrollTrigger, TextPlugin);
window.addEventListener('load', () => {
  gsap.set(['#hero-badge','#hero-title','#hero-sub','#hero-btns','#hero-stats'], { y: 30 });
  const tl = gsap.timeline({ delay: 2.1 });
  tl.to('#hero-badge', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0)
    .to('#hero-title', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.2)
    .to('#hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.5)
    .to('#hero-btns', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.8)
    .to('#hero-stats', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1);
});

// ===== JOURNEY ANIMATION =====
window.addEventListener('load', () => {
  const journey = document.querySelector('#journey');
  const progress = document.querySelector('.journey-progress');
  const steps = gsap.utils.toArray('.journey-step');
  if (!journey || !progress || steps.length === 0) return;

  gsap.set(steps, { y: 24, opacity: 0 });

  const journeyTl = gsap.timeline({
    scrollTrigger: {
      trigger: journey,
      start: 'top 68%',
      once: true
    }
  });

  journeyTl
    .to(steps, {
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger: 0.14,
      ease: 'power3.out'
    })
    .to(progress, {
      width: '84%',
      duration: 1.35,
      ease: 'power2.inOut'
    }, 0.12);

  steps.forEach((step, index) => {
    journeyTl.call(() => step.classList.add('is-active'), null, 0.24 + (index * 0.18));
  });
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

// ===== VISITOR COUNTER API =====
(function() {
  const countEl = document.getElementById('visit-count');
  if (!countEl) return;

  // Unique namespace and key for CounterAPI
  const namespace = 'thehindianspokenhindiacademy';
  const key = 'pageviews';

  // Increments and retrieves the count
  fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`)
    .then(res => {
      if (!res.ok) throw new Error('CounterAPI response error');
      return res.json();
    })
    .then(data => {
      if (data && typeof data.count === 'number') {
        // Format the count with local number separators (e.g., 1,234)
        countEl.textContent = data.count.toLocaleString();
      }
    })
    .catch(err => {
      console.warn('Visitor counter failed to load:', err);
      // Silently hide the counter badge if the API is blocked or offline
      const badge = countEl.closest('.visitor-counter');
      if (badge) {
        badge.style.display = 'none';
      }
    });
})();
