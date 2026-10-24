const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => 'Rs.' + n.toLocaleString('en-PK');

function openWhatsApp(text) {
  const url = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
  const w = window.open(url, '_blank');
  if (w) w.opener = null; else location.href = url;
}

function lockScroll(on) {
  document.documentElement.classList.toggle('lock', on);
}

let toastTimer;
function showToast(msg) {
  const t = $('#toast');
  $('#toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// header background once you scroll past the hero top
const hdr = $('#hdr');
let headerTick = false;
function syncHeader() {
  if (headerTick) return;
  headerTick = true;
  requestAnimationFrame(() => {
    hdr.classList.toggle('scrolled', scrollY > 40);
    headerTick = false;
  });
}
addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

// mobile nav
const navLinks = $('#navLinks');
const burger = $('.burger');
function setNav(open) {
  navLinks.classList.toggle('open', open);
  burger.classList.toggle('x', open);
  burger.setAttribute('aria-expanded', open);
  hdr.classList.toggle('menu-open', open);
}
burger.addEventListener('click', () => setNav(!navLinks.classList.contains('open')));
$$('a', navLinks).forEach(a => a.addEventListener('click', () => setNav(false)));
document.addEventListener('click', e => {
  if (navLinks.classList.contains('open') && !e.target.closest('#navLinks, .burger')) setNav(false);
});

// scroll reveal (images and cards only; text is never hidden)
const revealIO = 'IntersectionObserver' in window && !reduceMotion
  ? new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px' })
  : null;
function observeReveals(root = document) {
  $$('[data-reveal]:not(.in)', root).forEach(el => revealIO ? revealIO.observe(el) : el.classList.add('in'));
}
observeReveals();

// hero parallax, mouse only
if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const plates = $$('.hero [data-depth]').map(el => ({ el, d: +el.dataset.depth }));
  let mx = 0, my = 0, frame = 0;
  addEventListener('mousemove', e => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
    if (frame || scrollY > innerHeight) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      plates.forEach(({ el, d }) => {
        el.style.transform = `translate3d(${(mx * 28 * d).toFixed(1)}px, ${(my * 20 * d).toFixed(1)}px, 0)`;
      });
    });
  }, { passive: true });
}

// embers behind the hero
(function () {
  const c = $('#embers');
  if (reduceMotion || !c) return;
  const ctx = c.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const colors = ['242,165,22', '226,59,46', '247,189,74'];
  let W = 0, H = 0, parts = [], raf = 0, onScreen = true;

  function size() {
    W = c.offsetWidth; H = c.offsetHeight;
    c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function seed() {
    const n = Math.min(40, Math.floor(W / 30));
    parts = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.6, s: Math.random() * 0.45 + 0.2,
      o: Math.random() * 0.5 + 0.25, dx: Math.random() * 0.5 - 0.25,
      col: colors[i % colors.length],
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.y -= p.s; p.x += p.dx;
      if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
      ctx.globalAlpha = p.o;
      ctx.fillStyle = `rgb(${p.col})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }
  const start = () => { if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(draw); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  size(); seed();
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(size, 150); }, { passive: true });
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? start() : stop(); }).observe($('.hero'));
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
})();

$('#year').textContent = new Date().getFullYear();
